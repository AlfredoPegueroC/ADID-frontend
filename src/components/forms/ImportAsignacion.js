"use client";

import { useState, useEffect } from "react";
import Styles from "@styles/form.module.css";
import Notification from "../Notification";

export default function ImportPage({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(""); 
  const [message, setMessage] = useState("");

  const API = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const periodoResponse = await fetch(
          `${API}/api/periodoacademico`
        );
        if (!periodoResponse.ok) throw new Error("Failed to fetch periodo");
        const periodoData = await periodoResponse.json();
        setPeriods(periodoData.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle period selection change
  const handlePeriodSelectChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

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
      const response = await fetch(`${API}/import/asignacion`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        Notification.alertSuccess(result.message || "Import successful");
        if (onSuccess) onSuccess();
        document.querySelector("#myform").reset();
      } else {
        Notification.alertError(result.error || "Error durante la importacion.");
      }
    } catch (error) {
      Notification.alertError("Error mientras subiendo el archivo excel");
    }
  };

  return (
    <div>
      <form id="myform" onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Subir Archivo Excel</h1>

        <div className={Styles.name_group}>
          <label htmlFor="excel_file" className={Styles.label}>
            Selecciona un archivo Excel:
          </label>
          <input
            type="file"
            className={Styles.archivo}
            onChange={handleFileChange}
            accept=".xls,.xlsx"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="periodoAcademicoCodigo" className={Styles.label}>
            Periodo Académico:
          </label>
          <select
            id="periodoAcademicoCodigo"
            value={selectedPeriod}
            onChange={handlePeriodSelectChange}
            required
            className={Styles.input}
          >
            <option value="" disabled>
              -- Seleccione un Periodo --
            </option>
            {periods.map((periodo) => (
              <option
                key={periodo.periodoAcademicoCodigo}
                value={periodo.nombre}
              >
                {periodo.nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={Styles.btn}>
          Subir Excel
        </button>
      </form>

      {message && <p className="alert alert-info mt-3">{message}</p>}
    </div>
  );
}
