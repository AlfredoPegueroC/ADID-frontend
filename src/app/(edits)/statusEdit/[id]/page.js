"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AsyncSelect from "react-select/async";
import Notification from "@components/Notification";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";
import { fetchUniversidades } from "@api/universidadService";

function StatusEdit({ params }) {
  const router = useRouter();
  const { id } = React.use(params); ;
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [status, setStatus] = useState({
    StatusCodigo: "",
    StatusNombre: "",
    StatusEstado: "",
    Status_UniversidadFK: "", // ID
  });

  const [selectedUniversidad, setSelectedUniversidad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      setLoading(true);
      const token = localStorage.getItem("accessToken") || "";
      try {
        const res = await fetch(`${API}api/status/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar Status");
        const data = await res.json();

        // Guardamos todo lo que venga
        setStatus({
          StatusCodigo: data.StatusCodigo ?? "",
          StatusNombre: data.StatusNombre ?? "",
          StatusEstado: data.StatusEstado ?? "",
          Status_UniversidadFK:
            data.Status_UniversidadFK ?? data.universidadId ?? "",
        });

        // Intento robusto de setear el label actual:
        // Preferimos data.universidadCodigo -> pedir a /api/universidad/<codigo>/
        // Si no existe, y tenemos FK (id), podrías tener un endpoint /api/universidad/id/<id>/
        const universidadCodigo =
          typeof data.universidadCodigo === "object"
            ? null
            : data.universidadCodigo ?? null;

        if (universidadCodigo) {
          const resUni = await fetch(`${API}api/universidad/${universidadCodigo}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!resUni.ok) throw new Error("Universidad no encontrada");
          const dataUni = await resUni.json();
          setSelectedUniversidad({
            value: dataUni.UniversidadID,
            label: dataUni.UniversidadNombre || "Sin nombre",
          });
        } else if (data.Status_UniversidadFK) {
          // fallback: construir opción mínima si ya tienes el nombre en el serializer
          setSelectedUniversidad({
            value: data.Status_UniversidadFK,
            label: data.universidadNombre ?? "Universidad seleccionada",
          });
        } else {
          setSelectedUniversidad(null);
        }
      } catch (error) {
        console.error(error);
        Notification.alertError("Error al cargar datos de Status.");
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
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
    setStatus((prev) => ({ ...prev, [id]: value }));
  };

  const handleUniversidadChange = (selectedOption) => {
    setStatus((prev) => ({
      ...prev,
      Status_UniversidadFK: selectedOption ? selectedOption.value : "",
    }));
    setSelectedUniversidad(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("accessToken") || "";

    try {
      const res = await fetch(`${API}api/status/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(status),
      });

      if (res.ok) {
        Notification.alertSuccess("Status actualizado correctamente.");
        router.push("/statusList");
      } else {
        Notification.alertError("Error al actualizar el Status.");
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
        <h1 className={Styles.title}>Editar Status</h1>

        <div className={Styles.name_group}>
          <label htmlFor="StatusCodigo">Código</label>
          <input
            type="text"
            id="StatusCodigo"
            value={status.StatusCodigo}
            onChange={handleChange}
            required
            disabled
            placeholder="Ej: ST001"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="StatusNombre">Nombre</label>
          <input
            type="text"
            id="StatusNombre"
            value={status.StatusNombre}
            onChange={handleChange}
            required
            placeholder="Ej: Contratado / Licencia"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="StatusEstado">Estado</label>
          <select
            id="StatusEstado"
            value={status.StatusEstado}
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
            inputId="Status_UniversidadFK"
            name="Status_UniversidadFK"
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

export default withAuth(StatusEdit);
