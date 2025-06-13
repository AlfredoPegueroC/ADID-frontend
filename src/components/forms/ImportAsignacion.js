"use client";

import { useState, useEffect } from "react";
import styles from "@styles/test.module.css";
import Notification from "../Notification";

export default function ImportFileForm({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [message, setMessage] = useState("");

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
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      const res = await fetch(`${API}import/asignacion`, {
        method: "POST",
        body: formData,
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
        document.querySelector("#import-form").reset();
      } else {
        Notification.alertError(result.error || "Error durante la importación.");
      }
    } catch (error) {
      Notification.alertError("Error al subir el archivo Excel.");
    }
  };

  return (
    <div>
      <form id="import-form" onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Subir Archivo Excel</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="excel_file" className={styles.label}>
            Selecciona un archivo Excel:
          </label>
          <input
            type="file"
            className={styles.fileInput}
            onChange={handleFileChange}
            accept=".xls,.xlsx"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="periodoAcademicoCodigo" className={styles.label}>
            Periodo Académico:
          </label>
          <select
            id="periodoAcademicoCodigo"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            required
            className={styles.select}
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

        <div className={styles.buttonWrapper}>
          <button type="submit" className={styles.submitButton}>
            Enviar
          </button>
        </div>
      </form>

      {message && <p className={styles.alert}>{message}</p>}
    </div>
  );
}
