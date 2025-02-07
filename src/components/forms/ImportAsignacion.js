"use client";

import { useState, useEffect } from "react";

export default function ImportPage({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [periods, setPeriods] = useState([]); // Array to store period options
  const [selectedPeriod, setSelectedPeriod] = useState(""); // Track selected period
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const periodoResponse = await fetch(
          "http://localhost:8000/api/periodoacademico"
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
      const response = await fetch("http://localhost:8000/import/asignacion", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Import successful");
        if (onSuccess) onSuccess();
      } else {
        setMessage(result.error || "Error during import");
      }
    } catch (error) {
      setMessage("An error occurred while uploading the file.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-group">
        <div className="form-group">
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            accept=".xls,.xlsx"
            required
          />
        </div>

        <div>
          <label htmlFor="periodoCodigo">Periodo Académico:</label>
          <select
            id="periodoAcademicoCodigo"
            value={selectedPeriod}
            onChange={handlePeriodSelectChange}
            required
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

        <button type="submit" className="btn btn-primary">
          Subir Excel
        </button>
      </form>

      {message && <p className="alert alert-info mt-3">{message}</p>}
    </div>
  );
}
