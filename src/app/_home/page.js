"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        alert("Periodo Académico creado exitosamente");
        setFormData({
          periodoAcademicoCodigo: "",
          nombre: "",
          estado: "",
          UniversidadCodigo: "",
        });

        onSuccess();
      } else {
        const errorData = await response.json();
        alert(
          `Error al crear el periodo: ${
            errorData.detail || "Error desconocido"
          }`
        );
      }
    } catch (error) {
      console.error("Error creating periodo:", error);
      alert("Hubo un problema al crear el periodo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form id="periodoForm" onSubmit={handleSubmit} className={Styles.form}>
        <fieldset className={Styles.fieldset}>
          <legend className={Styles.legend}>{title}</legend>

          <div className={Styles.group}>
            <label htmlFor="nombre">Nombre del periodo:</label>
            <input
              type="text"
              placeholder="Nombre del periodo"
              id="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={Styles.input}
              required
            />
          </div>

          <div className={Styles.group}>
            <label htmlFor="UniversidadCodigo">Universidad:</label>
            <select
              id="UniversidadCodigo"
              value={formData.UniversidadCodigo}
              onChange={handleInputChange}
              className={Styles.select}
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

          <div className={Styles.group}>
            <label htmlFor="estado">Estado:</label>
            <select
              id="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className={Styles.select}
              required
            >
              <option value="" disabled>
                -- Seleccione Estado --
              </option>
              <option value="Abierto">Abierto</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>
        </fieldset>

        <input type="submit" value="Guardar" className={Styles.btn} />
      </form>
    </div>
  );
}
