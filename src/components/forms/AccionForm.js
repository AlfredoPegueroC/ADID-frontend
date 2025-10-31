"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";
import Select from "react-select";
import { fetchUniversidades } from "@api/universidadService";

export default function AccionForm({ title = "Crear Acción" }) {
  const router = useRouter();

  const [universidades, setUniversidades] = useState([]);
  const [loadingUniversidades, setLoadingUniversidades] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    AccionCodigo: "",
    AccionNombre: "",
    AccionEstado: "Activo",
    Accion_UniversidadFK: null, // { value, label }
  });

  useEffect(() => {
    cargarUniversidades(""); // carga inicial
  }, []);

  const cargarUniversidades = async (search = "") => {
    setLoadingUniversidades(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results = [] } = await fetchUniversidades(1, search, 10, token);
      const opciones = results.map((u) => ({
        value: u.UniversidadID,
        label: u.UniversidadNombre,
      }));
      setUniversidades(opciones);
    } catch (error) {
      console.error("Error al cargar universidades:", error);
      Notification.alertError("No se pudieron cargar las universidades");
    } finally {
      setLoadingUniversidades(false);
    }
  };

  const handleInputChange = (inputValue) => {
    // Puedes limpiar espacios si lo prefieres:
    // const cleaned = (inputValue || "").replace(/\s+/g, " ").trim();
    cargarUniversidades(inputValue || "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      Accion_UniversidadFK: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación mínima
    if (!formData.AccionCodigo.trim()) {
      Notification.alertError("El código de la Acción es requerido");
      return;
    }
    if (!formData.AccionNombre.trim()) {
      Notification.alertError("El nombre de la Acción es requerido");
      return;
    }
    if (!formData.Accion_UniversidadFK) {
      Notification.alertError("Seleccione una Universidad");
      return;
    }

    const payload = {
      AccionCodigo: formData.AccionCodigo.trim(),
      AccionNombre: formData.AccionNombre.trim(),
      AccionEstado: formData.AccionEstado,
      Accion_UniversidadFK: formData.Accion_UniversidadFK.value, // solo el ID
    };

    const accessToken = localStorage.getItem("accessToken") || "";
    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}api/accion/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        Notification.alertSuccess("Acción creada exitosamente");
        // Reset rápido por si el usuario vuelve hacia atrás
        setFormData({
          AccionCodigo: "",
          AccionNombre: "",
          AccionEstado: "Activo",
          Accion_UniversidadFK: null,
        });
        router.push("/accionList");
      } else {
        let errorMsg = "Desconocido";
        try {
          const error = await response.json();
          errorMsg = error?.message || JSON.stringify(error);
        } catch (_) {}
        Notification.alertError(`Error al crear la Acción: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error al crear la Acción:", error);
      Notification.alertError("Error al crear la Acción");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className={Styles.form_container}>
      <h2 className={Styles.title}>{title}</h2>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <div className={Styles.row}>
          <div className={Styles.name_group}>
            <label htmlFor="AccionCodigo">Código *</label>
            <input
              id="AccionCodigo"
              name="AccionCodigo"
              type="text"
              value={formData.AccionCodigo}
              onChange={handleChange}
              placeholder="Ej: ACT-001"
              className={Styles.input}
              autoComplete="off"
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="AccionNombre">Nombre *</label>
            <input
              id="AccionNombre"
              name="AccionNombre"
              type="text"
              value={formData.AccionNombre}
              onChange={handleChange}
              placeholder="Ej: Asignar / Eliminar / Modificar"
              className={Styles.input}
              autoComplete="off"
            />
          </div>
        </div>

        <div className={Styles.row}>
          <div className={Styles.name_group}>
            <label htmlFor="AccionEstado">Estado</label>
            <select
              id="AccionEstado"
              name="AccionEstado"
              value={formData.AccionEstado}
              onChange={handleChange}
              className={Styles.select}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className={Styles.name_group}>
            <label>Universidad *</label>
            <Select
              name="Accion_UniversidadFK"
              options={universidades}
              value={formData.Accion_UniversidadFK}
              onChange={handleSelectChange}
              onInputChange={handleInputChange}
              isLoading={loadingUniversidades}
              placeholder="Seleccione universidad"
              isClearable
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <div className={Styles.actions}>
          <button
            type="button"
            className={Styles.btn_secondary}
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={Styles.btn_primary}
            disabled={submitting}
          >
            {submitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
