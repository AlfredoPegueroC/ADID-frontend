"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Components
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";

import { deleteEntity } from "@utils/delete";

// Utils
import withAuth from "@utils/withAuth";

function principal({ params }) {
  const { periodo } = React.use(params);

  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // const Api_import_URL = "http://localhost:8000/import/asignacion";

  const fetchData = async () => {
    try {
      const searchParam = searchQuery
        ? `&search=${encodeURIComponent(searchQuery)}`
        : "";

      // Fetch main data for AsignacionDocente
      const asignacionResponse = await fetch(
        `http://localhost:8000/api/asignacion_frontend?page=${page}&period=${periodo}${searchParam}`
      );
      if (!asignacionResponse.ok) {
        throw new Error("Failed to fetch asignaciones");
      }
      const asignacionData = await asignacionResponse.json();
      console.log("Asignaciones data:", asignacionData);

      // Fetch related data
      const facultadResponse = await fetch(
        "http://localhost:8000/api/facultad"
      );
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
          docenteNombre: docente
            ? `${docente.nombre} ${docente.apellidos}`
            : "N/A",
        };
      });

      setAsignaciones(asignacionData.results);
      setTotalPages(Math.ceil(asignacionData.count / 30));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleDelete = (pk) => {
    deleteEntity(
      "http://localhost:8000/api/asignacionDocente/delete",
      pk,
      setAsignaciones,
      "ADIDcodigo"
    );
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  if (loading) {
    return (
      <div className="spinner-container ">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Link
        className="btn btn-success my-2"
        href={`http://127.0.0.1:8000/export/asignacionDocenteExport?period=${periodo}`}
      >
        Exportar
      </Link>

      <Search
        SearchSubmit={handleSearchSubmit}
        SearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

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
              <td>{asignacion.docente_nombre_completo}</td>
              <td>{asignacion.seccion}</td>
              <td>{asignacion.modalidad}</td>
              <td>{asignacion.campus}</td>
              <td>{asignacion.facultadCodigo}</td>
              <td>{asignacion.escuelaCodigo}</td>
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
                  <Image src="/edit.svg" alt="editar" width={20} height={20} />
                </Link>
                <button
                  type="button"
                  className="btn btn-danger btn-sm mx-2"
                  onClick={() => handleDelete(asignacion.ADIDcodigo)}
                >
                  <Image
                    src="/delete.svg"
                    alt="borrar"
                    width={20}
                    height={20}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Tables>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export default withAuth(principal);
