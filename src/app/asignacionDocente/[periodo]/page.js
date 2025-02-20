"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash"; // Import debounce from lodash

// Components
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function Principal({ params }) {
  const { periodo } = React.use(params); // Directly destructure params

  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const fetchData = useCallback(async () => {
    try {
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

      const asignacionResponse = await fetch(
        `${API}/api/asignacion_frontend?page=${page}&period=${periodo}${searchParam}`
      );
      if (!asignacionResponse.ok) {
        throw new Error("Failed to fetch asignaciones");
      }
      const asignacionData = await asignacionResponse.json();
      console.log("Asignaciones data:", asignacionData);

      // Use Promise.all to fetch related data concurrently
      const [facultadResponse, escuelaResponse, docenteResponse] = await Promise.all([
        fetch(`${API}/api/facultad`),
        fetch(`${API}/api/escuela`),
        fetch(`${API}/api/docente`),
      ]);

      if (!facultadResponse.ok || !escuelaResponse.ok || !docenteResponse.ok) {
        throw new Error("Failed to fetch related data");
      }

      const facultadData = await facultadResponse.json();
      const escuelaData = await escuelaResponse.json();
      const docenteData = await docenteResponse.json();

      // Merge data
      const mergedData = asignacionData.results.map((asignacion) => {
        const facultad = facultadData.results.find((fac) => fac.facultadCodigo === asignacion.facultadCodigo);
        const escuela = escuelaData.results.find((esc) => esc.escuelaCodigo === asignacion.escuelaCodigo);
        const docente = docenteData.results.find((doc) => doc.Docentecodigo === asignacion.DocenteCodigo);

        return {
          ...asignacion,
          facultadNombre: facultad ? facultad.nombre : "N/A",
          escuelaNombre: escuela ? escuela.nombre : "N/A",
          docenteNombre: docente ? `${docente.nombre} ${docente.apellidos}` : "N/A",
        };
      });

      setAsignaciones(mergedData); // Use mergedData instead of asignacionData.results
      setTotalPages(Math.ceil(asignacionData.count / 30));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, periodo, searchQuery, API]); // Add dependencies

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Call fetchData when it changes

  const debouncedFetchData = debounce(fetchData, 300); // Debounce the fetch function

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedFetchData(); // Call the debounced function
  };

  const handleDelete = (pk) => {
    deleteEntity(
      `${API}/api/asignacionDocente/delete`,
      pk,
      setAsignaciones,
      "ADIDcodigo"
    );
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
        href={`${API}/export/asignacionDocenteExport?period=${periodo}`}
      >
        Exportar
      </Link>

      <Search
        SearchSubmit={(e) => {
          e.preventDefault();
          fetchData(); // Call fetchData on submit
        }}
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
          {asignaciones.map((asignacion) => (
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
                  href={`/asignacionEdit/${asignacion.ADIDcodigo}?period=${periodo}`}
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

export default withAuth(Principal);
