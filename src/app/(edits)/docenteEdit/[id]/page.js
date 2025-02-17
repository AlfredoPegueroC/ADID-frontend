"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";

function DocenteEdit({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const [docente, setDocente] = useState(null);
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const docenteResponse = await fetch(`${API}/api/docente/${id}/`);
        if (!docenteResponse.ok) throw new Error("Failed to fetch docente");
        const docenteData = await docenteResponse.json();
        setDocente(docenteData);
        console.log(docenteData);
        const universidadesResponse = await fetch(`${API}/api/universidad`);
        if (!universidadesResponse.ok)
          throw new Error("Failed to fetch universidades");
        const universidadesData = await universidadesResponse.json();
        setUniversidades(universidadesData.results);

        const facultadesResponse = await fetch(`${API}/api/facultad`);
        if (!facultadesResponse.ok)
          throw new Error("Failed to fetch facultades");
        const facultadesData = await facultadesResponse.json();
        setFacultades(facultadesData.results);

        const escuelasResponse = await fetch(`${API}/api/escuela`);
        if (!escuelasResponse.ok) throw new Error("Failed to fetch escuelas");
        const escuelasData = await escuelasResponse.json();
        setEscuelas(escuelasData.results);

        const tiposResponse = await fetch(`${API}/api/tipodocente`);
        if (!tiposResponse.ok) throw new Error("Failed to fetch tipos");
        const tiposData = await tiposResponse.json();
        setTipos(tiposData.results);

        const categoriasResponse = await fetch(`${API}/api/categoriaDocente`);
        if (!categoriasResponse.ok)
          throw new Error("Failed to fetch categorias");
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, API]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docente) return;

    try {
      const response = await fetch(`${API}/api/docente/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(docente),
      });
      console.log(response);
      if (response.ok) {
        alert("Docente updated successfully!");
        router.push("/docenteList");
      } else {
        alert("Failed to update docente.");
        console.log(response.json());
      }
    } catch (error) {
      console.error("Error updating docente:", error);
      alert("An error occurred.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocente({ ...docente, [name]: value });
  };

  if (loading) {
    return (
      <div className="spinner-container ">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <FormLayout>
      <div className={Styles.container}>
        <form onSubmit={handleSubmit} className={Styles.form}>
          <h1 className={Styles.title}>Editar Docente</h1>

          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={docente?.nombre || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Styles.name_group}>
              <label htmlFor="apellidos">Apellido</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={docente?.apellidos || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="sexo">Sexo</label>
              <input
                type="text"
                id="sexo"
                name="sexo"
                value={docente?.sexo || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Styles.name_group}>
              <label htmlFor="estado_civil">Estado civil</label>
              <select
                id="estado_civil"
                name="estado_civil"
                value={docente?.estado_civil || ""}
                onChange={handleChange}
              >
                <option value="Soltero">Soltero</option>
                <option value="Casado">Casado</option>
                <option value="Union Libre">Union Libre</option>
                <option value="Viudo">Viudo</option>
              </select>
            </div>
          </div>
          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
              <input
                type="text"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                value={docente?.fecha_nacimiento || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Styles.name_group}>
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={docente?.telefono || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={docente?.direccion || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Styles.name_group}>
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={docente?.estado || ""}
                onChange={handleChange}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Jubilado">Jubilado</option>
                <option value="Sabático">Sabático</option>
                <option value="Licencia">Licencia</option>
              </select>
            </div>
          </div>
          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="UniversidadCodigo">Universidad</label>
              <select
                id="UniversidadCodigo"
                name="UniversidadCodigo"
                value={docente?.UniversidadCodigo || ""}
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
              <label htmlFor="facultadCodigo">Facultad</label>
              <select
                id="facultadCodigo"
                name="facultadCodigo"
                value={docente?.facultadCodigo || ""}
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
          </div>
          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="escuelaCodigo">Escuela</label>
              <select
                id="escuelaCodigo"
                name="escuelaCodigo"
                value={docente?.escuelaCodigo || ""}
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
              <label htmlFor="tipoDocenteCodigo">Tipo Docente</label>
              <select
                id="tipoDocenteCodigo"
                name="tipoDocenteCodigo"
                value={docente?.tipoDocenteCodigo || ""}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  -- Seleccione un tipo docente --
                </option>
                {tipos.map((tipo) => (
                  <option
                    key={tipo.tipoDocenteCodigo}
                    value={tipo.tipoDocenteCodigo}
                  >
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="categoriaCodigo">Categoría de Docente:</label>
            <select
              id="categoriaCodigo"
              name="categoriaCodigo"
              value={docente?.categoriaCodigo || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                -- Seleccione la Categoría de Docente --
              </option>
              {categorias.map((categoria) => (
                <option
                  key={categoria.categoriaCodigo}
                  value={categoria.categoriaCodigo}
                >
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={Styles.btn}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(DocenteEdit);
