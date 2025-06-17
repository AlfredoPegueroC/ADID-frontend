"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import ImportExcel from "@components/forms/Import";
import Modal from "@components/Modal";
import Search from "@components/search";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { debounce } from "lodash";
import { fetchEscuelas } from "@api/escuelaService";
import { exportEscuelasToPDF } from "@utils/ExportPDF/exportEscuelaPDF";

function EscuelaListClient() {
  const [escuelas, setEscuelas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const Api_import_URL = `${API}import/escuela`;

  const fetchData = async (page, query, size) => {
    setLoading(true);
    setError(null);
    try {
      const { results, totalPages } = await fetchEscuelas(page,query, size);
      setEscuelas(results);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = useCallback(
    debounce(() => {
      fetchData(page, searchQuery, pageSize);
    }, 300),
    [page, searchQuery, pageSize]
  );

  useEffect(() => {
    debouncedFetchData();
    return () => debouncedFetchData.cancel();
  }, [debouncedFetchData]);

  const deleteEscuela = (pk) => {
    deleteEntity(`${API}api/escuela/delete`, pk, setEscuelas, "EscuelaCodigo");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Escuelas</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/escuela">
            Nueva Escuela
          </Link>
          {escuelas.length > 0 && (
            <>
              <Link className="btn btn-success" href={`${API}export/escuela`}>
                Exportar
              </Link>
              <button
                className="btn btn-danger"
                onClick={() =>
                  exportEscuelasToPDF(escuelas, page, pageSize)
                }
              >
                Exportar PDF
              </button>
            </>
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

        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold mb-0 text-black">
            Resultados por página:
          </label>
          <select
            className="form-select w-auto"
            style={{ height: "38px" }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <Modal title="Importar Escuela">
        <ImportExcel importURL={Api_import_URL} onSuccess={debouncedFetchData} />
      </Modal>

      <Search
        SearchSubmit={handleSearchSubmit}
        SearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <Tables>
          <thead>
            <tr>
              <th>#</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Directora</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Universidad</th>
              <th>Facultad</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {escuelas.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">
                  No se han encontrado escuelas.
                </td>
              </tr>
            ) : (
              escuelas.map((escuela, index) => (
                <tr key={escuela.EscuelaCodigo}>
                  <th scope="row">{index + 1 + (page - 1) * pageSize}</th>
                  <td>{escuela.EscuelaCodigo}</td>
                  <td>{escuela.EscuelaNombre}</td>
                  <td>{escuela.EscuelaDirectora}</td>
                  <td>{escuela.EscuelaTelefono}</td>
                  <td>{escuela.EscuelaCorreo}</td>
                  <td>{escuela.EscuelaEstado}</td>
                  <td>{escuela.universidadNombre || "—"}</td>
                  <td>{escuela.facultadNombre || "—"}</td>
                  <td>
                    <Link
                      className="btn btn-primary btn-sm"
                      href={`/escuelaEdit/${escuela.EscuelaId}`}
                    >
                      Editar
                    </Link>
                    <button
                      className="btn btn-danger btn-sm mx-2"
                      onClick={() => deleteEscuela(escuela.EscuelaId)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Tables>
      )}

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

export default withAuth(EscuelaListClient);

