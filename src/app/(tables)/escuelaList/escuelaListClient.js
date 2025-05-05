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
import { debounce } from "lodash";
import { fetchEscuelas } from "@api/escuelaService";

function EscuelaListClient() {
  const [escuelas, setEscuelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const Api_import_URL = `${API}import/escuela`;

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const { results, totalPages } = await fetchEscuelas(searchQuery, page);
      setEscuelas(results);
      setTotalPages(totalPages);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteEscuela = (pk) => {
    deleteEntity(`${API}api/escuela/delete`, pk, setEscuelas, "EscuelaCodigo");
  };

  const handleSearchChange = debounce((e) => {
    setSearchQuery(e.target.value);
  }, 300);

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
      <h1 className="text-dark">Lista de Escuelas</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/escuela">
          Nueva Escuela
        </Link>
        {escuelas.length > 0 && (
          <Link className="btn btn-success" href={`${API}export/escuela`}>
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
            <th scope="col">Código</th>
            <th scope="col">Nombre</th>
            <th scope="col">Directora</th>
            <th scope="col">Teléfono</th>
            <th scope="col">Estado</th>
            <th scope="col">Universidad</th>
            <th scope="col">Facultad</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {escuelas.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">
                No se han encontrado escuelas.
              </td>
            </tr>
          ) : (
            escuelas.map((escuela, index) => (
              <tr key={escuela.EscuelaCodigo}>
                <th scope="row">{index + 1}</th>
                <td>{escuela.EscuelaCodigo}</td>
                <td>{escuela.EscuelaNombre}</td>
                <td>{escuela.EscuelaDirectora}</td>
                <td>{escuela.EscuelaTelefono}</td>
                <td>{escuela.EscuelaEstado}</td>
                <td>{escuela.universidadNombre || "—"}</td>
                <td>{escuela.facultadNombre || "—"}</td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/escuelaEdit/${escuela.EscuelaId}`}
                  >
                    <Image src="/edit.svg" alt="editar" width={20} height={20} />
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deleteEscuela(escuela.EscuelaId)}
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

export default withAuth(EscuelaListClient);
