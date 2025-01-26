"use client";

import { useState } from "react";

export default function ImportExcel({ title, importURL }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a file");
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
      <h3 className="mt-5 text-dark">{title}</h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="excel_file">Excel File</label>
          <input
            type="file"
            className="form-control"
            id="excel_file"
            name="excel_file"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Import
        </button>
      

      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
