"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import Modal from "@components/Modal";
import Periodo from "@components/forms/Periodo";

import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchPeriodos } from "@api/periodoService";

function PeriodoListClient({ initialData, totalPages: initialTotalPages }) {
  const [periodos, setPeriodos] = useState(initialData);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const deletePeriodo = (pk) => {
    deleteEntity(`${API}api/periodoacademico/delete`, pk, setPeriodos, "PeriodoID");
  };

  const fetchData = async (pageNum, query, size) => {
    setLoading(true);
    try {
      const { results, totalPages } = await fetchPeriodos(pageNum, query, size);
      setPeriodos(results);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error al obtener periodos:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = useCallback(
    debounce((pageNum, query, size) => {
      fetchData(pageNum, query, size);
    }, 400),
    []
  );

  // useEffect para buscar y paginar con debounce
  useEffect(() => {
    debouncedFetchData(page, searchQuery, pageSize);
    return () => debouncedFetchData.cancel();
  }, [page, searchQuery, pageSize, debouncedFetchData]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData(1, searchQuery, pageSize);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // No hace falta fetchData aquí porque useEffect con debounce lo hace
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setPage(1);
    // No hace falta llamar fetchData explícitamente por useEffect
  };

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Periodo Académico</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#Modal"
          >
            Nuevo Periodo Académico
          </button>
          {periodos.length > 0 && (
            <Link className="btn btn-success" href={`${API}export/periodoAcademico`}>
              Exportar
            </Link>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold mb-0 text-black">Resultados por página:</label>
          <select
            className="form-select w-auto"
            style={{ height: "38px" }}
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <Modal title="Nuevo Periodo Académico">
        <Periodo
          title="Registrar Periodo"
          onSuccess={async () => {
            await fetchData(page, searchQuery, pageSize);
          }}
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
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Año</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="10" className="text-center">
                Cargando...
              </td>
            </tr>
          ) : periodos.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">
                No se encontraron periodos académicos.
              </td>
            </tr>
          ) : (
            periodos.map((periodo, index) => (
              <tr key={periodo.PeriodoID}>
                <td>{index + 1 + (page - 1) * pageSize}</td>
                <td>{periodo.PeriodoCodigo}</td>
                <td>{periodo.PeriodoNombre}</td>
                <td>{periodo.PeriodoTipo}</td>
                <td>{periodo.PeriodoAnio}</td>
                <td>{periodo.PeriodoFechaInicio}</td>
                <td>{periodo.PeriodoFechaFin}</td>
                <td>{periodo.PeriodoEstado}</td>
                <td>{periodo.universidadNombre || "—"}</td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/periodoEdit/${periodo.PeriodoID}`}
                  >
                    editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deletePeriodo(periodo.PeriodoID)}
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
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}

export default withAuth(PeriodoListClient);

