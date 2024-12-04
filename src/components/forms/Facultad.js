// app/components/FacultadForm.js
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        setUniversidades(data);
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
        alert("Facultad creada exitosamente");
        setFormData({
          facultadCodigo: "",
          nombre: "",
          UniversidadCodigo: "",
          estado: "",
        });
        router.push("/facultadList"); // Redirect after success
      } else {
        const errorData = await response.json();
        alert(
          `Error al crear la facultad: ${
            errorData.detail || "Error desconocido"
          }`
        );
      }
    } catch (error) {
      console.error("Error creating faculty:", error);
      alert("Hubo un problema al crear la facultad");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <form id="facultadForm" onSubmit={handleSubmit}>
        <fieldset>
          <legend>{title}</legend>

          <label htmlFor="nombre">Nombre de la Facultad:</label>
          <input
            type="text"
            placeholder="Nombre de la Facultad"
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
              -- Seleccione --
            </option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </fieldset>

        <input
          type="submit"
          value={isLoading ? "Enviando..." : "Enviar"}
          className="boton-verde"
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
