"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AsyncSelect from "react-select/async";
import Notification from "@components/Notification";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";

import { fetchUniversidades } from "@api/universidadService";
import { fetchCampus } from "@api/campusService";

function EditFacultad({ params }) {
  const router = useRouter();
  const { id } = params;
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [facultad, setFacultad] = useState({
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

  const [selectedUniversidad, setSelectedUniversidad] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Cargar facultad y cargar selects con sus labels iniciales
  useEffect(() => {
    async function fetchFacultad() {
      setLoading(true);
      const token = localStorage.getItem("accessToken") || "";
      try {
        const res = await fetch(`${API}api/facultad/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar facultad");
        const data = await res.json();


        const universidadCodigo =
          typeof data.universidadCodigo === "object"
            ? data.universidadCodigo
            : data.universidadCodigo;

        const campusCodigo =
          typeof data.campusCodigo === "object"
            ? data.campusCodigo
            : data.campusCodigo;

        setFacultad({ ...data, universidadCodigo, campusCodigo });

        // Cargar Universidad seleccionada para mostrar label
        if (universidadCodigo) {
          // Obtener nombre universidad con fetch para mostrar label en select
          const resUni = await fetch(`${API}api/universidad/${universidadCodigo}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!resUni.ok) throw new Error("Universidad no encontrada");
          const dataUni = await resUni.json();

          setSelectedUniversidad({
            value: dataUni.UniversidadID,
            label: dataUni.UniversidadNombre || "Sin nombre",
          });
        } else {
          setSelectedUniversidad(null);
        }

        // Cargar Campus seleccionado para mostrar label
        if (campusCodigo) {
          const resCampus = await fetch(`${API}api/campus/${campusCodigo}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resCampus.ok) {
            const campusData = await resCampus.json();
            setSelectedCampus({
              value: campusData.CampusID,
              label: campusData.CampusNombre || "Sin nombre",
            });
          }
        } else {
          setSelectedCampus(null);
        }
      } catch (error) {
        console.error(error);
        Notification.alertError("Error al cargar datos de la facultad.");
      } finally {
        setLoading(false);
      }
    }
    fetchFacultad();
  }, [API, id]);

  // Load universidades dinámicamente para AsyncSelect
  const loadUniversidades = useCallback(
    async (inputValue) => {
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
    },
    []
  );

  // Load campus dinámicamente para AsyncSelect
  const loadCampus = useCallback(
    async (inputValue) => {
      const token = localStorage.getItem("accessToken") || "";
      try {
        const { results } = await fetchCampus(1, inputValue, 10, token);
        return results.map((c) => ({
          value: c.CampusID,
          label: c.CampusNombre,
        }));
      } catch (error) {
        console.error("Error al cargar campus:", error);
        Notification.alertError("No se pudieron cargar los campus");
        return [];
      }
    },
    []
  );

  // Manejo input normal
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFacultad((prev) => ({ ...prev, [id]: value }));
  };

  // Manejo select universidad
  const handleUniversidadChange = (selectedOption) => {
    setFacultad((prev) => ({
      ...prev,
      Facultad_UniversidadFK: selectedOption ? selectedOption.value : "",
    }));
    setSelectedUniversidad(selectedOption);
  };

  // Manejo select campus
  const handleCampusChange = (selectedOption) => {
    setFacultad((prev) => ({
      ...prev,
      Facultad_CampusFK: selectedOption ? selectedOption.value : "",
    }));
    setSelectedCampus(selectedOption);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("accessToken") || "";
    try {
      const res = await fetch(`${API}api/facultad/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(facultad),
      });

      if (res.ok) {
        Notification.alertSuccess("Facultad actualizada correctamente.");
        router.push("/facultadList");
      } else {
        Notification.alertError("Error al actualizar la facultad.");
      }
    } catch (error) {
      console.error(error);
      Notification.alertError("Error inesperado.");
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
        <h1 className={Styles.title}>Editar Facultad</h1>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadCodigo">Código</label>
          <input
            type="text"
            id="FacultadCodigo"
            value={facultad.FacultadCodigo || ""}
            onChange={handleChange}
            disabled
            required
            placeholder="Ej: F001"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadNombre">Nombre</label>
          <input
            type="text"
            id="FacultadNombre"
            value={facultad.FacultadNombre || ""}
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
            value={facultad.FacultadDecano || ""}
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
            value={facultad.FacultadDireccion || ""}
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
            value={facultad.FacultadTelefono || ""}
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
            value={facultad.FacultadEmail || ""}
            onChange={handleChange}
            required
            placeholder="correo@facultad.edu"
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
            menuPlacement="auto"
            inputId="Facultad_UniversidadFK"
          />
        </div>

        <div className={Styles.name_group}>
          <label>Campus</label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadCampus}
            value={selectedCampus}
            onChange={handleCampusChange}
            placeholder="Seleccione un campus"
            isClearable
            noOptionsMessage={() => "Escribe para buscar campus"}
            menuPlacement="auto"
            inputId="Facultad_CampusFK"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadEstado">Estado</label>
          <select
            id="FacultadEstado"
            value={facultad.FacultadEstado || ""}
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

export default withAuth(EditFacultad);
