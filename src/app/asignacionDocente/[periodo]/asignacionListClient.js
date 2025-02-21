"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";

// Components
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
// import { fetchAsignacion } from "@/api/asignacionService";
// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function PrincipalClient({ initialData, periodo }) {
  const [asignaciones, setAsignaciones] = useState(initialData.asignaciones);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [searchQuery, setSearchQuery] = useState("");

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedFetchData();
  };

  const fetchData = async () => {
    try {
      const searchParam = searchQuery
        ? `&search=${encodeURIComponent(searchQuery)}`
        : "";
      const response = await fetch(
        `${API}/api/asignacion_frontend?page=${page}&period=${periodo}${searchParam}`
      );
      const data = await response.json();
      setAsignaciones(data.results);
      setTotalPages(Math.ceil(data.count / 30));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = debounce(fetchData, 300);

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

export default withAuth(PrincipalClient);
