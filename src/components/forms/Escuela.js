"use client"
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import styles from "@styles/Notificacion.module.css"; // Importa el archivo CSS

export default function EscuelaForm() {
  const router = useRouter();
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [formData, setFormData] = useState({
    escuelaCodigo: '',
    nombre: '',
    estado: '',
    UniversidadCodigo: '',
    facultadCodigo: '',
  });

  useEffect(() => {
    // Fetch universities
    const fetchUniversidades = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/universidad');
        const data = await response.json();
        setUniversidades(data.results);
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    // Fetch faculties
    const fetchFacultades = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/facultad');
        const data = await response.json();
        setFacultades(data.results);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      }
    };

    fetchUniversidades();
    fetchFacultades();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure UniversidadCodigo and facultadCodigo are numbers
    const dataToSend = {
      ...formData,
      UniversidadCodigo: parseInt(formData.UniversidadCodigo),
      facultadCodigo: parseInt(formData.facultadCodigo),
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/escuela/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alertSuccess('Escuela creada exitosamente');
        setFormData({
          escuelaCodigo: '',
          nombre: '',
          estado: '',
          UniversidadCodigo: '',
          facultadCodigo: '',
        });
        setTimeout(() => router.push("/escuelaList"), 5000); // Retraso de 5 segundos
      } else {
        const errorData = await response.json();
        alertError('Error al crear la escuela: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      alertError('Error al enviar el formulario: ' + error.message);
    }
  };

  const alertSuccess = (message) => {
    const alertDiv = document.createElement("div");
    alertDiv.className = styles.alertaExito; // Aplicando el estilo de éxito
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000); // Elimina la alerta después de 5 segundos
  };

  const alertError = (message) => {
    const alertDiv = document.createElement("div");
    alertDiv.className = styles.alertaError; // Aplicando el estilo de error
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000); // Elimina la alerta después de 5 segundos
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Información de la Escuela</legend>

          <label htmlFor="nombre">Nombre de la Escuela:</label>
          <input
            type="text"
            id="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <label htmlFor="estado">Estado:</label>
          <select
            id="estado"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Seleccione el estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          <label htmlFor="UniversidadCodigo">Universidad:</label>
          <select
            id="UniversidadCodigo"
            value={formData.UniversidadCodigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Seleccione una Universidad --</option>
            {universidades.map((universidad) => (
              <option key={universidad.UniversidadCodigo} value={universidad.UniversidadCodigo}>
                {universidad.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="facultadCodigo">Facultad:</label>
          <select
            id="facultadCodigo"
            value={formData.facultadCodigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Seleccione una Facultad --</option>
            {facultades.map((facultad) => (
              <option key={facultad.facultadCodigo} value={facultad.facultadCodigo}>
                {facultad.nombre}
              </option>
            ))}
          </select>

        </fieldset>

        <button type="submit" className="boton-verde">
          Enviar
        </button>
      </form>
    </div>
  );
}
