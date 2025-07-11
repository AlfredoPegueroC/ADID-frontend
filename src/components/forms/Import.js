"use client";

import { useState, useRef } from "react";
import Notification from "../Notification";
import Styles from "@styles/test.module.css";

export default function ImportExcel({ title, importURL, onSuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    if (!file) {
      setMessage("Por favor, seleccionar un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("excel_file", file);
    setLoading(true);

    try {
      const response = await fetch(importURL, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();
      console.log("Response status escuela:", result);

      if (response.ok) {
        // Mostrar solo un mensaje prioritario
        if (Array.isArray(result.duplicados) && result.duplicados.length > 0) {
          Notification.alertLogin(
            `Se omitieron ${result.duplicados.length} duplicados: ${result.duplicados[0]}`
          );
        } else if (
          Array.isArray(result.nombres_duplicados) &&
          result.nombres_duplicados.length > 0
        ) {
          Notification.alertLogin(`Nombre duplicado: ${result.nombres_duplicados[0]}`);
        } else if (
          Array.isArray(result.directoras_duplicadas) &&
          result.directoras_duplicadas.length > 0
        ) {
          Notification.alertLogin(
            `Director@s duplicad@s omitid@s:\n${result.directoras_duplicadas
              .slice(0, 5)
              .join("\n")}`
          );
        } else if (Array.isArray(result.errores) && result.errores.length > 0) {
          Notification.alertError(`Errores encontrados:\n${result.errores[0]}`);
        } else {
          Notification.alertSuccess(result.message || "Se ha importado.");
        }

        if (onSuccess) onSuccess();

        // Limpiar archivo e input
        setFile(null);
        setMessage("");
        if (inputRef.current) inputRef.current.value = null;
      } else {
        const errorMsg =
          result.error ||
          (Array.isArray(result.errores) ? result.errores[0] : null) ||
          "Error al importar";
        Notification.alertError(errorMsg);
      }
    } catch (error) {
      console.error("Import error:", error);
      Notification.alertError("Error al subir el documento excel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={Styles.title}>{title || "Importar Archivo Excel"}</h1>
      <form onSubmit={handleSubmit} id="myform" className={Styles.form}>
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
