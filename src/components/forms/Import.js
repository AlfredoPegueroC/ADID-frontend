"use client";

import { useState } from "react";

export default function ImportExcel({ title, importURL, onSuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Por favor, Selecionar un arhivo");
      return;
    }

    const formData = new FormData();
    formData.append("excel_file", file);

    try {
      const response = await fetch(importURL, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Import successful!");
        if (onSuccess) onSuccess(); 
        document.querySelector("#myform").reset() // check this later
      } else {
        setMessage(result.error || "Error during import.");
      }
    } catch (error) {
      setMessage("An error occurred while uploading the file.");
    }
  };

  return (
    <div>
      <h3 className="mt-5 text-dark">{title}</h3>
      <form onSubmit={handleSubmit} id="myform">
        <div className="form-group mb-3">
          <label htmlFor="excel_file" className="form-label">
            Seleciona un archivo Excel
          </label>
          <input
            type="file"
            className="form-control"
            id="excel_file"
            name="excel_file"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Importar
        </button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
