"use client"

import { fetchAcciones } from "@api/accionesService";
import { fetchStatus } from "@api/statusService";
import { useEffect, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Notification from "@components/Notification";



function AccionCell({ row, api }) {
  const [value, setValue] = useState(row.original.accion || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  // Traer ACCIONES desde el servicio (página 1, sin filtro, tamaño 100)
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["acciones-options"],
    queryFn: () => fetchStatus(1, "", 100),
    staleTime: 5 * 60 * 1000,
  });

  const opciones = (statusData?.results || []).map((a) => a.StatusNombre);

  // Si el valor actual no está en el catálogo (por datos viejos), lo añadimos visualmente
  const opcionesFinal = value && !opciones.includes(value)
    ? [value, ...opciones]
    : opciones;

  useEffect(() => {
    setValue(row.original.accion || "");
  }, [row.original.AsignacionID, row.original.accion]);

  const handleChange = async (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsUpdating(true);

    try {
      const res = await fetch(
        `${api}api/asignacion/edit/${row.original.AsignacionID}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ accion: newValue }),
        }
      );

      if (!res.ok) throw new Error("No se pudo actualizar");

      queryClient.setQueriesData(
        { queryKey: ["asignaciones"], exact: false },
        (old) => {
          if (!old) return old;
          const listKey = Array.isArray(old?.results) ? "results" : "asignaciones";
          if (!Array.isArray(old?.[listKey])) return old;
          return {
            ...old,
            [listKey]: old[listKey].map((r) =>
              r.AsignacionID === row.original.AsignacionID
                ? { ...r, accion: newValue }
                : r
            ),
          };
        }
      );

      Notification.alertSuccess("Modificado correctamente");
      queryClient.invalidateQueries({ queryKey: ["asignaciones"] });
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("Error al modificar el campo");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      className="form-select form-select-sm"
      value={value}
      onChange={handleChange}
      disabled={isUpdating || statusLoading}
    >
      {statusLoading && <option>Cargando...</option>}
      {!statusLoading && opcionesFinal.length === 0 && (
        <option value="">(Sin opciones)</option>
      )}
      {!statusLoading &&
        opcionesFinal.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
    </select>
  );
}

function ComentarioCell({ row, api }) {
  const [value, setValue] = useState(row.original.comentario || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  // Resync cuando cambia la fila/valor original
  useEffect(() => {
    setValue(row.original.comentario || "");
  }, [row.original.AsignacionID, row.original.comentario]);

  const handleSave = async () => {
    if (value === row.original.comentario) return;

    setIsUpdating(true);
    try {
      const res = await fetch(
        `${api}api/asignacion/edit/${row.original.AsignacionID}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ comentario: value }),
        }
      );

      if (!res.ok) throw new Error("No se pudo actualizar");

      queryClient.setQueriesData(
        { queryKey: ["asignaciones"], exact: false },
        (old) => {
          if (!old) return old;
          const listKey = Array.isArray(old?.results) ? "results" : "asignaciones";
          if (!Array.isArray(old?.[listKey])) return old;
          return {
            ...old,
            [listKey]: old[listKey].map((r) =>
              r.AsignacionID === row.original.AsignacionID
                ? { ...r, comentario: value }
                : r
            ),
          };
        }
      );

      Notification.alertSuccess("Comentario actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["asignaciones"] });
    } catch (err) {
      console.error("Error al actualizar comentario:", err);
      alert("Error al modificar el comentario");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <textarea
        className="form-control form-control-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        disabled={isUpdating}
        placeholder="Escribir comentario..."
        rows={1}
      />
    </div>
  );
}

function ModificacionesCell({ row, api }) {
  const [value, setValue] = useState(row.original.modificacion || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  // Traer accion desde el servicio (página 1, sin filtro, tamaño 100)
  const { data: accionData, isLoading: accionLoading } = useQuery({
    queryKey: ["status-options"],
    queryFn: () => fetchAcciones(1, "", 100),
    staleTime: 5 * 60 * 1000,
  });

  const opciones = (accionData?.results || []).map((s) => s.AccionNombre);

  // Si el valor actual no está en el catálogo, lo añadimos visualmente
  const opcionesFinal = value && !opciones.includes(value)
    ? [value, ...opciones]
    : opciones;

  useEffect(() => {
    setValue(row.original.modificacion || "");
  }, [row.original.AsignacionID, row.original.modificacion]);

  const handleChange = async (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsUpdating(true);

    try {
      const res = await fetch(
        `${api}api/asignacion/edit/${row.original.AsignacionID}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ modificacion: newValue }),
        }
      );

      if (!res.ok) throw new Error("No se pudo actualizar");

      queryClient.setQueriesData(
        { queryKey: ["asignaciones"], exact: false },
        (old) => {
          if (!old) return old;
          const listKey = Array.isArray(old?.results) ? "results" : "asignaciones";
          if (!Array.isArray(old?.[listKey])) return old;
          return {
            ...old,
            [listKey]: old[listKey].map((r) =>
              r.AsignacionID === row.original.AsignacionID
                ? { ...r, modificacion: newValue }
                : r
            ),
          };
        }
      );

      Notification.alertSuccess("Acción modificada correctamente");
      queryClient.invalidateQueries({ queryKey: ["asignaciones"] });
    } catch (err) {
      console.error("Error al actualizar modificaciones:", err);
      alert("Error al modificar la acción");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      className="form-select form-select-sm"
      value={value}
      onChange={handleChange}
      disabled={isUpdating || accionLoading}
    >
      {accionLoading && <option>Cargando...</option>}
      {!accionLoading && opcionesFinal.length === 0 && (
        <option value="">---------</option>
      )}
      {!accionLoading &&
        opcionesFinal.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
    </select>
  );
}

export { AccionCell, ModificacionesCell, ComentarioCell };