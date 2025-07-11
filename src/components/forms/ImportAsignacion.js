"use client";

import { useState, useEffect, useRef } from "react";
import Notification from "../Notification";
import Styles from "@styles/test.module.css";

export default function ImportFileForm({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const API = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const res = await fetch(`${API}api/periodoacademico`);
        if (!res.ok) throw new Error("Error al obtener los periodos");
        const data = await res.json();
        setPeriods(data.results);
      } catch (error) {
        console.error("Error fetching periods:", error);
      }
    };
    fetchPeriods();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    if (!file) {
      setMessage("Por favor, selecciona un archivo.");
      return;
    }

    if (!selectedPeriod) {
      setMessage("Elija un periodo.");
      return;
    }

    const formData = new FormData();
    formData.append("excel_file", file);
    formData.append("period", selectedPeriod);
    setLoading(true);

    try {
      const res = await fetch(`${API}import/asignacion`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await res.json();

      if (result.failed_records) {
        Notification.alertLogin(
          `Error en ${result.failed_records[0]} registros, revisa el archivo y vuelve a intentarlo.`
        );
        return;
      }

      if (res.ok) {
        Notification.alertSuccess(result.message || "Importación exitosa.");
        if (onSuccess) onSuccess();
        setFile(null);
        setSelectedPeriod("");
        if (inputRef.current) inputRef.current.value = null;
      } else {
        Notification.alertError(result.error || "Error durante la importación.");
      }
    } catch (error) {
      Notification.alertError("Error al subir el archivo Excel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={Styles.title}>Subir Archivo Excel</h1>

      <form id="import-form" onSubmit={handleSubmit} className={Styles.form}>
        <div className={Styles.name_group}>
          <label htmlFor="excel_file" className={Styles.label}>
            Selecciona un archivo Excel
          </label>
          <input
            ref={inputRef}
            type="file"
            className={Styles.archivo}
            id="excel_file"
            name="excel_file"
            onChange={handleFileChange}
            accept=".xls,.xlsx"
            disabled={loading}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="periodoAcademicoCodigo" className={Styles.label}>
            Periodo Académico
          </label>
          <select
            id="periodoAcademicoCodigo"
            name="period"
            className={Styles.select}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            disabled={loading}
            required
          >
            <option value="" disabled>
              -- Seleccione un Periodo --
            </option>
            {periods.map((periodo) => (
              <option key={periodo.periodoAcademicoCodigo} value={periodo.PeriodoID}>
                {periodo.PeriodoNombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={Styles.btn} disabled={loading}>
          {loading ? (
            <>
              <span className={Styles.spinner}></span> Importando...
            </>
          ) : (
            "Importar"
          )}
        </button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
