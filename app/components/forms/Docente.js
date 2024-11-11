// pages/docente/create.js
"use client"

import { useState, useEffect } from 'react';

export default function DocenteForm() {
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [tiposDocente, setTiposDocente] = useState([]);
  const [categoriasDocente, setCategoriasDocente] = useState([]);

  const [formData, setFormData] = useState({
    docente_codigo: '',
    nombre: '',
    apellidos: '',
    sexo: '',
    estado_civil: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    estado: '',
    universidad_codigo: '',
    facultad_codigo: '',
    escuela_codigo: '',
    tipo_docente_codigo: '',
    categoria_codigo: ''
  });

  // Fetch dropdown data (universities, faculties, etc.)
  useEffect(() => {
    async function fetchData() {
      const responses = await Promise.all([
        fetch('http://127.0.0.1:8000/api/universidad'),
        fetch('http://127.0.0.1:8000/api/facultad'),
        fetch('http://127.0.0.1:8000/api/escuela'),
        fetch('http://127.0.0.1:8000/api/tipodocente'),
        fetch('http://127.0.0.1:8000/api/categoriaDocente')
      ]);
      const data = await Promise.all(responses.map(res => res.json()));

      setUniversidades(data[0]);
      setFacultades(data[1]);
      setEscuelas(data[2]);
      setTiposDocente(data[3]);
      setCategoriasDocente(data[4]);
    }

    fetchData();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/docente/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Docente creado exitosamente');
        setFormData({
          docente_codigo: '',
          nombre: '',
          apellidos: '',
          sexo: '',
          estado_civil: '',
          fecha_nacimiento: '',
          telefono: '',
          direccion: '',
          estado: '',
          universidad_codigo: '',
          facultad_codigo: '',
          escuela_codigo: '',
          tipo_docente_codigo: '',
          categoria_codigo: ''
        });
      } else {
        const errorData = await response.json();
        alert('Error al crear el docente: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      alert('Hubo un error al conectar con la API: ' + error.message);
    }
  };

  return (
    <div>
      {/* <h1>Crear Docente</h1> */}
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Información del Docente</legend>

          <label htmlFor="docente_codigo">Código del Docente:</label>
          <input
            type="number"
            id="docente_codigo"
            name="docente_codigo"
            value={formData.docente_codigo}
            onChange={handleChange}
            required
          />

          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <label htmlFor="apellidos">Apellidos:</label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
          />

          <label htmlFor="sexo">Sexo:</label>
          <select
            id="sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione el sexo --
            </option>
            <option value="F">Femenino</option>
            <option value="M">Masculino</option>
          </select>

          <label htmlFor="estado_civil">Estado Civil:</label>
          <select
            id="estado_civil"
            name="estado_civil"
            value={formData.estado_civil}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione el estado civil --
            </option>
            <option value="S">Soltero</option>
            <option value="C">Casado</option>
            <option value="U">Unión Libre</option>
            <option value="V">Viudo</option>
          </select>

          <label htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            required
          />

          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
          />

          <label htmlFor="direccion">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
          />

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
            <option value="Jubilado">Jubilado</option>
            <option value="Sabático">Sabático</option>
            <option value="Licencia">Licencia</option>
          </select>

          <label htmlFor="universidad_codigo">Universidad:</label>
          <select
            id="universidad_codigo"
            name="universidad_codigo"
            value={formData.universidad_codigo}
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

          <label htmlFor="facultad_codigo">Facultad:</label>
          <select
            id="facultad_codigo"
            name="facultad_codigo"
            value={formData.facultad_codigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Facultad --
            </option>
            {facultades.map((facultad) => (
              <option key={facultad.facultadCodigo} value={facultad.facultadCodigo}>
                {facultad.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="escuela_codigo">Escuela:</label>
          <select
            id="escuela_codigo"
            name="escuela_codigo"
            value={formData.escuela_codigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Escuela --
            </option>
            {escuelas.map((escuela) => (
              <option key={escuela.escuelaCodigo} value={escuela.escuelaCodigo}>
                {escuela.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="tipo_docente_codigo">Tipo de Docente:</label>
          <select
            id="tipo_docente_codigo"
            name="tipo_docente_codigo"
            value={formData.tipo_docente_codigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione el Tipo de Docente --
            </option>
            {tiposDocente.map((tipo) => (
              <option key={tipo.tipoDocenteCodigo} value={tipo.tipoDocenteCodigo}>
                {tipo.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="categoria_codigo">Categoría de Docente:</label>
          <select
            id="categoria_codigo"
            name="categoria_codigo"
            value={formData.categoria_codigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione la Categoría de Docente --
            </option>
            {categoriasDocente.map((categoria) => (
              <option key={categoria.categoriaCodigo} value={categoria.categoriaCodigo}>
                {categoria.nombre}
              </option>
            ))}
          </select>

        </fieldset>

        <input type="submit" value="Enviar" />
      </form>
    </div>
  );
}
