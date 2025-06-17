"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";

import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import Search from "@components/search";
import Tables from "@components/Tables";
import Pagination from "@components/Pagination";

import { exportTipoDocenteToPDF } from "@utils/ExportPDF/exportTipoPDF"
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchTipoDocentes } from "@api/tipoDocenteService";

function TipoDocenteListClient({ initialData, totalPages: initialTotalPages }) {
  const [tipos, setTipos] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const importURL = `${API}import/tipoDocente`;

  // Función para cargar datos
  const fetchTipoDocentesData = async (page, query, size) => {
    setLoading(true);
    try {
      const { results, totalPages } = await fetchTipoDocentes(page, query, size);
      setTipos(results);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error al obtener tipos de docente:", error);
    } finally {
      setLoading(false);
    }
  };

  // debounce para evitar llamadas rápidas
  const debouncedFetchTipos = useCallback(
    debounce((page, query, size) => {
      fetchTipoDocentesData(page, query, size);
    }, 400),
    []
  );

  // Carga datos al inicio y cuando cambian búsqueda, página o tamaño de página
  useEffect(() => {
    debouncedFetchTipos(currentPage, searchQuery, pageSize);
    return () => debouncedFetchTipos.cancel();
  }, [searchQuery, currentPage, pageSize, debouncedFetchTipos]);

  // Reset página cuando cambia búsqueda o tamaño de página
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  // Borrar tipo docente
  const deleteTipoDocente = (pk) => {
    deleteEntity(
      `${API}api/tipodocente/delete`,
      pk,
      setTipos,
      "TipoDocenteID"
    );
  };

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Tipos de Docente</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/tipodocente">
            Nuevo Tipo
          </Link>

          {tipos.length > 0 && (
            <>
              <Link
                className="btn btn-success"
                href={`${API}export/tipoDocente`}
              >
                Exportar
              </Link>

              <button
                className="btn btn-danger"
                onClick={() => exportTipoDocenteToPDF(tipos, currentPage, pageSize)}
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
          <label className="fw-bold mb-0 text-black">Resultados por página:</label>
          <select
            className="form-select w-auto"
            style={{ height: "38px" }}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <Modal title="Importar Tipo de Docente">
        <ImportExcel
          importURL={importURL}
          onSuccess={() => fetchTipoDocentesData(searchQuery, currentPage, pageSize)}
        />
      </Modal>

      <Search
        SearchSubmit={handleSearchSubmit}
        SearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

      <Tables>
        <thead>
          <tr>
            <th>#</th>
            <th>Código</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">
                Cargando...
              </td>
            </tr>
          ) : tipos.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No se encontraron tipos de docente.
              </td>
            </tr>
          ) : (
            tipos.map((tipo, index) => (
              <tr key={tipo.TipoDocenteID}>
                <th scope="row">{index + 1 + (currentPage - 1) * pageSize}</th>
                <td>{tipo.TipoDocenteCodigo}</td>
                <td>{tipo.TipoDocenteDescripcion}</td>
                <td>{tipo.TipoDocenteEstado}</td>
                <td>{tipo.universidadNombre || "—"}</td>
                <td>
                  <Link
                    href={`/tipodocenteEdit/${tipo.TipoDocenteID}`}
                    className="btn btn-primary btn-sm"
                  >
                    editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deleteTipoDocente(tipo.TipoDocenteID)}
                  >
                    borrar
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
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default withAuth(TipoDocenteListClient);
