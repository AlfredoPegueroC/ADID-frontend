"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";
import Select from "react-select";
import { fetchUniversidades } from "@api/universidadService";

export default function AccionForm({ title }) {
  const router = useRouter();
  const [universidades, setUniversidades] = useState([]);
  const [loadingUniversidades, setLoadingUniversidades] = useState(false);

  const [formData, setFormData] = useState({
    AccionCodigo: "",
    AccionNombre: "",
    AccionEstado: "",
    Accion_UniversidadFK: null,
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

  const handleInputChange = (inputValue) => {
    cargarUniversidades(inputValue || "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, Accion_UniversidadFK: selectedOption }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      Accion_UniversidadFK: formData.Accion_UniversidadFK?.value || null,
    };
    const accessToken = localStorage.getItem("accessToken");

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
        await response.json();
        Notification.alertSuccess("Acción creada correctamente");
        router.push("/accionList");
        setFormData({
          AccionCodigo: "",
          AccionNombre: "",
          AccionEstado: "",
          Accion_UniversidadFK: null,
        });
      } else {
        const error = await response.json();
        Notification.alertError(
          "Error al crear la Acción. Ya existe o faltan datos."
        );
        console.error("Error:", error);
      }
    } catch (error) {
      Notification.alertError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>{title}</h1>

        <div className={Styles.name_group}>
          <label htmlFor="AccionCodigo">Código:</label>
          <input
            type="text"
            id="AccionCodigo"
            name="AccionCodigo"
            value={formData.AccionCodigo}
            onChange={handleChange}
            placeholder="Ej. AC001"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="AccionNombre">Nombre:</label>
          <input
            type="text"
            id="AccionNombre"
            name="AccionNombre"
            value={formData.AccionNombre}
            onChange={handleChange}
            placeholder="Ej. Asignar / Eliminar / Modificar"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="AccionEstado">Estado:</label>
          <select
            id="AccionEstado"
            name="AccionEstado"
            value={formData.AccionEstado}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione el estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Accion_UniversidadFK">Universidad:</label>
          <Select
            id="Accion_UniversidadFK"
            name="Accion_UniversidadFK"
            options={universidades}
            value={formData.Accion_UniversidadFK}
            onChange={handleSelectChange}
            onInputChange={handleInputChange}
            placeholder="Seleccione una universidad"
            isClearable
            isLoading={loadingUniversidades}
            noOptionsMessage={() => "No se encontraron universidades"}
          />
        </div>

        <div className={Styles.btn_group}>
          <button type="submit" className={Styles.btn}>
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
