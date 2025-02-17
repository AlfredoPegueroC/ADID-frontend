"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";

function AsignacionEdit({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const searchParams = useSearchParams()
  const period = searchParams.get("period");

  const [asignacion, setAsignacion] = useState(null);

  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const asignacionResponse = await fetch(
          `${API}/api/asignacion/${id}/`
        );
        if (!asignacionResponse.ok)
          throw new Error("Fallo la llamada de datos asignacion");
        const asignacionData = await asignacionResponse.json();
        setAsignacion(asignacionData); //

        const facultadesResponse = await fetch(
          `${API}/api/facultad`
        );
        if (!facultadesResponse.ok)
          throw new Error("Failed to fetch facultades");
        const facultadesData = await facultadesResponse.json();
        setFacultades(facultadesData.results);

        const escuelasResponse = await fetch(
          `${API}/api/escuela`
        );
        if (!escuelasResponse.ok) throw new Error("Failed to fetch escuelas");
        const escuelasData = await escuelasResponse.json();
        setEscuelas(escuelasData.results);

        const docenteResponse = await fetch(
          `${API}/api/docente`
        );
        if (!docenteResponse.ok) throw new Error("Failed to fetch docentes");
        const docentesData = await docenteResponse.json();
        setDocentes(docentesData.results);
      } catch (error) {
        console.error("Error al buscar los datos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!asignacion) return;

    try {
      const response = await fetch(
        `${API}/api/asignacion/edit/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(asignacion),
        }
      );

      if (response.ok) {
        alert("Asignacion se ha Actualizado!");
        router.push(`/asignacionDocente/${period}`);
      } else {
        alert("Failed to update Asignacion.");
        console.log(response.json());
      }
    } catch (error) {
      console.error("Error updating Asignacion:", error);
      alert("An error occurred.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsignacion({ ...asignacion, [name]: value });
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
        <form className={Styles.form} onSubmit={handleSubmit}>
          <h1>Editar Asignación</h1>

          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label>NRC</label>
              <input
                type="text"
                name="rnc"
                value={asignacion.nrc || ""}
                onChange={handleChange}
                required
                disabled
              />
            </div>

            <div className={Styles.name_group}>
              <label>Clave</label>
              <input
                type="text"
                name="clave"
                value={asignacion.clave || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={Styles.names}>
              <div className={Styles.name_group}>
                <label>Asignatura</label>
                <input
                  type="text"
                  name="asignatura"
                  value={asignacion.asignatura || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={Styles.name_group}>
                <label>Código</label>
                <input
                  type="text"
                  name="codigo"
                  value={asignacion.codigo || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className={Styles.names}>
              <div className={Styles.name_group}>
                <label>Profesor</label>
                <select
                  name="DocenteCodigo"
                  value={asignacion?.DocenteCodigo || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    -- Seleccione un Profesor --
                  </option>
                  {docentes.map((docente) => (
                    <option
                      key={docente.Docentecodigo}
                      value={docente.Docentecodigo}
                    >
                      {docente.nombre} {docente.apellidos}
                    </option>
                  ))}
                </select>
              </div>

              <div className={Styles.name_group}>
                <label>Sección</label>
                <input
                  type="text"
                  name="seccion"
                  value={asignacion.seccion || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={Styles.names}>
              <div className={Styles.name_group}>
                <label>Modalidad</label>
                <input
                  type="text"
                  name="modalidad"
                  value={asignacion.modalidad || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={Styles.name_group}>
                <label>Campus</label>
                <input
                  type="text"
                  name="campus"
                  value={asignacion.campus || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={Styles.names}>
              <div className={Styles.name_group}>
                <label>Facultad</label>
                <select
                  name="facultadCodigo"
                  value={asignacion?.facultadCodigo || ""}
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
                <label>Escuela</label>
                <select
                  name="escuelaCodigo"
                  value={asignacion?.escuelaCodigo || ""}
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
            </div>

            <div className={Styles.names}>
              <div className={Styles.name_group}>
                <label>Tipo</label>
                <input
                  type="text"
                  name="tipo"
                  value={asignacion.tipo || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={Styles.name_group}>
                <label>Cupo</label>
                <input
                  type="number"
                  name="cupo"
                  value={asignacion.cupo || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className={Styles.names}>
              <div className={Styles.name_group}>
                <label>Inscripto</label>
                <input
                  type="number"
                  name="inscripto"
                  value={asignacion.inscripto || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={Styles.name_group}>
                <label>Horario</label>
                <input
                  type="text"
                  name="horario"
                  value={asignacion.horario || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className={Styles.names}>
              <div className={Styles.name_group}>
                <label>Días</label>
                <input
                  type="text"
                  name="dias"
                  value={asignacion.dias || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={Styles.name_group}>
                <label>Aula</label>
                <input
                  type="text"
                  name="Aula"
                  value={asignacion.Aula || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className={Styles.name_group}>
              <label>Créditos</label>
              <input
                type="number"
                name="creditos"
                value={asignacion.creditos || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className={Styles.btn}>
            Guardar
          </button>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(AsignacionEdit);
