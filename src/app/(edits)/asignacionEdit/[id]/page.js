"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";
import Notification from "@components/Notification";
import AsyncSelect from "react-select/async";

import { fetchDocentes } from "@api/docenteService";
import { fetchCampus } from "@api/campusService";
import { fetchUniversidades } from "@api/universidadService";
import { fetchFacultades } from "@api/facultadService";
import { fetchEscuelas } from "@api/escuelaService";
import { fetchPeriodos } from "@api/periodoService";

function AsignacionEdit({ params }) {
  const router = useRouter();
  const { id } = params;
  const searchParams = useSearchParams();
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [asignacion, setAsignacion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados para los valores seleccionados completos (objetos) de los selects
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedUniversidad, setSelectedUniversidad] = useState(null);
  const [selectedFacultad, setSelectedFacultad] = useState(null);
  const [selectedEscuela, setSelectedEscuela] = useState(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);

  // Funciones para cargar opciones async para cada select
  const loadDocentes = useCallback(
    async (inputValue) => {
      try {
        const token = localStorage.getItem("accessToken") || "";
        const { results } = await fetchDocentes(1, inputValue, 10, token);
        return results.map((d) => ({
          value: d.DocenteID,
          label: d.DocenteNombre,
        }));
      } catch (error) {
        console.error("Error al cargar docentes:", error);
        Notification.alertError("No se pudieron cargar los docentes");
        return [];
      }
    },
    []
  );

  const loadCampus = useCallback(
    async (inputValue) => {
      try {
        const token = localStorage.getItem("accessToken") || "";
        const { results } = await fetchCampus(1, inputValue, 10, token);
        return results.map((c) => ({
          value: c.CampusID,
          label: c.CampusNombre,
        }));
      } catch (error) {
        console.error("Error al cargar campus:", error);
        Notification.alertError("No se pudo cargar el campus");
        return [];
      }
    },
    []
  );

  const loadUniversidades = useCallback(
    async (inputValue) => {
      try {
        const token = localStorage.getItem("accessToken") || "";
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

  const loadFacultades = useCallback(
    async (inputValue) => {
      try {
        const token = localStorage.getItem("accessToken") || "";
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
    },
    []
  );

  const loadEscuelas = useCallback(
    async (inputValue) => {
      try {
        const token = localStorage.getItem("accessToken") || "";
        const { results } = await fetchEscuelas(1, inputValue, 10, token);
        return results.map((e) => ({
          value: e.EscuelaId,
          label: e.EscuelaNombre,
        }));
      } catch (error) {
        console.error("Error al cargar escuelas:", error);
        Notification.alertError("No se pudieron cargar las escuelas");
        return [];
      }
    },
    []
  );

  const loadPeriodos = useCallback(
    async (inputValue) => {
      try {
        const token = localStorage.getItem("accessToken") || "";
        const { results } = await fetchPeriodos(1, inputValue, 10, token);
        return results.map((p) => ({
          value: p.PeriodoID,
          label: p.PeriodoNombre,
        }));
      } catch (error) {
        console.error("Error al cargar periodos:", error);
        Notification.alertError("No se pudieron cargar los periodos");
        return [];
      }
    },
    []
  );

  // Cargar la asignación y los valores seleccionados completos al montar
  useEffect(() => {
    async function fetchAsignacion() {
      const token = localStorage.getItem("accessToken") || "";
      try {
        const res = await fetch(`${API}api/asignacion/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar la asignación");
        const data = await res.json();
        setAsignacion(data);

        // Para cada FK, crear el objeto {value, label} para mostrar en AsyncSelect
        // Idealmente, la API debería devolver el nombre junto al ID, si no, se debería hacer una consulta extra para obtener el nombre.
        setSelectedDocente(
          data.docenteFk
            ? { value: data.docenteFk, label: data.docenteNombre || "" }
            : null
        );
        setSelectedCampus(
          data.campusFk
            ? { value: data.campusFk, label: data.campusNombre || "" }
            : null
        );
        setSelectedUniversidad(
          data.universidadFk
            ? { value: data.universidadFk, label: data.universidadNombre || "" }
            : null
        );
        setSelectedFacultad(
          data.facultadFk
            ? { value: data.facultadFk, label: data.facultadNombre || "" }
            : null
        );
        setSelectedEscuela(
          data.escuelaFk
            ? { value: data.escuelaFk, label: data.escuelaNombre || "" }
            : null
        );
        setSelectedPeriodo(
          data.periodoFk
            ? { value: data.periodoFk, label: data.periodoNombre || "" }
            : null
        );
      } catch (error) {
        Notification.alertError("No se pudo cargar la asignación");
      } finally {
        setLoading(false);
      }
    }
    fetchAsignacion();
  }, [id, API]);

  // Cambios en inputs normales
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsignacion((prev) => ({ ...prev, [name]: value }));
  };

  // Cambios en selects async react-select
  const handleSelectChange = (selected, { name }) => {
    setAsignacion((prev) => ({
      ...prev,
      [name]: selected ? selected.value : "",
    }));

    // Actualizar el estado seleccionado para que el select muestre la opción
    switch (name) {
      case "docenteFk":
        setSelectedDocente(selected);
        break;
      case "campusFk":
        setSelectedCampus(selected);
        break;
      case "universidadFk":
        setSelectedUniversidad(selected);
        break;
      case "facultadFk":
        setSelectedFacultad(selected);
        break;
      case "escuelaFk":
        setSelectedEscuela(selected);
        break;
      case "periodoFk":
        setSelectedPeriodo(selected);
        break;
      default:
        break;
    }
  };

  // Submit formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${API}api/asignacion/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(asignacion),
      });
      if (res.ok) {
        Notification.alertSuccess("Asignación actualizada");
        router.push("/");
      } else {
        Notification.alertError("Error al actualizar");
      }
    } catch (err) {
      Notification.alertError("Error inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !asignacion) return <div>Cargando...</div>;

  const inputFields = [
    "nrc",
    "clave",
    "nombre",
    "codigo",
    "seccion",
    "modalidad",
    "cupo",
    "inscripto",
    "horario",
    "dias",
    "aula",
    "creditos",
    "tipo",
    "accion",
  ];

  return (
    <FormLayout>
      <div className={Styles.container}>
        <form onSubmit={handleSubmit} className={Styles.form}>
          <h1 className={Styles.title}>Editar Asignación</h1>

          {inputFields.map((field) => (
            <div className={Styles.name_group} key={field}>
              <label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {field === "accion" ? (
                <select
                  name="accion"
                  id="accion"
                  value={asignacion.accion || "nuevo"}
                  onChange={handleChange}
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="modificado">Modificado</option>
                </select>
              ) : (
                <input
                  type={
                    ["cupo", "inscripto", "creditos"].includes(field)
                      ? "number"
                      : "text"
                  }
                  name={field}
                  id={field}
                  value={asignacion[field] || ""}
                  onChange={handleChange}
                  disabled={field === "nrc"}
                />
              )}
            </div>
          ))}

          {[
            { label: "Docente", name: "docenteFk", value: selectedDocente, loadOptions: loadDocentes },
            { label: "Campus", name: "campusFk", value: selectedCampus, loadOptions: loadCampus },
            { label: "Universidad", name: "universidadFk", value: selectedUniversidad, loadOptions: loadUniversidades },
            { label: "Facultad", name: "facultadFk", value: selectedFacultad, loadOptions: loadFacultades },
            { label: "Escuela", name: "escuelaFk", value: selectedEscuela, loadOptions: loadEscuelas },
            { label: "Periodo Académico", name: "periodoFk", value: selectedPeriodo, loadOptions: loadPeriodos },
          ].map(({ label, name, value, loadOptions }) => (
            <div className={Styles.name_group} key={name}>
              <label htmlFor={name}>{label}</label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                value={value}
                onChange={handleSelectChange}
                placeholder={`Seleccione ${label.toLowerCase()}`}
                isClearable
                name={name}
                inputId={name}
                noOptionsMessage={() => "No se encontraron opciones"}
                menuPlacement="auto"
              />
            </div>
          ))}

          <div className={Styles.btn_group}>
            <button type="submit" className={Styles.btn} disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(AsignacionEdit);
