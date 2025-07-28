"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import Styles from "@styles/test.module.css";
import Notification from "../Notification";
import { fetchUniversidades } from "@api/universidadService";

export default function Periodo({ title, onSuccess }) {
  const router = useRouter();
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUniversidades, setLoadingUniversidades] = useState(false);

  const [formData, setFormData] = useState({
    PeriodoCodigo: "",
    PeriodoNombre: "",
    PeriodoTipo: "",
    PeriodoAnio: "",
    PeriodoFechaInicio: "",
    PeriodoFechaFin: "",
    PeriodoEstado: "",
    Periodo_UniversidadFK: null,
  });

  useEffect(() => {
    cargarUniversidades(""); // carga inicial
  }, []);

  const cargarUniversidades = async (search = "") => {
    setLoadingUniversidades(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchUniversidades(1, search, 10, token);
      const formatted = results.map((u) => ({
        value: u.UniversidadID,
        label: u.UniversidadNombre,
      }));
      setUniversidades(formatted);
    } catch (error) {
      console.error("Error cargando universidades:", error);
      Notification.alertError("No se pudieron cargar las universidades");
    } finally {
      setLoadingUniversidades(false);
    }
  };

  const handleInputChange = (inputValue) => {
    cargarUniversidades(inputValue);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      Periodo_UniversidadFK: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!formData.Periodo_UniversidadFK) {
      Notification.alertError("Seleccione una universidad.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}api/periodoacademico/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...formData,
            Periodo_UniversidadFK: formData.Periodo_UniversidadFK.value,
          }),
        }
      );

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
          Periodo_UniversidadFK: null,
        });
        onSuccess?.();
      } else {
        const err = await response.json();
        Notification.alertError("Error al crear el periodo: Ya existe o faltan datos.");
        console.error(err);
      }
    } catch (error) {
      console.error("Error:", error);
      Notification.alertError("Hubo un problema al crear el periodo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>{title}</h1>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoCodigo">Código del periodo</label>
          <input
            type="text"
            id="PeriodoCodigo"
            placeholder="Ej: 2024A"
            value={formData.PeriodoCodigo}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoNombre">Nombre del periodo</label>
          <input
            type="text"
            id="PeriodoNombre"
            placeholder="Nombre completo del periodo"
            value={formData.PeriodoNombre}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoFechaInicio">Fecha de inicio</label>
          <input
            type="date"
            id="PeriodoFechaInicio"
            value={formData.PeriodoFechaInicio}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoFechaFin">Fecha de fin</label>
          <input
            type="date"
            id="PeriodoFechaFin"
            value={formData.PeriodoFechaFin}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="PeriodoEstado">Estado</label>
          <select
            id="PeriodoEstado"
            value={formData.PeriodoEstado}
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
          <Select
            options={universidades}
            value={formData.Periodo_UniversidadFK}
            onChange={handleSelectChange}
            onInputChange={handleInputChange}
            placeholder="Seleccione una universidad..."
            isClearable
            isLoading={loadingUniversidades}
            noOptionsMessage={() => "No se encontraron universidades"}
          />
        </div>

        <div className={Styles.btn_group}>
          <button type="submit" className={Styles.btn} disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}
