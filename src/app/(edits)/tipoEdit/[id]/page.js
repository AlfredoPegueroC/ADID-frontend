"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AsyncSelect from "react-select/async";
import Notification from "@components/Notification";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";
import { fetchUniversidades } from "@api/universidadService";

function TipoEdit({ params }) {
  const router = useRouter();
  const { id } = params;
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [tipo, setTipo] = useState({
    TipoDocenteCodigo: "",
    TipoDocenteDescripcion: "",
    TipoDocenteEstado: "",
    TipoDocente_UniversidadFK: "",
  });

  const [selectedUniversidad, setSelectedUniversidad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchTipo() {
      setLoading(true);
      const token = localStorage.getItem("accessToken") || "";
      try {
        const res = await fetch(`${API}api/tipodocente/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar tipo docente");
        const data = await res.json();

        const universidadCodigo =
          typeof data.universidadCodigo === "object"
            ? data.universidadCodigo
            : data.universidadCodigo;
        setTipo({ ...data, universidadCodigo });

        // Si tenemos solo el id de la universidad, hacemos fetch para obtener el nombre
        if (universidadCodigo) {
          // Obtener nombre universidad con fetch para mostrar label en select
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
        } else {
          setSelectedUniversidad(null);
        }
      } catch (error) {
        console.error(error);
        Notification.alertError("Error al cargar datos del tipo docente.");
      } finally {
        setLoading(false);
      }
    }
    fetchTipo();
  }, [id, API]);

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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setTipo((prev) => ({ ...prev, [id]: value }));
  };

  const handleUniversidadChange = (selectedOption) => {
    setTipo((prev) => ({
      ...prev,
      TipoDocente_UniversidadFK: selectedOption ? selectedOption.value : "",
    }));
    setSelectedUniversidad(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("accessToken") || "";

    try {
      const res = await fetch(`${API}api/tipodocente/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tipo),
      });

      if (res.ok) {
        Notification.alertSuccess("Tipo Docente actualizado correctamente.");
        router.push("/tipodocenteList");
      } else {
        Notification.alertError("Error al actualizar el tipo docente.");
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
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Editar Tipo Docente</h1>

        <div className={Styles.name_group}>
          <label htmlFor="TipoDocenteCodigo">Código</label>
          <input
            type="text"
            id="TipoDocenteCodigo"
            value={tipo.TipoDocenteCodigo}
            onChange={handleChange}
            required
            disabled
            placeholder="Ej: T001"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="TipoDocenteDescripcion">Descripción</label>
          <input
            type="text"
            id="TipoDocenteDescripcion"
            value={tipo.TipoDocenteDescripcion}
            onChange={handleChange}
            required
            placeholder="Ej: Docente a tiempo completo"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="TipoDocenteEstado">Estado</label>
          <select
            id="TipoDocenteEstado"
            value={tipo.TipoDocenteEstado}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione Estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
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
            inputId="TipoDocente_UniversidadFK"
            name="TipoDocente_UniversidadFK"
          />
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

export default withAuth(TipoEdit);
