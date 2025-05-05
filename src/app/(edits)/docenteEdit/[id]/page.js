"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";
import Notification from "@components/Notification";

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
        const docenteResponse = await fetch(`${API}api/docente/${id}/`);
        if (!docenteResponse.ok) throw new Error("Failed to fetch docente");
        const docenteData = await docenteResponse.json();
        setDocente(docenteData);

        const universidadesData = await (await fetch(`${API}api/universidad`)).json();
        setUniversidades(universidadesData.results);

        const facultadesData = await (await fetch(`${API}api/facultad`)).json();
        setFacultades(facultadesData.results);

        const escuelasData = await (await fetch(`${API}api/escuela`)).json();
        setEscuelas(escuelasData.results);

        const tiposData = await (await fetch(`${API}api/tipodocente`)).json();
        setTipos(tiposData.results);

        const categoriasData = await (await fetch(`${API}api/categoriaDocente`)).json();
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
      const response = await fetch(`${API}api/docente/edit/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docente),
      });
      if (response.ok) {
        Notification.alertSuccess("Docente Editado.");
        router.push("/docenteList");
      } else {
        Notification.alertError("Fallo al Editar.");
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Error updating docente:", error);
      Notification.alertError("Fallo al Editar.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocente({ ...docente, [name]: value });
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <FormLayout>
      <div className={Styles.container}>
        <form onSubmit={handleSubmit} className={Styles.form}>
          <h1 className={Styles.title}>Editar Docente</h1>

          <div className={Styles.name_group}>
            <label htmlFor="DocenteCodigo">Código del Docente</label>
            <input
              type="text"
              id="DocenteCodigo"
              name="DocenteCodigo"
              value={docente?.DocenteCodigo || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="DocenteNombre">Nombre</label>
              <input
                type="text"
                id="DocenteNombre"
                name="DocenteNombre"
                value={docente?.DocenteNombre || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={Styles.name_group}>
              <label htmlFor="DocenteApellido">Apellido</label>
              <input
                type="text"
                id="DocenteApellido"
                name="DocenteApellido"
                value={docente?.DocenteApellido || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="DocenteSexo">Sexo</label>
              <select
                id="DocenteSexo"
                name="DocenteSexo"
                value={docente?.DocenteSexo || ""}
                onChange={handleChange}
                required
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            <div className={Styles.name_group}>
              <label htmlFor="DocenteEstadoCivil">Estado Civil</label>
              <select
                id="DocenteEstadoCivil"
                name="DocenteEstadoCivil"
                value={docente?.DocenteEstadoCivil || ""}
                onChange={handleChange}
                required
              >
                <option value="Soltero">Soltero</option>
                <option value="Casado">Casado</option>
                <option value="Union Libre">Unión Libre</option>
                <option value="Viudo">Viudo</option>
              </select>
            </div>
          </div>

          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="DocenteFechaNacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                id="DocenteFechaNacimiento"
                name="DocenteFechaNacimiento"
                value={docente?.DocenteFechaNacimiento || ""}
                onChange={handleChange}
              />
            </div>
            <div className={Styles.name_group}>
              <label htmlFor="DocenteLugarNacimiento">Lugar de Nacimiento</label>
              <input
                type="text"
                id="DocenteLugarNacimiento"
                name="DocenteLugarNacimiento"
                value={docente?.DocenteLugarNacimiento || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="DocenteFechaIngreso">Fecha de Ingreso</label>
              <input
                type="date"
                id="DocenteFechaIngreso"
                name="DocenteFechaIngreso"
                value={docente?.DocenteFechaIngreso || ""}
                onChange={handleChange}
              />
            </div>
            <div className={Styles.name_group}>
              <label htmlFor="DocenteNacionalidad">Nacionalidad</label>
              <input
                type="text"
                id="DocenteNacionalidad"
                name="DocenteNacionalidad"
                value={docente?.DocenteNacionalidad || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="DocenteTipoIdentificacion">Tipo de Identificación</label>
              <input
                type="text"
                id="DocenteTipoIdentificacion"
                name="DocenteTipoIdentificacion"
                value={docente?.DocenteTipoIdentificacion || ""}
                onChange={handleChange}
              />
            </div>
            <div className={Styles.name_group}>
              <label htmlFor="DocenteNumeroIdentificacion">Número de Identificación</label>
              <input
                type="text"
                id="DocenteNumeroIdentificacion"
                name="DocenteNumeroIdentificacion"
                value={docente?.DocenteNumeroIdentificacion || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="DocenteTelefono">Teléfono</label>
              <input
                type="text"
                id="DocenteTelefono"
                name="DocenteTelefono"
                value={docente?.DocenteTelefono || ""}
                onChange={handleChange}
              />
            </div>
            <div className={Styles.name_group}>
              <label htmlFor="DocenteCorreoElectronico">Correo Electrónico</label>
              <input
                type="email"
                id="DocenteCorreoElectronico"
                name="DocenteCorreoElectronico"
                value={docente?.DocenteCorreoElectronico || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="DocenteDireccion">Dirección</label>
            <input
              type="text"
              id="DocenteDireccion"
              name="DocenteDireccion"
              value={docente?.DocenteDireccion || ""}
              onChange={handleChange}
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="DocenteEstado">Estado</label>
            <select
              id="DocenteEstado"
              name="DocenteEstado"
              value={docente?.DocenteEstado || ""}
              onChange={handleChange}
              required
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="DocenteObservaciones">Observaciones</label>
            <textarea
              id="DocenteObservaciones"
              name="DocenteObservaciones"
              rows="3"
              value={docente?.DocenteObservaciones || ""}
              onChange={handleChange}
            />
          </div>

          {/* FOREIGN KEYS */}
          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="Docente_UniversidadFK">Universidad</label>
              <select
                id="Docente_UniversidadFK"
                name="Docente_UniversidadFK"
                value={docente?.Docente_UniversidadFK || ""}
                onChange={handleChange}
              >
                <option value="">-- Seleccione una Universidad --</option>
                {universidades.map((u) => (
                  <option key={u.UniversidadID} value={u.UniversidadID}>
                    {u.UniversidadNombre}
                  </option>
                ))}
              </select>
            </div>

            <div className={Styles.name_group}>
              <label htmlFor="Docente_TipoDocenteFK">Tipo Docente</label>
              <select
                id="Docente_TipoDocenteFK"
                name="Docente_TipoDocenteFK"
                value={docente?.Docente_TipoDocenteFK || ""}
                onChange={handleChange}
              >
                <option value="">-- Seleccione un Tipo Docente --</option>
                {tipos.map((tipo) => (
                  <option key={tipo.TipoDocenteID} value={tipo.TipoDocenteID}>
                    {tipo.TipoDocenteDescripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="Docente_CategoriaDocenteFK">Categoría Docente</label>
            <select
              id="Docente_CategoriaDocenteFK"
              name="Docente_CategoriaDocenteFK"
              value={docente?.Docente_CategoriaDocenteFK || ""}
              onChange={handleChange}
            >
              <option value="">-- Seleccione una Categoría --</option>
              {categorias.map((c) => (
                <option key={c.CategoriaID} value={c.CategoriaID}>
                  {c.CategoriaNombre}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={Styles.btn}>Guardar Cambios</button>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(DocenteEdit);

