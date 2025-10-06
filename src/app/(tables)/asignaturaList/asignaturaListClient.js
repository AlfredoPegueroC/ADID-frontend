"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { debounce } from "lodash";
import { useAuth } from "@contexts/AuthContext";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import Search from "@components/search";
import Spinner from "@components/Spinner";

import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

import { fetchAsignaturas } from "@api/asignaturaService";
import { exportAsignaturasToPDF } from "@utils/ExportPDF/exportAsignaturaPDF";

function AsignaturaListClient() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState([]);
  const { user } = useAuth();
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  const queryClient = useQueryClient();

  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
    }, 500)
  );

  useEffect(() => {
    return () => {
      debouncedSearch.current.cancel();
    };
  }, []);

  // Query asignaturas
  const { data, isLoading } = useQuery({
    queryKey: ["asignaturas", { page, searchQuery, pageSize }],
    queryFn: () => fetchAsignaturas(page, searchQuery, pageSize),
    keepPreviousData: true,
  });

  // Delete
  const mutationDelete = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/asignatura/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries(["asignaturas"]);
    },
  });

  const handleDeleteAsignatura = (pk) => {
    if (confirm("¿Está seguro de eliminar esta asignatura?")) {
      mutationDelete.mutate(pk);
    }
  };

  const handleSearchChange = (e) => {
    debouncedSearch.current(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const asignaturaList = data?.results || [];
  const totalPages = data?.totalPages || 1;

  const columns = useMemo(
    () => [
      { header: "Código", accessorKey: "AsignaturaCodigo" },
      { header: "Nombre", accessorKey: "AsignaturaNombre" },
      { header: "Créditos", accessorKey: "AsignaturaCreditos" },
      { header: "Horas Teóricas", accessorKey: "AsignaturaHorasTeoricas" },
      { header: "Horas Prácticas", accessorKey: "AsignaturaHorasPracticas" },
      { header: "Estado", accessorKey: "AsignaturaEstado" },
      { header: "Universidad", accessorKey: "universidadNombre" },
      { header: "Facultad", accessorKey: "facultadNombre" },
      { header: "Escuela", accessorKey: "escuelaNombre" },
      ...(user?.groups[0] === "admin" || user?.groups[0] === "usuario"
        ? [
            {
              header: "Acción",
              id: "actions",
              cell: ({ row }) => (
                <div className="d-flex">
                  <Link
                    href={`/asignaturaEdit/${row.original.AsignaturaCodigo}`}
                    className="btn btn-primary btn-sm"
                  >
                    Editar
                  </Link>
                  {user?.groups[0] === "admin" && (
                    <button
                      className="btn btn-danger btn-sm mx-2"
                      onClick={() => handleDeleteAsignatura(row.original.AsignaturaCodigo)}
                      disabled={mutationDelete.isLoading}
                    >
                      Borrar
                    </button>
                  )}
                </div>
              ),
            },
          ]
        : []),
    ],
    [mutationDelete.isLoading]
  );

  const table = useReactTable({
    data: asignaturaList,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Asignaturas</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3 flex-wrap">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          {(user?.groups[0] === "admin" || user?.groups[0] === "usuario") && (
            <Link className="btn btn-primary" href="/asignatura">
              Nueva Asignatura
            </Link>
          )}
          <Link
            className={`btn btn-success`}
            href={`${API}export/asignatura`}
            tabIndex={asignaturaList.length === 0 ? -1 : 0}
            aria-disabled={asignaturaList.length === 0}
          >
            Exportar Excel
          </Link>
          <button
            className={`btn btn-danger ${
              asignaturaList.length === 0 ? "disabled" : ""
            }`}
            onClick={() =>
              exportAsignaturasToPDF(asignaturaList, page, pageSize)
            }
            disabled={asignaturaList.length === 0}
          >
            Exportar PDF
          </button>

          {(user?.groups[0] === "admin" || user?.groups[0] === "usuario") && (
            <button
              type="button"
              className="btn btn-warning"
              data-bs-toggle="modal"
              data-bs-target="#Modal"
            >
              Importar Excel
            </button>
          )}

          <Search
            SearchSubmit={handleSearchSubmit}
            SearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
        </div>

        <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
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
            <option value={75}>75</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <Modal title="Importar Asignaturas">
        <ImportExcel
          importURL={`${API}import/asignatura`}
          onSuccess={() => queryClient.invalidateQueries(["asignaturas"])}
        />
      </Modal>

      <Tables className="table table-bordered">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
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
              <td colSpan={columns.length} className="text-center">
                <Spinner />
              </td>
            </tr>
          ) : asignaturaList.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No se encontraron asignaturas.
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
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export default withAuth(AsignaturaListClient);
