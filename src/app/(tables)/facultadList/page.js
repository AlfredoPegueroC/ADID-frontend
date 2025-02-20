"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import debounce from "lodash/debounce";

// Components
import Pagination from "@components/Pagination";
import Tables from "@/src/components/Tables";
import ImportExcel from "@components/forms/Import";
import Modal from "@components/Modal";
import Search from "@components/search";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function FacultadList() {
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null); // State for error handling

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const Api_import_URL = `${API}/import/facultad`;

  const fetchData = useCallback(async () => {
    setLoading(true); // Show loading indicator
    setError(null); // Reset error state
    try {
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

      const [facultadesResponse, universidadesResponse] = await Promise.all([
        fetch(`${API}/api/facultad?page=${page}${searchParam}`),
        fetch(`${API}/api/universidad`),
      ]);

      if (!facultadesResponse.ok) throw new Error("Failed to fetch facultades");
      const facultadesData = await facultadesResponse.json();

      if (!universidadesResponse.ok) throw new Error("Failed to fetch universidades");
      const universidadesData = await universidadesResponse.json();

      const mergedData = facultadesData.results.map((facultad) => {
        const universidad = universidadesData.results.find(
          (uni) => uni.UniversidadCodigo === facultad.UniversidadCodigo
        );
        return {
          ...facultad,
          universidadNombre: universidad ? universidad.nombre : "Universidad no encontrada",
        };
      });

      setFacultades(mergedData);
      setTotalPages(Math.ceil(facultadesData.count / 30));
    } catch (error) {
      setError(error.message); // Set error message
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, API]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteFacultad = (pk) => {
    deleteEntity(
      `${API}/api/facultad/delete`,
      pk,
      setFacultades,
      "facultadCodigo"
    );
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Facultad</h1>
      {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/facultad">
          Nuevo Facultad
        </Link>
        {facultades.length > 0 && (
          <Link className="btn btn-success" href={`${API}/export/facultad`}>
            Exportar
          </Link>
        )}
        <button
          type="button"
          className="btn btn-warning"
          data-bs-toggle="modal"
          data-bs-target="#Modal"
        >
          Importar
        </button>
      </div>

      <Modal title="Importar Facultad">
        <ImportExcel importURL={Api_import_URL} onSuccess={fetchData} />
      </Modal>

      <Search
        SearchSubmit={handleSearchSubmit}
        SearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

      <Tables>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Estado</th>
            <th scope="col">Universidad</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {facultades.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No faculties found.
              </td>
            </tr>
          )}
          {facultades.map((facultad, index) => (
            <tr key={facultad.facultadCodigo}>
              <th scope="row">{index + 1}</th>
              <td>{facultad.nombre}</td>
              <td>{facultad.estado}</td>
              <td>{facultad.universidadNombre}</td>
              <td>
                <Link
                  className="btn btn-primary btn-sm"
                  href={`/facultadEdit/${facultad.facultadCodigo}`}
                >
                  <Image src="/edit.svg" alt="editar" width={20} height={20} />
                </Link>
                <button
                  className="btn btn-danger btn-sm mx-2"
                  onClick={() => deleteFacultad(facultad.facultadCodigo)}
                  aria-label={`Delete ${facultad.nombre}`} // Accessibility label
                >
                  <Image src="/delete.svg" alt="borrar" width={20} height={20} />
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

export default withAuth(FacultadList);

