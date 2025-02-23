"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import { deleteEntity } from "@utils/delete";
import { fetchAsignacionData } from "@api/asignacionService";
import { debounce } from "lodash";

function PrincipalListClient({ initialData, totalPages: initialTotalPages, periodo }) {
  const [asignaciones, setAsignaciones] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const fetchData = async (page, query) => {
    try {
      const { asignaciones, totalPages } = await fetchAsignacionData(periodo, page, query);
      setAsignaciones(asignaciones);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchQuery);
  }, [currentPage, searchQuery]); // Fetch data only when currentPage or searchQuery changes

  const handlePageChange = (page) => {
    setCurrentPage(page); // Set the current page directly
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on search
  };

  const deleteAsignacion = useCallback((id) => {
    deleteEntity(`${API}api/asignacionDocente/delete`, id, setAsignaciones, "ADIDcodigo");
  }, [API]);

  // Create a debounced function to handle search input
  const debouncedSearchChange = useCallback(debounce(handleSearchChange, 500), []); // Debounce search change

  return (
    <div className="mt-4">
      <Link
        className="btn btn-success my-2"
        href={`${API}export/asignacionDocenteExport?period=${periodo}`}
      >
        Exportar
      </Link>

      <Search
        SearchSubmit={handleSearchSubmit}
        SearchChange={debouncedSearchChange} // Use debounced function for search
        searchQuery={searchQuery}
      />

      <Tables>
        <thead>
          <tr>
            <th>NRC</th>
            <th>Clave</th>
            <th>Asignatura</th>
            <th>Codigo</th>
            <th>Profesor</th>
            <th>Seccion</th>
            <th>Modalidad</th>
            <th>Campus</th>
            <th>Facultad</th>
            <th>Escuela</th>
            <th>Tipo</th>
            <th>Cupo</th>
            <th>Inscripto</th>
            <th>Horario</th>
            <th>Dias</th>
            <th>Aulas</th>
            <th>CR</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {asignaciones.length === 0 ? (
            <tr>
              <td colSpan="18" className="text-center">
                No asignaciones encontradas.
              </td>
            </tr>
          ) : (
            asignaciones.map((asignacion) => (
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
                    href={`/asignacionEdit/${asignacion.ADIDcodigo}?period=${periodo}`}
                  >
                    <Image src="/edit.svg" alt="editar" width={20} height={20} />
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deleteAsignacion(asignacion.ADIDcodigo)}
                  >
                    <Image src="/delete.svg" alt="borrar" width={20} height={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Tables>

      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange} // Pass the handlePageChange function
        />
      )}
    </div>
  );
}

export default PrincipalListClient;
