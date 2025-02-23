"use client";

import { useState } from "react";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";

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
        Notification.alertSuccess(result.message || "Se ha importado.")
        if (onSuccess) onSuccess();
        document.querySelector("#myform").reset();
      } else {
        Notification.alertError(result.error || "Error al Importar");
      }
    } catch (error) {
      Notification.alertError("An error occurred while uploading the file.");
    }
  };

  return (
    <div>
      <h1 className={Styles.title}>Importar Archivo Excel</h1>
      <form onSubmit={handleSubmit} id="myform" className={Styles.form}>
        <div className={Styles.name_group}>
          <label htmlFor="excel_file" className={Styles.label}>
            Selecciona un archivo Excel
          </label>
          <input
            type="file"
            className={Styles.archivo}
            id="excel_file"
            name="excel_file"
            onChange={handleFileChange}
            accept=".xls,.xlsx"
            required
          />
        </div>

        <button type="submit" className={Styles.btn}>
          Importar
        </button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
