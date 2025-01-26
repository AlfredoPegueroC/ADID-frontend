"use client";

import { useState } from "react";

export default function ImportPage() {
  const [file, setFile] = useState(null);
  const [period, setPeriod] = useState("");
  const [message, setMessage] = useState("");

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle period input change
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a file");
      return;
    }

    if (!period) {
      setMessage("Please enter a period");
      return;
    }

    const formData = new FormData();
    formData.append("excel_file", file);
    formData.append("period", period);

    try {
      const response = await fetch("http://localhost:8000/import/asignacion", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Import successful");
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
          <input
            type="text"
            placeholder="Enter period (e.g., 2025-20)"
            value={period}
            onChange={handlePeriodChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>
      {message && <p className="alert alert-info mt-3">{message}</p>}
    </div>
  );
}
