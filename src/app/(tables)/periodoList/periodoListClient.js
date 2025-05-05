"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import Modal from "@components/Modal";

import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchPeriodos } from "@api/periodoService";
import Periodo from "@components/forms/Periodo";

function PeriodoListClient({ initialData, totalPages: initialTotalPages }) {
  const [periodos, setPeriodos] = useState(initialData);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
  const [searchQuery, setSearchQuery] = useState("");

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const deletePeriodo = (pk) => {
    deleteEntity(`${API}api/periodoacademico/delete`, pk, setPeriodos, "PeriodoCodigo");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const debouncedFetchData = debounce(async (query, pageNum) => {
    const { results, totalPages } = await fetchPeriodos(query, pageNum);
    setPeriodos(results);
    setTotalPages(totalPages);
  }, 300);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    debouncedFetchData(searchQuery, page);
  };

  useEffect(() => {
    debouncedFetchData(searchQuery, page);
    return () => debouncedFetchData.cancel();
  }, [searchQuery, page]);

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Periodo Académico</h1>

      <div className="d-flex gap-2 mb-3 mt-3">
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#Modal"
        >
          Nuevo Periodo Académico
        </button>
        {periodos.length > 0 && (
          <Link
            className="btn btn-success"
            href={`${API}export/periodoAcademico`}
          >
            Exportar
          </Link>
        )}
      </div>

      <Modal title="Nuevo Periodo Académico">
        <Periodo
          title="Registrar Periodo"
          onSuccess={async () => {
            const { results, totalPages } = await fetchPeriodos(searchQuery, page);
            setPeriodos(results);
            setTotalPages(totalPages);
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
          {periodos.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">
                No se encontraron periodos académicos.
              </td>
            </tr>
          ) : (
            periodos.map((periodo, index) => (
              <tr key={periodo.PeriodoCodigo}>
                <td>{index + 1 + (page - 1) * 30}</td>
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
                    <Image src="/edit.svg" alt="editar" width={20} height={20} />
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deletePeriodo(periodo.PeriodoID)}
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

export default withAuth(PeriodoListClient);
