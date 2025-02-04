"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";

function AsignacionEdit({ params }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [asignacion, setAsignacion] = useState(null);

  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const asignacionResponse = await fetch(
          `http://localhost:8000/api/asignacion/${id}/`
        );
        if (!asignacionResponse.ok)
          throw new Error("Fallo la llamada de datos asignacion");
        const asignacionData = await asignacionResponse.json();
        setAsignacion(asignacionData); // ✅ Correcto aquí

        const facultadesResponse = await fetch(
          "http://localhost:8000/api/facultad"
        );
        if (!facultadesResponse.ok)
          throw new Error("Failed to fetch facultades");
        const facultadesData = await facultadesResponse.json();
        setFacultades(facultadesData.results);

        const escuelasResponse = await fetch(
          "http://localhost:8000/api/escuela"
        );
        if (!escuelasResponse.ok) throw new Error("Failed to fetch escuelas");
        const escuelasData = await escuelasResponse.json();
        setEscuelas(escuelasData.results);

        const docenteResponse = await fetch(
          "http://localhost:8000/api/docente"
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
        `http://localhost:8000/api/asignacion/edit/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(asignacion),
        }
      );

      if (response.ok) {
        alert("Asignacion updated successfully!");
        router.push("/");
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
  if (loading) return <p>Loading...</p>;

  return (
    <FormLayout>
      <h1>Editar Asignacion</h1>
      <form onSubmit={handleSubmit}>
        
      <div className="mb-3">
          <label>NRC</label>
          <input
            type="text"
            className="form-control"
            name="rnc"
            value={asignacion.nrc || ""}
            onChange={handleChange}
            required
            disabled
          />
        </div>

        <div className="mb-3">
          <label>Clave</label>
          <input
            type="text"
            className="form-control"
            name="clave"
            value={asignacion.clave || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Asignatura</label>
          <input
            type="text"
            className="form-control"
            name="asignatura"
            value={asignacion.asignatura || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Código</label>
          <input
            type="text"
            className="form-control"
            name="codigo"
            value={asignacion.codigo || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="DocenteCodigo" className="form-label">
            Profesor
          </label>
          <select
            id="DocenteCodigo"
            name="DocenteCodigo"
            value={asignacion?.DocenteCodigo || ""}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione un Profesor --
            </option>
            {docentes.map((docente) => (
              <option key={docente.Docentecodigo} value={docente.Docentecodigo}>
                {docente.nombre} {docente.apellidos} {docente.DocenteCodigo}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Sección</label>
          <input
            type="text"
            className="form-control"
            name="seccion"
            value={asignacion.seccion || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Modalidad</label>
          <input
            type="text"
            className="form-control"
            name="modalidad"
            value={asignacion.modalidad || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Campus</label>
          <input
            type="text"
            className="form-control"
            name="campus"
            value={asignacion.campus || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="facultadCodigo" className="form-label">
            Facultad
          </label>
          <select
            id="facultadCodigo"
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

        <div className="mb-3">
          <label htmlFor="escuelaCodigo" className="form-label">
            Escuela
          </label>
          <select
            id="escuelaCodigo"
            name="escuelaCodigo"
            value={asignacion?.escuelaCodigo || ""}
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
        </div>

        <div className="mb-3">
          <label>Tipo</label>
          <input
            type="text"
            className="form-control"
            name="tipo"
            value={asignacion.tipo || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Cupo</label>
          <input
            type="number"
            className="form-control"
            name="cupo"
            value={asignacion.cupo || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Inscripto</label>
          <input
            type="number"
            className="form-control"
            name="inscripto"
            value={asignacion.inscripto || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Horario</label>
          <input
            type="text"
            className="form-control"
            name="horario"
            value={asignacion.horario || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Días</label>
          <input
            type="text"
            className="form-control"
            name="dias"
            value={asignacion.dias || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Aula</label>
          <input
            type="text"
            className="form-control"
            name="Aula"
            value={asignacion.Aula || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Créditos</label>
          <input
            type="number"
            className="form-control"
            name="creditos"
            value={asignacion.creditos || ""}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </form>
    </FormLayout>
  );
}

export default withAuth(AsignacionEdit);
