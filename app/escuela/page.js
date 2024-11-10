"use client"

import { useEffect, useState } from 'react';

export default function EscuelaForm() {
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    universidadCodigo: '',
    facultadCodigo: '',
    estado: '',
  });

  useEffect(() => {
    // Function to load universities
    const cargarUniversidades = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/universidad');
        const data = await response.json();
        setUniversidades(data);
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    // Function to load faculties
    const cargarFacultades = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/facultad');
        const data = await response.json();
        setFacultades(data);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      }
    };

    cargarUniversidades();
    cargarFacultades();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleEscuela = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/escuela/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Escuela creada exitosamente');
        setFormData({
          nombre: '',
          universidadCodigo: '',
          facultadCodigo: '',
          estado: '',
        });
      } else {
        const errorData = await response.json();
        alert('Error al crear la escuela: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      alert('Error al enviar el formulario: ' + error.message);
    }
  };

  return (
    <div>
      <form className="formulario" id="escuelaForm" onSubmit={handleEscuela}>
        <fieldset>
          <legend>Información de la Escuela</legend>

          <label htmlFor="nombre">Nombre de la Escuela:</label>
          <input
            type="text"
            placeholder="Nombre de la Escuela"
            id="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <label htmlFor="universidadCodigo">Universidad:</label>
          <select
            id="universidadCodigo"
            value={formData.universidadCodigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Seleccione una Universidad --</option>
            {universidades.map((uni) => (
              <option key={uni.UniversidadCodigo} value={uni.UniversidadCodigo}>
                {uni.nombre}
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
            {facultades.map((fac) => (
              <option key={fac.facultadCodigo} value={fac.facultadCodigo}>
                {fac.nombre}
              </option>
            ))}
          </select>

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
        </fieldset>

        <input type="submit" value="Enviar" className="boton-verde" />
      </form>
    </div>
  );
}
