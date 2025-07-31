"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import Notification from "@components/Notification";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";

function EditPeriodo({ params }) {
  const router = useRouter();
  const { id } = params; // ✅ corregido: no se usa use()
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [periodo, setPeriodo] = useState({
    PeriodoCodigo: "",
    PeriodoNombre: "",
    PeriodoTipo: "",
    PeriodoAnio: "",
    PeriodoFechaInicio: "",
    PeriodoFechaFin: "",
    Periodo_UniversidadFK: "",
    PeriodoEstado: "",
  });

  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("accessToken");

      try {
        const [periodoRes, universidadesRes] = await Promise.all([
          fetch(`${API}api/periodoacademico/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API}api/universidad`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!periodoRes.ok || !universidadesRes.ok) {
          throw new Error("Error al cargar los datos.");
        }

        const periodoData = await periodoRes.json();
        const universidadesData = await universidadesRes.json();

        const options = (universidadesData.results || universidadesData).map((u) => ({
          value: u.UniversidadID,
          label: u.UniversidadNombre,
        }));

        setPeriodo({
          ...periodoData,
          Periodo_UniversidadFK: periodoData.Periodo_UniversidadFK,
        });
        setUniversidades(options);
      } catch (error) {
        console.error("Error:", error);
        Notification.alertError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPeriodo((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setPeriodo((prev) => ({
      ...prev,
      Periodo_UniversidadFK: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${API}api/periodoacademico/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(periodo),
      });

      if (response.ok) {
        Notification.alertSuccess("Periodo Académico editado exitosamente.");
        router.push("/periodoList");
      } else {
        Notification.alertError("Fallo al editar el período.");
      }
    } catch (error) {
      console.error("Error al editar el período:", error);
      Notification.alertError("Fallo al editar el período.");
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
        <h1 className={Styles.title}>Editar Periodo Académico</h1>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoCodigo">Código</label>
          <input
            type="text"
            id="PeriodoCodigo"
            value={periodo.PeriodoCodigo}
            onChange={handleChange}
            required
            disabled
            placeholder="Ej: PER2024A"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoNombre">Nombre</label>
          <input
            type="text"
            id="PeriodoNombre"
            value={periodo.PeriodoNombre}
            onChange={handleChange}
            required
            placeholder="Ej: 2024-A"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoTipo">Tipo</label>
          <input
            type="text"
            id="PeriodoTipo"
            value={periodo.PeriodoTipo}
            onChange={handleChange}
            required
            placeholder="Ej: Semestral"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoAnio">Año</label>
          <input
            type="number"
            id="PeriodoAnio"
            value={periodo.PeriodoAnio}
            onChange={handleChange}
            required
            placeholder="Ej: 2024"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoFechaInicio">Fecha Inicio</label>
          <input
            type="date"
            id="PeriodoFechaInicio"
            value={periodo.PeriodoFechaInicio}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoFechaFin">Fecha Fin</label>
          <input
            type="date"
            id="PeriodoFechaFin"
            value={periodo.PeriodoFechaFin}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Periodo_UniversidadFK">Universidad</label>
          <Select
            id="Periodo_UniversidadFK"
            options={universidades}
            value={universidades.find(
              (u) => u.value === periodo.Periodo_UniversidadFK
            )}
            onChange={handleSelectChange}
            placeholder="Seleccione una universidad..."
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoEstado">Estado</label>
          <select
            id="PeriodoEstado"
            value={periodo.PeriodoEstado}
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

export default withAuth(EditPeriodo);
