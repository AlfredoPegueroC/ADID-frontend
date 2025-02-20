"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import ImportExcel from "@components/forms/Import";
import Modal from "@components/Modal";
import Search from "@components/search";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { debounce } from "lodash"; // Import debounce from lodash

function EscuelaList() {
  const [escuelas, setEscuelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null); // Error state

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const Api_import_URL = `${API}/import/escuela`;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

      const [escuelaResponse, facultadResponse, universidadResponse] = await Promise.all([
        fetch(`${API}/api/escuela?page=${page}${searchParam}`),
        fetch(`${API}/api/facultad`),
        fetch(`${API}/api/universidad`),
      ]);

      if (!escuelaResponse.ok) throw new Error("Failed to fetch escuelas");
      if (!facultadResponse.ok) throw new Error("Failed to fetch facultades");
      if (!universidadResponse.ok) throw new Error("Failed to fetch universidades");

      const escuelaData = await escuelaResponse.json();
      const facultadData = await facultadResponse.json();
      const universidadData = await universidadResponse.json();

      const mergedData = escuelaData.results.map((escuela) => {
        const facultad = facultadData.results.find(
          (fac) => fac.facultadCodigo === escuela.facultadCodigo
        ) || { nombre: "Facultad no encontrada" };

        const universidad = universidadData.results.find(
          (uni) => uni.UniversidadCodigo === escuela.UniversidadCodigo
        ) || { nombre: "Universidad no encontrada" };

        return {
          ...escuela,
          facultadNombre: facultad.nombre,
          universidadNombre: universidad.nombre,
        };
      });

      setEscuelas(mergedData);
      setTotalPages(Math.ceil(escuelaData.count / 30));
    } catch (error) {
      setError(error.message); // Set error message
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [API, page, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteEscuela = (pk) => {
    deleteEntity(`${API}/api/escuela/delete`, pk, setEscuelas, "escuelaCodigo");
  };

  const handleSearchChange = debounce((e) => {
    setSearchQuery(e.target.value);
  }, 300); // Debounce search input

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
    <div className="mt-5">
      <h1 className="text-dark">Lista Escuela</h1>
      {error && <div className="alert alert-danger">{error}</div>} {/* Error message display */}
      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/escuela">
          Nuevo Escuela
        </Link>
        {escuelas.length > 0 && (
          <Link className="btn btn-success" href={`${API}/export/escuela`}>
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
      <Modal title="Importar Escuela">
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
            <th scope="col">Facultad</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {escuelas.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No escuelas found.
              </td>
            </tr>
          ) : (
            escuelas.map((escuela, index) => (
              <tr key={escuela.escuelaCodigo}>
                <th scope="row">{index + 1}</th>
                <td>{escuela.nombre}</td>
                <td>{escuela.estado}</td>
                <td>{escuela.universidadNombre}</td>
                <td>{escuela.facultadNombre}</td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/escuelaEdit/${escuela.escuelaCodigo}`}
                  >
                    <Image src="/edit.svg" alt="editar" width={20} height={20} />
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deleteEscuela(escuela.escuelaCodigo)}
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
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

export default withAuth(EscuelaList);
