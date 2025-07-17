"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Modal from "@components/Modal";
import Search from "@components/search";
import Periodo from "@components/forms/Periodo";

import withAuth from "@utils/withAuth";
import { fetchPeriodos } from "@api/periodoService";
import { deleteEntity } from "@utils/delete";

function PeriodoListClient({ initialData, totalPages: initialTotalPages }) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const queryClient = useQueryClient();

  // Debounce para búsqueda
  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
      // setPage(1);
    }, 300)
  ).current;

  // Consulta para obtener periodos
  const { data, isLoading, isError } = useQuery({
    queryKey: ["periodos", { page, searchQuery, pageSize }],
    queryFn: () => fetchPeriodos(page, searchQuery, pageSize),
    keepPreviousData: true,
    initialData: () => ({
      results: initialData || [],
      totalPages: initialTotalPages || 1,
    }),
  });

  // Mutación para borrar periodo
  const mutationDelete = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/periodoacademico/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodos"] });
    },
  });

  const handleDeletePeriodo = (pk) => {
    mutationDelete.mutate(pk);
  };

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const periodos = data?.results || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Periodo Académico</h1>

      {isError && (
        <div className="alert alert-danger">Error al cargar los periodos.</div>
      )}

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

          <Link
            className="btn btn-success"
            href={`${API}export/periodoAcademico`}
          >
            Exportar Excel
          </Link>

          <Search
            SearchSubmit={handleSearchSubmit}
            SearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold mb-0 text-black">
            Resultados por página:
          </label>
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
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["periodos"] })}
        />
      </Modal>

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
        {isLoading ? (
          <tbody>
            <tr>
              <td colSpan={10} className="text-center">
                Cargando...
              </td>
            </tr>
          </tbody>
        ) : periodos.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={10} className="text-center">
                No se encontraron periodos académicos.
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {periodos.map((periodo, index) => (
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
                    href={`/periodoEdit/${periodo.PeriodoCodigo}`}
                  >
                    editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => handleDeletePeriodo(periodo.PeriodoID)}
                    disabled={mutationDelete.isLoading}
                  >
                    borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </Tables>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default withAuth(PeriodoListClient);
