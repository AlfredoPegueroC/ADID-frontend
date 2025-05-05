"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";
import Notification from "@components/Notification";

function EditPeriodo({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const [periodo, setPeriodo] = useState(null);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API}api/periodoacademico/${id}/`);
        if (!response.ok) throw new Error("Failed to fetch periodo");
        const data = await response.json();
        setPeriodo(data);

        const universidadesResponse = await fetch(`${API}api/universidad`);
        if (!universidadesResponse.ok) throw new Error("Failed to fetch universidades");
        const universidadesData = await universidadesResponse.json();
        setUniversidades(universidadesData.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!periodo) return;

    try {
      const response = await fetch(`${API}api/periodoacademico/edit/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(periodo),
      });

      if (response.ok) {
        Notification.alertSuccess("Periodo Académico Editado.");
        router.push("/periodoList");
      } else {
        Notification.alertError("Falla al Editar.");
      }
    } catch (error) {
      console.error("Error updating periodo:", error);
      Notification.alertError("Falla al Editar.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPeriodo({ ...periodo, [name]: value });
  };

  if (loading) {
    return (
      <div className="spinner-container ">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <FormLayout>
      <div className={Styles.container}>
        <form onSubmit={handleSubmit} className={Styles.form}>
          <h1 className={Styles.title}>Editar Periodo Académico</h1>

          <div className={Styles.name_group}>
            <label htmlFor="PeriodoCodigo">Código</label>
            <input
              type="text"
              id="PeriodoCodigo"
              name="PeriodoCodigo"
              value={periodo?.PeriodoCodigo || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="PeriodoNombre">Nombre</label>
            <input
              type="text"
              id="PeriodoNombre"
              name="PeriodoNombre"
              value={periodo?.PeriodoNombre || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="PeriodoTipo">Tipo</label>
            <input
              type="text"
              id="PeriodoTipo"
              name="PeriodoTipo"
              value={periodo?.PeriodoTipo || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="PeriodoAnio">Año</label>
            <input
              type="number"
              id="PeriodoAnio"
              name="PeriodoAnio"
              value={periodo?.PeriodoAnio || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="PeriodoFechaInicio">Fecha Inicio</label>
            <input
              type="date"
              id="PeriodoFechaInicio"
              name="PeriodoFechaInicio"
              value={periodo?.PeriodoFechaInicio || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="PeriodoFechaFin">Fecha Fin</label>
            <input
              type="date"
              id="PeriodoFechaFin"
              name="PeriodoFechaFin"
              value={periodo?.PeriodoFechaFin || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="Periodo_UniversidadFK">Universidad</label>
            <select
              id="Periodo_UniversidadFK"
              name="Periodo_UniversidadFK"
              value={periodo?.Periodo_UniversidadFK || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>-- Seleccione una Universidad --</option>
              {universidades.map((u) => (
                <option key={u.UniversidadID} value={u.UniversidadID}>
                  {u.UniversidadNombre}
                </option>
              ))}
            </select>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="PeriodoEstado">Estado</label>
            <select
              id="PeriodoEstado"
              name="PeriodoEstado"
              value={periodo?.PeriodoEstado || ""}
              onChange={handleChange}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <button type="submit" className={Styles.btn}>Guardar Cambios</button>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(EditPeriodo);
