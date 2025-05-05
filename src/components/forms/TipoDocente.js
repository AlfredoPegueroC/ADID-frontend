"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";

export default function TipoDocenteForm() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [universidades, setUniversidades] = useState([]);
  const [formData, setFormData] = useState({
    TipoDocenteCodigo: "",
    TipoDocenteDescripcion: "",
    TipoDocenteEstado: "",
    TipoDocente_UniversidadFK: "",
  });

  useEffect(() => {
    const fetchUniversidades = async () => {
      try {
        const res = await fetch(`${API}api/universidad`);
        const data = await res.json();
        setUniversidades(data.results || data);
      } catch (error) {
        console.error("Error al cargar universidades:", error);
      }
    };

    fetchUniversidades();
  }, [API]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}api/tipodocente/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await response.json();
        Notification.alertSuccess("Tipo de Docente creado correctamente");
        router.push("/tipodocenteList");

        setFormData({
          TipoDocenteCodigo: "",
          TipoDocenteDescripcion: "",
          TipoDocenteEstado: "",
          TipoDocente_UniversidadFK: "",
        });
      } else {
        const error = await response.json();
        Notification.alertError("Error al crear el tipo de docente. Ya existe o faltan datos.");
        console.error("Error:", error);
      }
    } catch (error) {
      Notification.alertError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Registrar Tipo de Docente</h1>

        <div className={Styles.name_group}>
          <label htmlFor="TipoDocenteCodigo">Código:</label>
          <input
            type="text"
            id="TipoDocenteCodigo"
            name="TipoDocenteCodigo"
            value={formData.TipoDocenteCodigo}
            onChange={handleChange}
            placeholder="Ej. TPD001"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="TipoDocenteDescripcion">Descripción:</label>
          <input
            type="text"
            id="TipoDocenteDescripcion"
            name="TipoDocenteDescripcion"
            value={formData.TipoDocenteDescripcion}
            onChange={handleChange}
            placeholder="Ej. Docente Tiempo Completo"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="TipoDocenteEstado">Estado:</label>
          <select
            id="TipoDocenteEstado"
            name="TipoDocenteEstado"
            value={formData.TipoDocenteEstado}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione el estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="TipoDocente_UniversidadFK">Universidad:</label>
          <select
            id="TipoDocente_UniversidadFK"
            name="TipoDocente_UniversidadFK"
            value={formData.TipoDocente_UniversidadFK}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione una universidad --</option>
            {universidades.map((u) => (
              <option key={u.UniversidadID} value={u.UniversidadID}>
                {u.UniversidadNombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={Styles.btn}>
          Enviar
        </button>
      </form>
    </div>
  );
}
