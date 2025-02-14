"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Styles from "@styles/form.module.css";
import Notification from "../Notification";
export default function Periodo({ title, onSuccess }) {
  const router = useRouter();
  const [universidades, setUniversidades] = useState([]);
  const [formData, setFormData] = useState({
    periodoAcademicoCodigo: "",
    nombre: "",
    estado: "",
    UniversidadCodigo: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarUniversidades();
  }, []);

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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.UniversidadCodigo) {
      alert("Por favor, seleccione una universidad.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/periodoacademico/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        Notification.alertSuccess("Periodo Académico creado exitosamente");
        setFormData({
          periodoAcademicoCodigo: "",
          nombre: "",
          estado: "",
          UniversidadCodigo: "",
        });

        onSuccess();
      } else {
        const errorData = await response.json();
        Notification.alertError(
          `Error al crear el periodo ya existe.`
        );
      }
    } catch (error) {
      console.error("Error creating periodo:", error);
      Notification.alertError("Hubo un problema al crear el periodo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form id="periodoForm" onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>{title}</h1>

        <div className={Styles.name_group}>
          <label htmlFor="nombre">Nombre del periodo</label>
          <input
            type="text"
            placeholder="Nombre del periodo"
            id="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="UniversidadCodigo">Universidad</label>
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
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            value={formData.estado}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              -- Seleccione Estado --
            </option>
            <option value="Abierto">Abierto</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>

        <button type="submit" className={Styles.btn}>
          Enviar
        </button>
      </form>
    </div>
  );
}
