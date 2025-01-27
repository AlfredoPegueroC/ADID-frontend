"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Components
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Modal from "@components/Modal";

import { deleteEntity } from "@utils/delete";
// Forms
import ImportPage from "@components/forms/ImportAsignacion";

// Utils
import withAuth from "@utils/withAuth";

function AsignacionDocenteList() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const Api_import_URL = "http://localhost:8000/import/asignacion";

  const fetchData = async () => {
    try {
      // Fetch main data for AsignacionDocente
      const asignacionResponse = await fetch("http://localhost:8000/api/asignacion");
      if (!asignacionResponse.ok) {
        throw new Error("Failed to fetch asignaciones");
      }
      const asignacionData = await asignacionResponse.json();
      console.log("Asignaciones data:", asignacionData);

      // Fetch related data
      const facultadResponse = await fetch("http://localhost:8000/api/facultad");
      if (!facultadResponse.ok) {
        throw new Error("Failed to fetch facultades");
      }
      const facultadData = await facultadResponse.json();

      const escuelaResponse = await fetch("http://localhost:8000/api/escuela");
      if (!escuelaResponse.ok) { 
        throw new Error("Failed to fetch escuelas");
      }
      const escuelaData = await escuelaResponse.json();

      const docenteResponse = await fetch("http://localhost:8000/api/docente");
      if (!docenteResponse.ok) {
        throw new Error("Failed to fetch docentes");
      }
      const docenteData = await docenteResponse.json();

      // Merge data
      const mergedData = asignacionData.results.map((asignacion) => {
        const facultad = facultadData.results.find(
          (fac) => fac.facultadCodigo === asignacion.facultadCodigo
        );
        const escuela = escuelaData.results.find(
          (esc) => esc.escuelaCodigo === asignacion.escuelaCodigo
        );
        const docente = docenteData.results.find(
          (doc) => doc.Docentecodigo === asignacion.DocenteCodigo
        );

        return {
          ...asignacion,
          facultadNombre: facultad ? facultad.nombre : "N/A",
          escuelaNombre: escuela ? escuela.nombre : "N/A",
          docenteNombre: docente ? `${docente.nombre} ${docente.apellidos}` : "N/A",
        };
      });

      setAsignaciones(mergedData);
      setTotalPages(Math.ceil(asignacionData.count / 10));

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchData();
  }, [page]);

  const deleteAsignacion = async (pk) => {
    const confirmDelete = window.confirm("¿Estás seguro de querer eliminar?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/asignacionDocente/delete/${pk}/`,
          { method: "DELETE" }
        );
        if (response.ok) {
          setAsignaciones((prevAsignaciones) =>
            prevAsignaciones.filter((asignacion) => asignacion.ADIDcodigo !== pk)
          );
          alert("La asignación fue eliminada exitosamente");
        } else {
          alert("Error eliminando la asignación. Por favor, inténtelo de nuevo.");
        }
      } catch (error) {
        console.error("Error deleting asignacion:", error);
        alert("Error al eliminar la asignación.");
      }
    }
  };
 const handleDelete = (pk) => {
    deleteEntity("http://localhost:8000/api/asignacionDocente/delete", pk, setAsignaciones, "ADIDCodigo");
  };



  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <button type="button" className="btn btn-primary mt-5" data-bs-toggle="modal" data-bs-target="#Modal">
        Nueva Asignación
      </button>
      {asignaciones.length > 0 && (
        <Link
          className="btn btn-success mt-5 ms-2"
          href="http://127.0.0.1:8000/export/asignacionDocenteExport"
        >
          Exportar
        </Link>
      )}
      
      {/* Modal components */}
      <Modal title="Importar Asignación">
        <ImportPage importURL={Api_import_URL} onSuccess={fetchData} />
      </Modal>

      <Tables>
        <thead>
          <tr>
            <th scope="col">NRC</th>
            <th scope="col">Clave</th>
            <th scope="col">Asignatura</th>
            <th scope="col">Codigo</th>
            <th scope="col">Profesor</th>
            <th scope="col">Seccion</th>
            <th scope="col">Modalidad</th>
            <th scope="col">Campus</th>
            <th scope="col">Facultad</th>
            <th scope="col">Escuela</th>
            <th scope="col">Tipo</th>
            <th scope="col">Cupo</th>
            <th scope="col">Inscripto</th>
            <th scope="col">Horario</th>
            <th scope="col">Dias</th>
            <th scope="col">Aulas</th>
            <th scope="col">CR</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {asignaciones.length === 0 && (
            <tr>
              <td colSpan="16" className="text-center">
                No asignaciones encontradas.
              </td>
            </tr>
          )}
          {asignaciones.map((asignacion, index) => (
            <tr key={asignacion.ADIDcodigo}>
              <td>{asignacion.nrc}</td>
              <td>{asignacion.clave}</td>
              <td>{asignacion.asignatura}</td>
              <td>{asignacion.codigo}</td>
              <td>{asignacion.docenteNombre}</td>
              <td>{asignacion.seccion}</td>
              <td>{asignacion.modalidad}</td>
              <td>{asignacion.campus}</td>
              <td>{asignacion.facultadNombre}</td>
              <td>{asignacion.escuelaNombre}</td>
              <td>{asignacion.tipo}</td>
              <td>{asignacion.cupo}</td>
              <td>{asignacion.inscripto}</td>
              <td>{asignacion.horario}</td>
              <td>{asignacion.dias}</td>
              <td>{asignacion.Aula}</td>
              <td>{asignacion.creditos}</td>
              <td>
                <Link
                  className="btn btn-primary btn-sm"
                  href={`/asignacionEdit/${asignacion.ADIDcodigo}`}
                >
                  Editar
                </Link>
                <button
                  className="btn btn-danger btn-sm mx-2"
                  onClick={() => handleDelete(asignacion.ADIDcodigo)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Tables>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}


export default withAuth(AsignacionDocenteList);