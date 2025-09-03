"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AsyncSelect from "react-select/async";
import Notification from "@components/Notification";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";

import { fetchUniversidades } from "@api/universidadService";
import { fetchFacultades } from "@api/facultadService";
import { fetchEscuelas } from "@api/escuelaService";

function EditAsignatura({ params }) {
  const router = useRouter();
  const { id } = params;
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [asignatura, setAsignatura] = useState({
    AsignaturaCodigo: "",
    AsignaturaNombre: "",
    AsignaturaCreditos: "",
    AsignaturaHorasTeoricas: "",
    AsignaturaHorasPracticas: "",
    AsignaturaEstado: "",
    Asignatura_UniversidadFK: "",
    Asignatura_FacultadFK: "",
    Asignatura_EscuelaFK: "",
  });

  const [selectedUniversidad, setSelectedUniversidad] = useState(null);
  const [selectedFacultad, setSelectedFacultad] = useState(null);
  const [selectedEscuela, setSelectedEscuela] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("accessToken") || "";
      try {
        const res = await fetch(`${API}api/asignatura/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar datos");
        const data = await res.json();

        setAsignatura(data);

        // Universidad actual
        if (data.universidadCodigo) {
          const resUni = await fetch(
            `${API}api/universidad/${data.universidadCodigo}/`,
            { headers: { Authorization: `Bearer ${token}` } }
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
        if (data.facultadCodigo) {
          const resFac = await fetch(
            `${API}api/facultad/${data.facultadCodigo}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (resFac.ok) {
            const facData = await resFac.json();
            setSelectedFacultad({
              value: facData.FacultadID,
              label: facData.FacultadNombre,
            });
          }
        }

        // Escuela actual
        if (data.escuelaCodigo) {
          const resEsc = await fetch(
            `${API}api/escuela/${data.escuelaCodigo}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (resEsc.ok) {
            const escData = await resEsc.json();
            setSelectedEscuela({
              value: escData.EscuelaId,
              label: escData.EscuelaNombre,
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
      return [];
    }
  }, []);

  const loadEscuelas = useCallback(async (inputValue) => {
    const token = localStorage.getItem("accessToken") || "";
    try {
      const { results } = await fetchEscuelas(1, inputValue, 10, token);
      return results.map((e) => ({
        value: e.EscuelaID,
        label: e.EscuelaNombre,
      }));
    } catch (error) {
      console.error("Error al cargar escuelas:", error);
      return [];
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAsignatura((prev) => ({ ...prev, [id]: value }));
  };

  const handleUniversidadChange = (selectedOption) => {
    setAsignatura((prev) => ({
      ...prev,
      Asignatura_UniversidadFK: selectedOption ? selectedOption.value : "",
    }));
    setSelectedUniversidad(selectedOption);
  };

  const handleFacultadChange = (selectedOption) => {
    setAsignatura((prev) => ({
      ...prev,
      Asignatura_FacultadFK: selectedOption ? selectedOption.value : "",
    }));
    setSelectedFacultad(selectedOption);
  };

  const handleEscuelaChange = (selectedOption) => {
    setAsignatura((prev) => ({
      ...prev,
      Asignatura_EscuelaFK: selectedOption ? selectedOption.value : "",
    }));
    setSelectedEscuela(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API}api/asignatura/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(asignatura),
      });

      if (response.ok) {
        Notification.alertSuccess("Asignatura editada exitosamente.");
        router.push("/asignaturaList");
      } else {
        Notification.alertError("Fallo al editar la asignatura.");
      }
    } catch (error) {
      console.error("Error:", error);
      Notification.alertError("Fallo al editar la asignatura.");
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
        <h1 className={Styles.title}>Editar Asignatura</h1>

        <div className={Styles.name_group}>
          <label htmlFor="AsignaturaCodigo">Código</label>
          <input
            type="text"
            id="AsignaturaCodigo"
            value={asignatura.AsignaturaCodigo || ""}
            onChange={handleChange}
            disabled
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="AsignaturaNombre">Nombre</label>
          <input
            type="text"
            id="AsignaturaNombre"
            value={asignatura.AsignaturaNombre || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="AsignaturaCreditos">Créditos</label>
          <input
            type="number"
            id="AsignaturaCreditos"
            value={asignatura.AsignaturaCreditos || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="AsignaturaHorasTeoricas">Horas Teóricas</label>
          <input
            type="number"
            id="AsignaturaHorasTeoricas"
            value={asignatura.AsignaturaHorasTeoricas || ""}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="AsignaturaHorasPracticas">Horas Prácticas</label>
          <input
            type="number"
            id="AsignaturaHorasPracticas"
            value={asignatura.AsignaturaHorasPracticas || ""}
            onChange={handleChange}
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
            placeholder="Seleccione universidad"
            isClearable
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
            placeholder="Seleccione facultad"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Escuela</label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadEscuelas}
            value={selectedEscuela}
            onChange={handleEscuelaChange}
            placeholder="Seleccione escuela"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="AsignaturaEstado">Estado</label>
          <select
            id="AsignaturaEstado"
            value={asignatura.AsignaturaEstado || ""}
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

export default withAuth(EditAsignatura);
