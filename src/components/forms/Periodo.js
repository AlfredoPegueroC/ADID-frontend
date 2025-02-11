"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Notification from "../Notification";


export default function periodo({ title }) {
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
        router.push("/periodoList");
        Notification.alertSuccess("Universidad creada con éxito: " + result.nombre);
        setFormData({
          periodoAcademicoCodigo: "",
          nombre: "",
          estado: "",
          UniversidadCodigo: "",
        });
        
      } else {
        const error = await response.json();
          Notification.alertError("Error al crear la universidad: " + error.message);
       
      }
    } catch (error) {
      Notification.alertError("Error al crear la universidad: " + error.message);
     
    } finally {
      setLoading(false);
    }
  };

  return(
    <div>
      <form id="periodoForm" onSubmit={handleSubmit}>
        <fieldset>
          <legend>{title}</legend>

          <label htmlFor="nombre">Nombre de la periodo:</label>
          <input
            type="text"
            placeholder="Nombre de la periodo"
            id="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />

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

          <label htmlFor="estado">Estado:</label>
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
        </fieldset>

        <input
          type="submit"
          value={loading ? "Enviando..." : "Enviar"}
          className="boton-verde"
          disabled={loading}
        />
      </form>
    </div>
  )
}
