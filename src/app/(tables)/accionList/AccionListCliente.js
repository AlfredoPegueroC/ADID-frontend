"use client";

import React, { useState, useRef, useMemo } from "react";
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

import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import Search from "@components/search";
import Tables from "@components/Tables";
import Pagination from "@components/Pagination";
import Spinner from "@components/Spinner";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

// Ajusta estos imports a tus rutas reales
import { fetchAcciones } from "@api/accionesService";
// import { exportAccionToPDF } from "@utils/ExportPDF/exportAccionPDF";

function AccionListClient() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState([]);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const debouncedSearch = useRef(
    debounce((value) => setSearchQuery(value), 400)
  ).current;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["acciones", { page, searchQuery, pageSize }],
    queryFn: () => fetchAcciones(page, searchQuery, pageSize),
    keepPreviousData: true,
  });

  const mutationDelete = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/accion/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["acciones"] });
    },
  });

  const handleDelete = (pk) => mutationDelete.mutate(pk);

  const handleSearchChange = (e) => debouncedSearch(e.target.value);
  const handleSearchSubmit = (e) => e.preventDefault();

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const items = data?.results || [];
  const totalPages = data?.totalPages || 1;

  const columns = useMemo(
    () => [
      { header: "Código", accessorKey: "AccionCodigo" },
      { header: "Nombre", accessorKey: "AccionNombre" },
      // { header: "Estado", accessorKey: "AccionEstado" },
      { header: "Universidad", accessorKey: "universidadNombre" },
      ...(user?.groups?.[0] === "admin" || user?.groups?.[0] === "usuario"
        ? [
            {
              header: "Acción",
              id: "actions",
              cell: ({ row }) => (
                <div className="d-flex">
                  <Link
                    href={`/accionEdit/${row.original.AccionCodigo}`}
                    className="btn btn-primary btn-sm"
                  >
                    editar
                  </Link>
                  {user?.groups?.[0] === "admin" && (
                    <button
                      className="btn btn-danger btn-sm mx-2"
                      onClick={() => handleDelete(row.original.AccionID)}
                    >
                      borrar
                    </button>
                  )}
                </div>
              ),
            },
          ]
        : []),
    ],
    [user]
  );

  const table = useReactTable({
    data: items,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Acciones</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2 flex-wrap">
          {(user?.groups?.[0] === "admin" || user?.groups?.[0] === "usuario") && (
            <Link className="btn btn-primary" href="/accion">
              Nueva Acción
            </Link>
          )}

          {/* <Link className="btn btn-success" href={`${API}export/accion`}>
            Exportar Excel
          </Link> */}

          {/* <button
            className={`btn btn-danger ${items.length === 0 ? "disabled" : ""}`}
            onClick={() => exportAccionToPDF(items, page, pageSize)}
          >
            Exportar PDF
          </button> */}

          {/* {(user?.groups?.[0] === "admin" || user?.groups?.[0] === "usuario") && (
            <button
              type="button"
              className="btn btn-warning"
              data-bs-toggle="modal"
              data-bs-target="#Modal"
            >
              Importar Excel
            </button>
          )} */}

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
            <option value={75}>75</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <Modal title="Importar Acciones">
        <ImportExcel
          importURL={`${API}import/accion`}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["acciones"] })
          }
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
              <td colSpan={6} className="text-center">
                <Spinner />
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={6} className="text-center">
                Ocurrió un error al cargar los datos.
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                No se encontraron registros.
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

export default withAuth(AccionListClient);
