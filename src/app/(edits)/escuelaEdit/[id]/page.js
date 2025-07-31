"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AsyncSelect from "react-select/async";
import Notification from "@components/Notification";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";

import { fetchUniversidades } from "@api/universidadService";
import { fetchFacultades } from "@api/facultadService";

function EditEscuela({ params }) {
  const router = useRouter();
  const { id } = params;
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [escuela, setEscuela] = useState({
    EscuelaCodigo: "",
    EscuelaNombre: "",
    EscuelaDirectora: "",
    EscuelaTelefono: "",
    EscuelaCorreo: "",
    Escuela_UniversidadFK: "",
    Escuela_facultadFK: "",
    EscuelaEstado: "",
  });

  const [selectedUniversidad, setSelectedUniversidad] = useState(null);
  const [selectedFacultad, setSelectedFacultad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("accessToken") || "";
      try {
        const res = await fetch(`${API}api/escuela/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar datos");
        const data = await res.json();

        const universidadCodigo =
          typeof data.universidadCodigo === "object"
            ? data.universidadCodigo
            : data.universidadCodigo;

        const facultadCodigo =
          typeof data.facultadCodigo === "object"
            ? data.facultadCodigo
            : data.facultadCodigo;
        setEscuela({ ...data, universidadCodigo, facultadCodigo });

        // Universidad actual
        if (universidadCodigo) {
          const resUni = await fetch(
            `${API}api/universidad/${universidadCodigo}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (resUni.ok) {
            const uniData = await resUni.json();
            setSelectedUniversidad({
              value: uniData.UniversidadID,
              label: uniData.UniversidadNombre,
            });
          }
        }

        // Facultad actual
        if (facultadCodigo) {
          const resFac = await fetch(`${API}api/facultad/${facultadCodigo}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resFac.ok) {
            const facData = await resFac.json();
            setSelectedFacultad({
              value: facData.FacultadID,
              label: facData.FacultadNombre,
            });
          }
        }
      } catch (error) {
        console.error("Error:", error);
        Notification.alertError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [API, id]);

  const loadUniversidades = useCallback(async (inputValue) => {
    const token = localStorage.getItem("accessToken") || "";
    try {
      const { results } = await fetchUniversidades(1, inputValue, 10, token);
      return results.map((u) => ({
        value: u.UniversidadID,
        label: u.UniversidadNombre,
      }));
    } catch (error) {
      console.error("Error al cargar universidades:", error);
      Notification.alertError("No se pudieron cargar las universidades");
      return [];
    }
  }, []);

  const loadFacultades = useCallback(async (inputValue) => {
    const token = localStorage.getItem("accessToken") || "";
    try {
      const { results } = await fetchFacultades(1, inputValue, 10, token);
      return results.map((f) => ({
        value: f.FacultadID,
        label: f.FacultadNombre,
      }));
    } catch (error) {
      console.error("Error al cargar facultades:", error);
      Notification.alertError("No se pudieron cargar las facultades");
      return [];
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEscuela((prev) => ({ ...prev, [id]: value }));
  };

  const handleUniversidadChange = (selectedOption) => {
    setEscuela((prev) => ({
      ...prev,
      Escuela_UniversidadFK: selectedOption ? selectedOption.value : "",
    }));
    setSelectedUniversidad(selectedOption);
  };

  const handleFacultadChange = (selectedOption) => {
    setEscuela((prev) => ({
      ...prev,
      Escuela_facultadFK: selectedOption ? selectedOption.value : "",
    }));
    setSelectedFacultad(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API}api/escuela/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(escuela),
      });

      if (response.ok) {
        Notification.alertSuccess("Escuela editada exitosamente.");
        router.push("/escuelaList");
      } else {
        Notification.alertError("Fallo al editar la escuela.");
      }
    } catch (error) {
      console.error("Error:", error);
      Notification.alertError("Fallo al editar la escuela.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Editar Escuela</h1>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaCodigo">Código</label>
          <input
            type="text"
            id="EscuelaCodigo"
            value={escuela.EscuelaCodigo || ""}
            onChange={handleChange}
            required
            disabled
            placeholder="Ej: ESC123"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaNombre">Nombre</label>
          <input
            type="text"
            id="EscuelaNombre"
            value={escuela.EscuelaNombre || ""}
            onChange={handleChange}
            required
            placeholder="Nombre de la escuela"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaDirectora">Directora</label>
          <input
            type="text"
            id="EscuelaDirectora"
            value={escuela.EscuelaDirectora || ""}
            onChange={handleChange}
            required
            placeholder="Nombre completo de la directora"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaTelefono">Teléfono</label>
          <input
            type="text"
            id="EscuelaTelefono"
            value={escuela.EscuelaTelefono || ""}
            onChange={handleChange}
            required
            placeholder="Ej: +1 809 123 4567"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaCorreo">Correo</label>
          <input
            type="email"
            id="EscuelaCorreo"
            value={escuela.EscuelaCorreo || ""}
            onChange={handleChange}
            required
            placeholder="correo@escuela.edu"
          />
        </div>

        <div className={Styles.name_group}>
          <label>Universidad</label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadUniversidades}
            value={selectedUniversidad}
            onChange={handleUniversidadChange}
            placeholder="Seleccione una universidad"
            isClearable
            noOptionsMessage={() => "Escribe para buscar universidades"}
            inputId="Escuela_UniversidadFK"
          />
        </div>

        <div className={Styles.name_group}>
          <label>Facultad</label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadFacultades}
            value={selectedFacultad}
            onChange={handleFacultadChange}
            placeholder="Seleccione una facultad"
            isClearable
            noOptionsMessage={() => "Escribe para buscar facultades"}
            inputId="Escuela_facultadFK"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaEstado">Estado</label>
          <select
            id="EscuelaEstado"
            value={escuela.EscuelaEstado || ""}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione estado</option>
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

export default withAuth(EditEscuela);
