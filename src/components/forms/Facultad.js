// app/components/FacultadForm.js
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Notification from "../Notification";

import Styles from "@styles/form.module.css";

export default function FacultadForm({ title }) {
  const router = useRouter();
  const [universidades, setUniversidades] = useState([]);
  const [formData, setFormData] = useState({
    facultadCodigo: "",
    nombre: "",
    UniversidadCodigo: "",
    estado: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load universities on component mount
  useEffect(() => {
    async function cargarUniversidades() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/universidad");
        if (!response.ok) throw new Error("Failed to fetch universities");
        const data = await response.json();
        setUniversidades(data.results);
      } catch (error) {
        console.error("Error loading universities:", error);
        alert("No se pudieron cargar las universidades");
      }
    }
    cargarUniversidades();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/facultad/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setFormData({
          facultadCodigo: "",
          nombre: "",
          UniversidadCodigo: "",
          estado: "",
        });
        router.push("/facultadList");
        Notification.alertSuccess("Facultad creada exitosamente");
      } else {
        const error = await response.json();
        Notification.alertError(
          "Error al crear la Facultad ya existe."
        );
      }
    } catch (error) {
      console.error("Error creating faculty:", error);
      Notification.alertError(
        "Error al crear la Facultad: " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={Styles.container}>
      <form id="facultadForm" onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>{title}</h1>

        <div className={Styles.name_group}>
          <label htmlFor="nombre">Nombre de la Facultad:</label>
          <input
            type="text"
            placeholder="Nombre de la Facultad"
            id="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="UniversidadCodigo">Universidad:</label>
          <select
            id="UniversidadCodigo"
            value={formData.UniversidadCodigo}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Universidad --
            </option>
            {universidades.map((universidad) => (
              <option
                key={universidad.UniversidadCodigo}
                value={universidad.UniversidadCodigo}
              >
                {universidad.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="estado">Estado:</label>
          <select
            id="estado"
            value={formData.estado}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              -- Seleccione --
            </option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <button
          type="submit"
          className={Styles.btn}
          value={isLoading ? "Enviando..." : "Enviar"}
          disabled={isLoading}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
