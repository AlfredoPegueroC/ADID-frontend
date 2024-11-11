
'use client';
import { useState, useEffect } from 'react';

export default function CategoriaDocenteForm() {
  const [formData, setFormData] = useState({
    categoriaCodigo: '',
    nombre: '',
    estado: '',
    universidadCodigo: '',
  });

  const [universidades, setUniversidades] = useState([]);

  // Fetch universidades when component mounts
  useEffect(() => {
    const fetchUniversidades = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/universidad');
        const data = await response.json();
        setUniversidades(data);
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

    const response = await fetch('http://127.0.0.1:8000/api/categoriadocente/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categoriaCodigo: formData.categoriaCodigo,
        nombre: formData.nombre,
        estado: formData.estado,
        UniversidadCodigo: formData.universidadCodigo,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      alert('Categoría de Docente creada exitosamente');
      setFormData({
        categoriaCodigo: '',
        nombre: '',
        estado: '',
        universidadCodigo: '',
      });
    } else {
      const errorData = await response.json();
      alert('Error al crear la Categoría de Docente: ' + JSON.stringify(errorData));
    }
  };

  return (
    <div>
      <h1>Crear Categoría de Docente</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Información de la Categoría de Docente</legend>

          <label htmlFor="categoriaCodigo">Código de la Categoría:</label>
          <input
            type="number"
            placeholder="Código de la Categoría"
            id="categoriaCodigo"
            name="categoriaCodigo"
            value={formData.categoriaCodigo}
            onChange={handleChange}
            required
          />

          <label htmlFor="nombre">Nombre de la Categoría:</label>
          <input
            type="text"
            placeholder="Nombre de la Categoría"
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
