"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DocenteForm() {
  const router = useRouter();

  // Estado para almacenar los datos de las listas
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [tiposDocente, setTiposDocente] = useState([]);
  const [categoriasDocente, setCategoriasDocente] = useState([]);

  // Estado para el formulario
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

  // Cargar datos al montar el componente
  useEffect(() => {
    async function fetchData() {
      const urls = [
        "http://127.0.0.1:8000/api/universidad",
        "http://127.0.0.1:8000/api/facultad",
        "http://127.0.0.1:8000/api/escuela",
        "http://127.0.0.1:8000/api/tipodocente",
        "http://127.0.0.1:8000/api/categoriaDocente",
      ];

      try {
        const responses = await Promise.all(urls.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));

        setUniversidades(data[0].results);
        setFacultades(data[1].results);
        setEscuelas(data[2].results);
        setTiposDocente(data[3].results);
        setCategoriasDocente(data[4].results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/docente/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        router.push("/docenteList");
      } else {
        const errorData = await response.json();
        alert("Error al crear el docente: " + JSON.stringify(errorData));
      }
    } catch (error) {
      alert("Hubo un error al conectar con la API: " + error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Información del Docente</legend>

          <div className="row">
            <div className="col">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="campo-input"
                required
              />
            </div>

            <div className="col">
              <label htmlFor="apellidos">Apellidos:</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="campo-input"
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="sexo">Sexo:</label>
              <select
                id="sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="campo-input"
                required
              >
                <option value="" disabled>
                  -- Seleccione el sexo --
                </option>
                <option value="F">Femenino</option>
                <option value="M">Masculino</option>
              </select>
            </div>

            <div className="col">
              <label htmlFor="estado_civil">Estado Civil:</label>
              <select
                id="estado_civil"
                name="estado_civil"
                value={formData.estado_civil}
                onChange={handleChange}
                // className="campo-input"
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
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className="campo-input"
                required
              />
            </div>

            <div className="col">
              <label htmlFor="telefono">Teléfono:</label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="campo-input"
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="campo-input"
                required
              />
            </div>

            <div className="col">
              <label htmlFor="estado">Estado:</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="campo-input"
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
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="UniversidadCodigo">Universidad:</label>
              <select
                id="UniversidadCodigo"
                name="UniversidadCodigo"
                value={formData.UniversidadCodigo}
                onChange={handleChange}
                className="campo-input"
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
            </div>

            <div className="col">
              <label htmlFor="facultadCodigo">Facultad:</label>
              <select
                id="facultadCodigo"
                name="facultadCodigo"
                value={formData.facultadCodigo}
                onChange={handleChange}
                className="campo-input"
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
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="escuelaCodigo">Escuela:</label>
              <select
                id="escuelaCodigo"
                name="escuelaCodigo"
                value={formData.escuelaCodigo}
                onChange={handleChange}
                className="campo-input"
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
            </div>

            <div className="col">
              <label htmlFor="tipoDocenteCodigo">Tipo de Docente:</label>
              <select
                id="tipoDocenteCodigo"
                name="tipoDocenteCodigo"
                value={formData.tipoDocenteCodigo}
                onChange={handleChange}
                className="campo-input"
                required
              >
                <option value="" disabled>
                  -- Seleccione un Tipo de Docente --
                </option>
                {tiposDocente.map((tipoDocente) => (
                  <option key={tipoDocente.tipoDocenteCodigo} value={tipoDocente.tipoDocenteCodigo}>
                    {tipoDocente.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="categoriaCodigo">Categoría de Docente:</label>
              <select
                id="categoriaCodigo"
                name="categoriaCodigo"
                value={formData.categoriaCodigo}
                onChange={handleChange}
                className="campo-input"
                required
              >
                <option value="" disabled>
                  -- Seleccione una Categoría --
                </option>
                {categoriasDocente.map((categoria) => (
                  <option key={categoria.categoriaCodigo} value={categoria.categoriaCodigo}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <button type="submit" className="btn btn-primary">
              Guardar Docente
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
