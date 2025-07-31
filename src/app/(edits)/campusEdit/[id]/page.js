"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AsyncSelect from "react-select/async";
import withAuth from "@utils/withAuth";
import Notification from "@components/Notification";
import Styles from "@styles/form.module.css";
import { fetchUniversidades } from "@api/universidadService";

function EditCampus({ params }) {
  const router = useRouter();
  const { id } = params;
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

  const [selectedUniversidad, setSelectedUniversidad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Cargar campus y universidad para mostrar en el select
  useEffect(() => {
    async function fetchCampus() {
      setLoading(true);
      const token = localStorage.getItem("accessToken") || "";
      try {
        // Fetch campus
        const resCampus = await fetch(`${API}api/campus/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resCampus.ok) throw new Error("Error cargando campus");
        const dataCampus = await resCampus.json();

        const universidadCodigo =
          typeof dataCampus.universidadCodigo === "object"
            ? dataCampus.universidadCodigo // aquí
            : dataCampus.universidadCodigo;
        
        setCampus({ ...dataCampus, universidadCodigo: universidadCodigo });
        if (universidadCodigo) {
          const resUni = await fetch(
            `${API}api/universidad/${universidadCodigo}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!resUni.ok) throw new Error("Universidad no encontrada");
          const dataUni = await resUni.json();

          setSelectedUniversidad({
            value: dataUni.UniversidadID,
            label: dataUni.UniversidadNombre || "Sin nombre",
          });
        }
      } catch (error) {
        console.error(error);
        Notification.alertError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    fetchCampus();
  }, [API, id]);

  // 2. Función para cargar universidades en búsqueda dinámica
  const cargarUniversidades = useCallback(async (inputValue) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchUniversidades(1, inputValue, 10, token);
      return results.map((u) => ({
        value: u.UniversidadID,
        label: u.UniversidadNombre,
      }));
    } catch (error) {
      console.error(error);
      Notification.alertError("Error cargando universidades");
      return [];
    }
  }, []);

  // 3. Manejadores de cambios
  const handleChange = (e) => {
    const { id, value } = e.target;
    setCampus((prev) => ({ ...prev, [id]: value }));
  };

  const handleUniversidadChange = (option) => {
    setSelectedUniversidad(option);
    setCampus((prev) => ({
      ...prev,
      Campus_UniversidadFK: option ? option.value : "",
    }));
  };

  // 4. Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("accessToken") || "";

    try {
      const res = await fetch(`${API}api/campus/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(campus),
      });

      if (res.ok) {
        Notification.alertSuccess("Campus actualizado");
        router.push("/campusList");
      } else {
        Notification.alertError("Error actualizando campus");
      }
    } catch (error) {
      console.error(error);
      Notification.alertError("Error inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Editar Campus</h1>

        <div className={Styles.name_group}>
          <label htmlFor="CampusCodigo">Código</label>
          <input
            id="CampusCodigo"
            type="text"
            value={campus.CampusCodigo}
            onChange={handleChange}
            disabled
            required
            placeholder="Ej: C001"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusNombre">Nombre</label>
          <input
            id="CampusNombre"
            type="text"
            value={campus.CampusNombre}
            onChange={handleChange}
            required
            placeholder="Nombre del campus"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusDireccion">Dirección</label>
          <input
            id="CampusDireccion"
            type="text"
            value={campus.CampusDireccion}
            onChange={handleChange}
            required
            placeholder="Dirección"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusCiudad">Ciudad</label>
          <input
            id="CampusCiudad"
            type="text"
            value={campus.CampusCiudad}
            onChange={handleChange}
            required
            placeholder="Ciudad"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusProvincia">Provincia</label>
          <input
            id="CampusProvincia"
            type="text"
            value={campus.CampusProvincia}
            onChange={handleChange}
            required
            placeholder="Provincia"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusPais">País</label>
          <input
            id="CampusPais"
            type="text"
            value={campus.CampusPais}
            onChange={handleChange}
            required
            placeholder="País"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusTelefono">Teléfono</label>
          <input
            id="CampusTelefono"
            type="text"
            value={campus.CampusTelefono}
            onChange={handleChange}
            required
            placeholder="Ej: +1 809 000 0000"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusCorreoContacto">Correo de Contacto</label>
          <input
            id="CampusCorreoContacto"
            type="email"
            value={campus.CampusCorreoContacto}
            onChange={handleChange}
            required
            placeholder="correo@campus.edu"
          />
        </div>

        <div className={Styles.name_group}>
          <label>Universidad</label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={cargarUniversidades}
            value={selectedUniversidad}
            onChange={handleUniversidadChange}
            placeholder="Seleccione una universidad"
            isClearable
            noOptionsMessage={() => "No se encontraron universidades"}
            menuPlacement="auto"
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
