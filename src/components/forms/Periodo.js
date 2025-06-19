"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Styles from "@styles/test.module.css";
import Notification from "../Notification";

export default function Periodo({ title, onSuccess }) {
  const router = useRouter();
  const [universidades, setUniversidades] = useState([]);
  const [formData, setFormData] = useState({
    PeriodoCodigo: "",
    PeriodoNombre: "",
    PeriodoTipo: "",
    PeriodoAnio: "",
    PeriodoFechaInicio: "",
    PeriodoFechaFin: "",
    PeriodoEstado: "",
    Periodo_UniversidadFK: "", // Esto debe contener el ID de la universidad
  });

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarUniversidades();
  }, []);

  async function cargarUniversidades() {
    try {
      const response = await fetch(`${API}api/universidad`);
      if (!response.ok) throw new Error("Failed to fetch universities");
      const data = await response.json();
      setUniversidades(data.results || data);
    } catch (error) {
      console.error("Error loading universities:", error);
      alert("No se pudieron cargar las universidades");
    }
  }
  console.log("asasv:v" ,universidades)
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.Periodo_UniversidadFK) {
      alert("Por favor, seleccione una universidad.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API}api/periodoacademico/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("formulario enviado: ", formData);

      if (response.ok) {
        Notification.alertSuccess("Periodo Académico creado exitosamente");
        setFormData({
          PeriodoCodigo: "",
          PeriodoNombre: "",
          PeriodoTipo: "",
          PeriodoAnio: "",
          PeriodoFechaInicio: "",
          PeriodoFechaFin: "",
          PeriodoEstado: "",
          Periodo_UniversidadFK: "",
        });
        onSuccess();
      } else {
        const errorData = await response.json();
        Notification.alertError("Error al crear el periodo: ya existe.");
      }
    } catch (error) {
      console.error("Error creating periodo:", error);
      Notification.alertError("Hubo un problema al crear el periodo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form id="periodoForm" onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>{title}</h1>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoCodigo">Código del periodo</label>
          <input
            type="text"
            id="PeriodoCodigo"
            placeholder="Ej: 2024A"
            value={formData.PeriodoCodigo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoNombre">Nombre del periodo</label>
          <input
            type="text"
            id="PeriodoNombre"
            placeholder="Nombre del periodo"
            value={formData.PeriodoNombre}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoTipo">Tipo de periodo</label>
          <input
            type="text"
            id="PeriodoTipo"
            placeholder="Ej: Semestral, Trimestral"
            value={formData.PeriodoTipo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoAnio">Año</label>
          <input
            type="number"
            id="PeriodoAnio"
            placeholder="Ej: 2025"
            value={formData.PeriodoAnio}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoFechaInicio">Fecha de inicio</label>
          <input
            type="date"
            id="PeriodoFechaInicio"
            value={formData.PeriodoFechaInicio}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoFechaFin">Fecha de fin</label>
          <input
            type="date"
            id="PeriodoFechaFin"
            value={formData.PeriodoFechaFin}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoEstado">Estado</label>
          <select
            id="PeriodoEstado"
            value={formData.PeriodoEstado}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Seleccione Estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Periodo_UniversidadFK">Universidad</label>
          <select
            id="Periodo_UniversidadFK"
            value={formData.Periodo_UniversidadFK}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Universidad --
            </option>
            {universidades.map((u) => (
              <option
                key={u.UniversidadID}
                value={u.UniversidadID}
              >
                {u.UniversidadNombre}{" "}
                {/* Mostrar el nombre, pero enviar el ID */}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={Styles.btn} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
