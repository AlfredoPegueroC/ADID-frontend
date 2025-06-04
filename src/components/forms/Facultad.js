"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Notification from "../Notification";
import Styles from "@styles/form.module.css";

export default function Facultad({ title }) {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [universidades, setUniversidades] = useState([]);
  const [campus, setCampus] = useState([]);

  const [formData, setFormData] = useState({
    FacultadCodigo: "",
    FacultadNombre: "",
    FacultadDecano: "",
    FacultadDireccion: "",
    FacultadTelefono: "",
    FacultadEmail: "",
    FacultadEstado: "",
    Facultad_UniversidadFK: "",
    Facultad_CampusFK: "",
  });

  useEffect(() => {
    const fetchUniversidades = async () => {
      try {
        const res = await fetch(`${API}api/universidad`);
        const data = await res.json();
        setUniversidades(data.results || data);
      } catch (error) {
        console.error("Error cargando universidades:", error);
      }
    };

    const fetchCampus = async () => {
      try {
        const res = await fetch(`${API}api/campus`);
        const data = await res.json();
        setCampus(data.results || data);
        console.log(data.results)
      } catch (error) {
        console.error("Error cargando campus:", error);
      }
    };

    fetchUniversidades();
    fetchCampus();
  }, [API]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}api/facultad/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        Notification.alertSuccess(`Facultad creada: ${result.FacultadNombre}`);
        router.push("/facultadList");
      } else {
        const error = await response.json();
        Notification.alertError("Error al crear la facultad.");
        console.log("Error:", error);
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
          <label htmlFor="FacultadCodigo">Código</label>
          <input
            type="text"
            id="FacultadCodigo"
            value={formData.FacultadCodigo}
            onChange={handleChange}
            placeholder="Ej. F001"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadNombre">Nombre</label>
          <input
            type="text"
            id="FacultadNombre"
            value={formData.FacultadNombre}
            onChange={handleChange}
            placeholder="Nombre de la facultad"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadDecano">Decano</label>
          <input
            type="text"
            id="FacultadDecano"
            value={formData.FacultadDecano}
            onChange={handleChange}
            placeholder="Nombre del decano"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadDireccion">Dirección</label>
          <input
            type="text"
            id="FacultadDireccion"
            value={formData.FacultadDireccion}
            onChange={handleChange}
            placeholder="Dirección de la facultad"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadTelefono">Teléfono</label>
          <input
            type="text"
            id="FacultadTelefono"
            value={formData.FacultadTelefono}
            onChange={handleChange}
            placeholder="809-000-0000"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadEmail">Email</label>
          <input
            type="email"
            id="FacultadEmail"
            value={formData.FacultadEmail}
            onChange={handleChange}
            placeholder="correo@facultad.edu.do"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadEstado">Estado</label>
          <select
            id="FacultadEstado"
            value={formData.FacultadEstado}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Facultad_UniversidadFK">Universidad</label>
          <select
            id="Facultad_UniversidadFK"
            value={formData.Facultad_UniversidadFK}
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

        <div className={Styles.name_group}>
          <label htmlFor="Facultad_CampusFK">Campus</label>
          <select
            id="Facultad_CampusFK"
            value={formData.Facultad_CampusFK}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione un campus --</option>
            {campus.map((c) => (
              <option key={c.CampusID} value={c.CampusID}>
                {c.CampusNombre}
              </option>
            ))}
          </select>
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
