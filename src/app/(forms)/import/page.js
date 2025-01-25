"use client";

import { useState } from "react";
import withAuth from "@/src/utils/withAuth";

function ImportPage() {
  const [file, setFile] = useState(null);
  const [period, setPeriod] = useState("");  // New state for the period
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
    formData.append("period", period); // Add period to FormData

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
      <h3 className="mt-5">Import Excel File</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="file"
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
        <button type="submit">Upload</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default withAuth(ImportPage);