"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Notification from "@components/Notification";
import Styles from "@styles/form.module.css"; // ✅ Usa el estilo estándar
import { use } from 'react';

function EditFacultad({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [facultad, setFacultad] = useState({
    FacultadCodigo: "",
    FacultadNombre: "",
    FacultadDecano: "",
    FacultadDireccion: "",
    FacultadTelefono: "",
    FacultadEmail: "",
    Facultad_UniversidadFK: "",
    Facultad_CampusFK: "",
    FacultadEstado: "",
  });

  const [universidades, setUniversidades] = useState([]);
  const [campusList, setCampusList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const facultadRes = await fetch(`${API}api/facultad/${id}/`);
        const facultadData = await facultadRes.json();
        setFacultad(facultadData);

        const univRes = await fetch(`${API}universidades`);
        const campusRes = await fetch(`${API}campus`);
        const universidadesData = await univRes.json();
        const campusData = await campusRes.json();

        setUniversidades(universidadesData);
        setCampusList(campusData);
      } catch (error) {
        Notification.alertError("Error al cargar datos.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, API]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFacultad((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}api/facultad/edit/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(facultad),
      });

      if (response.ok) {
        Notification.alertSuccess("Facultad actualizada correctamente.");
        router.push("/facultadList");
      } else {
        Notification.alertError("Error al actualizar la facultad.");
      }
    } catch (err) {
      console.error("Update error:", err);
      Notification.alertError("Ocurrió un error inesperado.");
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Editar Facultad</h1>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadCodigo">Código</label>
          <input
            type="text"
            id="FacultadCodigo"
            value={facultad.FacultadCodigo}
            onChange={handleChange}
            required
            placeholder="Ej: F001"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadNombre">Nombre</label>
          <input
            type="text"
            id="FacultadNombre"
            value={facultad.FacultadNombre}
            onChange={handleChange}
            required
            placeholder="Nombre de la facultad"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadDecano">Decano</label>
          <input
            type="text"
            id="FacultadDecano"
            value={facultad.FacultadDecano}
            onChange={handleChange}
            required
            placeholder="Nombre del decano"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadDireccion">Dirección</label>
          <input
            type="text"
            id="FacultadDireccion"
            value={facultad.FacultadDireccion}
            onChange={handleChange}
            required
            placeholder="Dirección completa"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadTelefono">Teléfono</label>
          <input
            type="text"
            id="FacultadTelefono"
            value={facultad.FacultadTelefono}
            onChange={handleChange}
            required
            placeholder="Ej: +1 809 123 4567"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadEmail">Email</label>
          <input
            type="email"
            id="FacultadEmail"
            value={facultad.FacultadEmail}
            onChange={handleChange}
            required
            placeholder="correo@facultad.edu"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Facultad_UniversidadFK">Universidad</label>
          <select
            id="Facultad_UniversidadFK"
            value={facultad.Facultad_UniversidadFK}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione una Universidad --</option>
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
            value={facultad.Facultad_CampusFK}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione un Campus --</option>
            {campusList.map((c) => (
              <option key={c.CampusID} value={c.CampusID}>
                {c.CampusNombre}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadEstado">Estado</label>
          <select
            id="FacultadEstado"
            value={facultad.FacultadEstado}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione Estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.btn_group}>
          <button type="submit" className={Styles.btn}>
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(EditFacultad);

