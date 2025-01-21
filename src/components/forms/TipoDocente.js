"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

export default function TipoDocenteForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    tipoDocenteCodigo: '',
    nombre: '',
    estado: '',
    universidadCodigo: '',
  });

  const [universidades, setUniversidades] = useState([]);

  useEffect(() => {
    // Fetch universidades from API when component mounts
    const fetchUniversidades = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/universidad');
        const data = await response.json();
        setUniversidades(data.results);
      } catch (error) {
        console.error('Error fetching universidades:', error);
      }
    };

    fetchUniversidades();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://127.0.0.1:8000/api/tipodocente/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tipoDocenteCodigo: formData.tipoDocenteCodigo, // Include tipoDocenteCodigo as number
        nombre: formData.nombre,
        estado: formData.estado,
        UniversidadCodigo: formData.universidadCodigo, // This is the ID of the selected university
      }),
    });

    if (response.ok) {
      const result = await response.json();
      alert('Tipo de Docente creado exitosamente');
      setFormData({ tipoDocenteCodigo: '', nombre: '', estado: '', universidadCodigo: '' });
      router.push("/tipodocenteList")
    } else {
      const errorData = await response.json();
      alert('Error al crear el Tipo de Docente: ' + JSON.stringify(errorData));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Información del Tipo de Docente</legend>

          <label htmlFor="nombre">Nombre del Tipo de Docente:</label>
          <input
            type="text"
            placeholder="Nombre del Tipo de Docente"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <label htmlFor="universidadCodigo">Universidad:</label>
          <select
            id="universidadCodigo"
            name="universidadCodigo"
            value={formData.universidadCodigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Universidad --
            </option>
            {universidades.map((universidad) => (
              <option key={universidad.UniversidadCodigo} value={universidad.UniversidadCodigo}>
                {universidad.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="estado">Estado:</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione el estado --
            </option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </fieldset>

        <button type="submit" className="boton-verde">
          Enviar
        </button>
      </form>
    </div>
  );
}
