"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "@utils/withAuth";
import Notification from "@components/Notification";
import Styles from "@styles/form.module.css";
import Select from "react-select";
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const campusRes = await fetch(`${API}api/campus/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const univRes = await fetch(`${API}universidades`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!campusRes.ok || !univRes.ok) throw new Error("Error al cargar datos");

        const campusData = await campusRes.json();
        const universidadesData = await univRes.json();

        setCampus({
          ...campusData,
          Campus_UniversidadFK:
            typeof campusData.Campus_UniversidadFK === "object"
              ? campusData.Campus_UniversidadFK.UniversidadID
              : campusData.Campus_UniversidadFK,
        });

        setUniversidades(
          universidadesData.map((u) => ({
            label: u.UniversidadNombre,
            value: u.UniversidadID,
          }))
        );
      } catch (error) {
        console.error("Error:", error);
        Notification.alertError("Error al cargar datos del campus.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, API]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCampus((prev) => ({ ...prev, [id]: value }));
  };

  const handleUniversidadChange = (selectedOption) => {
    setCampus((prev) => ({
      ...prev,
      Campus_UniversidadFK: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${API}api/campus/edit/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
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
    } finally {
      setSubmitting(false);
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

        <div className={Styles.name_group}>
          <label htmlFor="CampusCodigo">Código</label>
          <input
            type="text"
            id="CampusCodigo"
            value={campus.CampusCodigo}
            onChange={handleChange}
            required
            disabled
            placeholder="Ej: C001"
          />
        </div>

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

        <div className={Styles.name_group}>
          <label>Universidad</label>
          <Select
            options={universidades}
            value={universidades.find((u) => u.value === campus.Campus_UniversidadFK) || null}
            onChange={handleUniversidadChange}
            placeholder="Seleccione una universidad"
            isClearable
          />
        </div>

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

        <div className={Styles.btn_group}>
          <button type="submit" className={Styles.btn} disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(EditCampus);
