"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import Search from "@components/search";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchDocentes } from "@api/docenteService"; // Import your fetch function
import { debounce } from "lodash"; // Import debounce

function DocenteListClient({ initialData, totalPages }) {
  const [docentes, setDocentes] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const fetchDocentesData = async (page, query) => {
    try {
      const response = await fetchDocentes(query, page); // Fetch docentes based on the current page and search query
      setDocentes(response.results);
    } catch (error) {
      console.error("Error fetching docentes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDocentesData(page, searchQuery); // Fetch new data for the selected page
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDocentesData(currentPage, searchQuery); // Fetch data based on search query
  };

  const deleteDocente = useCallback((pk) => {
    deleteEntity(`${API}/api/docente/delete`, pk, setDocentes, "Docentecodigo");
  }, [API]);

  // Create a debounced function to fetch docentes data
  const debouncedFetchDocentesData = useCallback(debounce(fetchDocentesData, 500), []); // Adjust the debounce delay as needed

  useEffect(() => {
    fetchDocentesData(currentPage, searchQuery); // Fetch docentes when currentPage or searchQuery changes
  }, [currentPage, searchQuery]);

  useEffect(() => {
    debouncedFetchDocentesData(currentPage, searchQuery); // Fetch data with debouncing
  }, [searchQuery, currentPage, debouncedFetchDocentesData]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Docente</h1>
      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/docente">Agregar Docente</Link>
        {docentes.length > 0 && <Link className="btn btn-success" href={`${API}/export/docente`}>Exportar</Link>}
        <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#Modal">Importar</button>
      </div>

      <Modal title="Importar Docente">
        <ImportExcel importURL={`${API}/import/docente`} onSuccess={() => fetchDocentesData(currentPage, searchQuery)} />
      </Modal>

      <Search SearchSubmit={handleSearchSubmit} SearchChange={handleSearchChange} searchQuery={searchQuery} />

      <Tables>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Sexo</th>
            <th>Estado Civil</th>
            <th>Fecha</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Facultad</th>
            <th>Escuela</th>
            <th>Tipo D.</th>
            <th>Categoría</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {docentes.length === 0 && <tr><td colSpan="15" className="text-center">No docentes found.</td></tr>}
          {docentes.map((docente) => (
            <tr key={docente.Docentecodigo}>
              <td>{docente.nombre}</td>
              <td>{docente.apellidos}</td>
              <td>{docente.sexo}</td>
              <td>{docente.estado_civil}</td>
              <td>{docente.fecha_nacimiento}</td>
              <td>{docente.telefono}</td>
              <td>{docente.direccion}</td>
              <td>{docente.estado}</td>
              <td>{docente.universidadNombre}</td>
              <td>{docente.facultadNombre}</td>
              <td>{docente.escuelaNombre}</td>
              <td>{docente.tipoNombre}</td>
              <td>{docente.categoriaNombre}</td>
              <td>
                <Link className="btn btn-primary btn-sm" href={`/docenteEdit/${docente.Docentecodigo}`}>
                  <Image src="/edit.svg" alt="editar" width={20} height={20} />
                </Link>
                <button className="btn btn-danger btn-sm mx-2" onClick={() => deleteDocente(docente.Docentecodigo)}>
                  <Image src="/delete.svg" alt="borrar" width={20} height={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Tables>

      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default withAuth(DocenteListClient);
