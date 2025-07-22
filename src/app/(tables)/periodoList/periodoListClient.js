"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useAuth } from "@contexts/AuthContext";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Modal from "@components/Modal";
import Search from "@components/search";
import Spinner from "@components/Spinner";
import Periodo from "@components/forms/Periodo";

import withAuth from "@utils/withAuth";
import { fetchPeriodos } from "@api/periodoService";
import { deleteEntity } from "@utils/delete";

function PeriodoListClient({ initialData, totalPages: initialTotalPages }) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState([]);

  const { user } = useAuth();
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const queryClient = useQueryClient();

  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
    }, 300)
  ).current;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["periodos", { page, searchQuery, pageSize }],
    queryFn: () => fetchPeriodos(page, searchQuery, pageSize),
    keepPreviousData: true,
    initialData: () => ({
      results: initialData || [],
      totalPages: initialTotalPages || 1,
    }),
  });

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

  const columns = useMemo(
    () => [
      {
        header: "#",
        id: "index",
        cell: ({ row }) => row.index + 1 + (page - 1) * pageSize,
      },
      { header: "Código", accessorKey: "PeriodoCodigo" },
      { header: "Nombre", accessorKey: "PeriodoNombre" },
      { header: "Tipo", accessorKey: "PeriodoTipo" },
      { header: "Año", accessorKey: "PeriodoAnio" },
      { header: "Inicio", accessorKey: "PeriodoFechaInicio" },
      { header: "Fin", accessorKey: "PeriodoFechaFin" },
      { header: "Estado", accessorKey: "PeriodoEstado" },
      {
        header: "Universidad",
        accessorKey: "universidadNombre",
        cell: ({ row }) => row.original.universidadNombre || "—",
      },
      {
        header: "Acción",
        id: "actions",
        cell: ({ row }) => (
          <>
            <Link
              className="btn btn-primary btn-sm"
              href={`/periodoEdit/${row.original.PeriodoCodigo}`}
            >
              editar
            </Link>
            {user?.groups[0] === "admin" && (
              <button
                className="btn btn-danger btn-sm mx-2"
                onClick={() => handleDeletePeriodo(row.original.PeriodoID)}
                disabled={mutationDelete.isLoading}
              >
                borrar
              </button>
            )}
          </>
        ),
      },
    ],
    [page, pageSize, mutationDelete.isLoading]
  );

  const table = useReactTable({
    data: periodos,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
            <option value={75}>75</option>
            <option value={100}>100</option>
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
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={10} className="text-center"><Spinner /></td>
            </tr>
          ) : periodos.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center">
                No se encontraron periodos académicos.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
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
