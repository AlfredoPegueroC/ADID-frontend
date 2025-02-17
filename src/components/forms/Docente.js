"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";

export default function DocenteForm() {
  const router = useRouter();
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [tiposDocente, setTiposDocente] = useState([]);
  const [categoriasDocente, setCategoriasDocente] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

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
  const API = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true); // Set loading to true while fetching data
      try {
        const responses = await Promise.all([
          fetch(`${API}/api/universidad`),
          fetch(`${API}/api/facultad`),
          fetch(`${API}/api/escuela`),
          fetch(`${API}/api/tipodocente`),
          fetch(`${API}/api/categoriaDocente`),
        ]);
        const data = await Promise.all(responses.map((res) => res.json()));

        setUniversidades(data[0].results);
        setFacultades(data[1].results);
        setEscuelas(data[2].results);
        setTiposDocente(data[3].results);
        setCategoriasDocente(data[4].results);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage(
          "Error al cargar los datos, por favor intenta de nuevo."
        );
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    }

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API}/api/docente/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
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
        Notification.alertSuccess(
          "Universidad creada con éxito: "
        );
      } else {
        const errorData = await response.json();
        Notification.alertError(
          "Error al crear el docente, ya existe "
        );
      }
    } catch (error) {
      Notification.alertError(
        "Hubo un error al conectar con la API: " + error.message
      );
    }
  };

  if (isLoading) {
    return <div>Cargando datos...</div>; // Mostrar indicador de carga
  }

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Registrar Docente</h1>

        <div className={Styles.names}>
          <div className={Styles.name_group}>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              placeholder="Nombre"
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="apellidos">Apellidos:</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              placeholder="Apellidos"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={Styles.names}>
          <div className={Styles.name_group}>
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
          </div>

          <div className={Styles.name_group}>
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
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Union Libre">Unión Libre</option>
              <option value="Viudo">Viudo</option>
            </select>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              placeholder="Telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="direccion">Dirección:</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              placeholder="Direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
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
          </div>

          <div className={Styles.name_group}>
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
          </div>

          <div className={Styles.name_group}>
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
          </div>

          <div className={Styles.name_group}>
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
                <option
                  key={escuela.escuelaCodigo}
                  value={escuela.escuelaCodigo}
                >
                  {escuela.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className={Styles.name_group}>
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
          </div>

          <div className={Styles.name_group}>
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
          </div>
        </div>
        <button type="submit" className={Styles.btn}>
          Enviar
        </button>
      </form>
    </div>
  );
}