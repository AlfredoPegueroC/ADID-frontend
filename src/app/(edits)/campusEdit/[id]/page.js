"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "@utils/withAuth";
import Notification from "@components/Notification";
import Styles from "@styles/form.module.css"; // usa el mismo estilo que facultad
import { use } from 'react';
function EditCampus({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [campus, setCampus] = useState({
    CampusCodigo: "",
    CampusNombre: "",
    CampusDireccion: "",
    CampusCiudad: "",
    CampusProvincia: "",
    CampusPais: "",
    CampusTelefono: "",
    CampusCorreoContacto: "",
    Campus_UniversidadFK: "",
    CampusEstado: "",
  });

  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const campusRes = await fetch(`${API}api/campus/${id}/`);
        const campusData = await campusRes.json();
        setCampus(campusData);

        const univRes = await fetch(`${API}universidades`);
        const universidadesData = await univRes.json();
        setUniversidades(universidadesData);
      } catch (error) {
        console.error("Error cargando datos:", error);
        Notification.alertError("Error al cargar datos del campus.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, API]);

  // 🔧 Normaliza el ID de universidad si viene como objeto
  useEffect(() => {
    if (
      campus?.Campus_UniversidadFK &&
      typeof campus.Campus_UniversidadFK === "object" &&
      campus.Campus_UniversidadFK.UniversidadID
    ) {
      setCampus((prev) => ({
        ...prev,
        Campus_UniversidadFK: campus.Campus_UniversidadFK.UniversidadID,
      }));
    }
  }, [campus.Campus_UniversidadFK]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCampus((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}api/campus/edit/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campus),
      });

      if (response.ok) {
        Notification.alertSuccess("Campus actualizado correctamente.");
        router.push("/campusList");
      } else {
        Notification.alertError("Error al actualizar el campus.");
      }
    } catch (err) {
      console.error("Error en actualización:", err);
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
        <h1 className={Styles.title}>Editar Campus</h1>

        {/* Código */}
        <div className={Styles.name_group}>
          <label htmlFor="CampusCodigo">Código</label>
          <input
            type="text"
            id="CampusCodigo"
            value={campus.CampusCodigo}
            onChange={handleChange}
            required
            placeholder="Ej: C001"
          />
        </div>

        {/* Nombre */}
        <div className={Styles.name_group}>
          <label htmlFor="CampusNombre">Nombre</label>
          <input
            type="text"
            id="CampusNombre"
            value={campus.CampusNombre}
            onChange={handleChange}
            required
            placeholder="Nombre del campus"
          />
        </div>

        {/* Dirección */}
        <div className={Styles.name_group}>
          <label htmlFor="CampusDireccion">Dirección</label>
          <input
            type="text"
            id="CampusDireccion"
            value={campus.CampusDireccion}
            onChange={handleChange}
            required
            placeholder="Dirección"
          />
        </div>

        {/* Ciudad */}
        <div className={Styles.name_group}>
          <label htmlFor="CampusCiudad">Ciudad</label>
          <input
            type="text"
            id="CampusCiudad"
            value={campus.CampusCiudad}
            onChange={handleChange}
            required
            placeholder="Ciudad"
          />
        </div>

        {/* Provincia */}
        <div className={Styles.name_group}>
          <label htmlFor="CampusProvincia">Provincia</label>
          <input
            type="text"
            id="CampusProvincia"
            value={campus.CampusProvincia}
            onChange={handleChange}
            required
            placeholder="Provincia"
          />
        </div>

        {/* País */}
        <div className={Styles.name_group}>
          <label htmlFor="CampusPais">País</label>
          <input
            type="text"
            id="CampusPais"
            value={campus.CampusPais}
            onChange={handleChange}
            required
            placeholder="País"
          />
        </div>

        {/* Teléfono */}
        <div className={Styles.name_group}>
          <label htmlFor="CampusTelefono">Teléfono</label>
          <input
            type="text"
            id="CampusTelefono"
            value={campus.CampusTelefono}
            onChange={handleChange}
            required
            placeholder="Ej: +1 809 000 0000"
          />
        </div>

        {/* Correo */}
        <div className={Styles.name_group}>
          <label htmlFor="CampusCorreoContacto">Correo de Contacto</label>
          <input
            type="email"
            id="CampusCorreoContacto"
            value={campus.CampusCorreoContacto}
            onChange={handleChange}
            required
            placeholder="correo@campus.edu"
          />
        </div>

        {/* Universidad */}
        <div className={Styles.name_group}>
          <label htmlFor="Campus_UniversidadFK">Universidad</label>
          <select
            id="Campus_UniversidadFK"
            value={campus.Campus_UniversidadFK}
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

        {/* Estado */}
        <div className={Styles.name_group}>
          <label htmlFor="CampusEstado">Estado</label>
          <select
            id="CampusEstado"
            value={campus.CampusEstado}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione Estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        {/* Botón */}
        <div className={Styles.btn_group}>
          <button type="submit" className={Styles.btn}>
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(EditCampus);
