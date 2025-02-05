// Docentes form
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DocenteForm() {
  const router = useRouter();
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [tiposDocente, setTiposDocente] = useState([]);
  const [categoriasDocente, setCategoriasDocente] = useState([]);

  const [formData, setFormData] = useState({
    Docentecodigo: "",
    nombre: "",
    apellidos: "",
    sexo: "",
    estado_civil: "",
    fecha_nacimiento: "",
    telefono: "",
    direccion: "",
    estado: "",
    UniversidadCodigo: "",
    facultadCodigo: "",
    escuelaCodigo: "",
    tipoDocenteCodigo: "",
    categoriaCodigo: "",
  });


  useEffect(() => {
    async function fetchData() {
      const responses = await Promise.all([
        fetch("http://127.0.0.1:8000/api/universidad"),
        fetch("http://127.0.0.1:8000/api/facultad"),
        fetch("http://127.0.0.1:8000/api/escuela"),
        fetch("http://127.0.0.1:8000/api/tipodocente"),
        fetch("http://127.0.0.1:8000/api/categoriaDocente"),
      ]);
      const data = await Promise.all(responses.map((res) => res.json()));

      setUniversidades(data[0].results);
      setFacultades(data[1].results);
      setEscuelas(data[2].results);
      setTiposDocente(data[3].results);
      setCategoriasDocente(data[4].results);
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
      const response = await fetch("http://127.0.0.1:8000/api/docente/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Docente creado exitosamente");
        setFormData({
          Docentecodigo: "",
          nombre: "",
          apellidos: "",
          sexo: "",
          estado_civil: "",
          fecha_nacimiento: "",
          telefono: "",
          direccion: "",
          estado: "",
          UniversidadCodigo: "",
          facultadCodigo: "",
          escuelaCodigo: "",
          tipoDocenteCodigo: "",
          categoriaCodigo: "",
        });
        router.push("docenteList");
      } else {
        const errorData = await response.json();
        alert("Error al crear el docente: " + JSON.stringify(errorData));
        console.log(formData);
      }
    } catch (error) {
      alert("Hubo un error al conectar con la API: " + error.message);
      console.log(formData);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Información del Docente</legend>

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

          <label htmlFor="UniversidadCodigo">Universidad:</label>
          <select
            id="UniversidadCodigo"
            name="UniversidadCodigo"
            value={formData.UniversidadCodigo}
            onChange={handleChange}
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

          <label htmlFor="facultadCodigo">Facultad:</label>
          <select
            id="facultadCodigo"
            name="facultadCodigo"
            value={formData.facultadCodigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Facultad --
            </option>
            {facultades.map((facultad) => (
              <option
                key={facultad.facultadCodigo}
                value={facultad.facultadCodigo}
              >
                {facultad.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="escuelaCodigo">Escuela:</label>
          <select
            id="escuelaCodigo"
            name="escuelaCodigo"
            value={formData.escuelaCodigo}
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

          <label htmlFor="tipoDocenteCodigo">Tipo de Docente:</label>
          <select
            id="tipoDocenteCodigo"
            name="tipoDocenteCodigo"
            value={formData.tipoDocenteCodigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione el Tipo de Docente --
            </option>
            {tiposDocente.map((tipo) => (
              <option
                key={tipo.tipoDocenteCodigo}
                value={tipo.tipoDocenteCodigo}
              >
                {tipo.nombre}
              </option>
            ))}
          </select>

          <label htmlFor="categoriaCodigo">Categoría de Docente:</label>
          <select
            id="categoriaCodigo"
            name="categoriaCodigo"
            value={formData.categoriaCodigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione la Categoría de Docente --
            </option>
            {categoriasDocente.map((categoria) => (
              <option
                key={categoria.categoriaCodigo}
                value={categoria.categoriaCodigo}
              >
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
