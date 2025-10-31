"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";
import Select from "react-select";
import { fetchUniversidades } from "@api/universidadService";

export default function StatusForm({ title = "Crear Status" }) {
  const router = useRouter();

  const [universidades, setUniversidades] = useState([]);
  const [loadingUniversidades, setLoadingUniversidades] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    StatusCodigo: "",
    StatusNombre: "",
    StatusEstado: "Activo",
    Status_UniversidadFK: null, // { value, label }
  });

  useEffect(() => {
    cargarUniversidades("");
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

  const handleUniversidadInput = (inputValue) => {
    cargarUniversidades(inputValue || "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, Status_UniversidadFK: selectedOption }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.StatusCodigo.trim()) {
      Notification.alertError("El código del Status es requerido");
      return;
    }
    if (!formData.StatusNombre.trim()) {
      Notification.alertError("El nombre del Status es requerido");
      return;
    }
    if (!formData.Status_UniversidadFK) {
      Notification.alertError("Seleccione una Universidad");
      return;
    }

    const payload = {
      StatusCodigo: formData.StatusCodigo.trim(),
      StatusNombre: formData.StatusNombre.trim(),
      StatusEstado: formData.StatusEstado,
      Status_UniversidadFK: formData.Status_UniversidadFK.value,
    };

    const accessToken = localStorage.getItem("accessToken") || "";
    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}api/status/create`,
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
        Notification.alertSuccess("Status creado exitosamente");
        setFormData({
          StatusCodigo: "",
          StatusNombre: "",
          StatusEstado: "Activo",
          Status_UniversidadFK: null,
        });
        router.push("/statusList");
      } else {
        let errorMsg = "Desconocido";
        try {
          const err = await response.json();
          errorMsg = err?.message || JSON.stringify(err);
        } catch {}
        Notification.alertError(`Error al crear el Status: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error al crear el Status:", error);
      Notification.alertError("Error al crear el Status");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => router.back();

  return (
    <div className={Styles.form_container}>
      <h2 className={Styles.title}>{title}</h2>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <div className={Styles.row}>
          <div className={Styles.name_group}>
            <label htmlFor="StatusCodigo">Código *</label>
            <input
              id="StatusCodigo"
              name="StatusCodigo"
              type="text"
              value={formData.StatusCodigo}
              onChange={handleChange}
              placeholder="Ej: ST-001"
              className={Styles.input}
              autoComplete="off"
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="StatusNombre">Nombre *</label>
            <input
              id="StatusNombre"
              name="StatusNombre"
              type="text"
              value={formData.StatusNombre}
              onChange={handleChange}
              placeholder="Ej: Contratado / Licencia / Jubilado"
              className={Styles.input}
              autoComplete="off"
            />
          </div>
        </div>

        <div className={Styles.row}>
          <div className={Styles.name_group}>
            <label htmlFor="StatusEstado">Estado</label>
            <select
              id="StatusEstado"
              name="StatusEstado"
              value={formData.StatusEstado}
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
              name="Status_UniversidadFK"
              options={universidades}
              value={formData.Status_UniversidadFK}
              onChange={handleSelectChange}
              onInputChange={handleUniversidadInput}
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
