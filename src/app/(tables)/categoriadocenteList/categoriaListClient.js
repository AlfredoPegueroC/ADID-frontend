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
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import Search from "@components/search";
import Tables from "@components/Tables";
import Pagination from "@components/Pagination";
import Spinner from "@components/Spinner";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { exportCategoriasToPDF } from "@utils/ExportPDF/exportCategoriaPDF";
import { fetchCategorias } from "@api/categoriaService";

function CategoriaListClient() {
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
      // setPage(1);
    }, 400)
  );

  useEffect(() => {
    return () => {
      debouncedSearch.current.cancel();
    };
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["categorias", { page, searchQuery, pageSize }],
    queryFn: () => fetchCategorias(page, searchQuery, pageSize),
    keepPreviousData: true,
  });

  const mutationDelete = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/categoriadocente/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries(["categorias"]);
    },
  });

  const handleDeleteCategoria = (pk) => {
    if (confirm("¿Está seguro de eliminar esta categoría?")) {
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
    // setPage(1);
  };

  const categorias = data?.results || [];
  const totalPages = data?.totalPages || 1;

  const columns = useMemo(
    () => [
      { header: "Código", accessorKey: "categoriaCodigo" },
      { header: "Nombre", accessorKey: "CategoriaNombre" },
      { header: "Estado", accessorKey: "CategoriaEstado" },
      { header: "Universidad", accessorKey: "universidadNombre" },

      ...(user?.groups[0] === "admin" || user?.groups[0] === "usuario"
        ? [
            {
              header: "Acción",
              id: "actions",
              cell: ({ row }) => (
                <div className="d-flex gap-2">
                  <Link
                    href={`/categoriaEdit/${row.original.categoriaCodigo}`}
                    className="btn btn-primary btn-sm"
                  >
                    Editar
                  </Link>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      handleDeleteCategoria(row.original.CategoriaID)
                    }
                    disabled={mutationDelete.isLoading}
                  >
                    Borrar
                  </button>
                </div>
              ),
            },
          ]
        : []),
    ],
    [mutationDelete.isLoading]
  );

  const table = useReactTable({
    data: categorias,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Categorías de Docente</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3 flex-wrap">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          {(user?.groups[0] === "admin" || user?.groups[0] === "usuario") && (
            <Link className="btn btn-primary" href="/categoriadocente">
              Nueva Categoría
            </Link>
          )}

          <Link
            className={`btn btn-success`}
            href={`${API}export/categoriaDocente`}
            tabIndex={categorias.length === 0 ? -1 : 0}
            aria-disabled={categorias.length === 0}
          >
            Exportar Excel
          </Link>

          <button
            className={`btn btn-danger ${
              categorias.length === 0 ? "disabled" : ""
            }`}
            onClick={() => exportCategoriasToPDF(categorias, page, pageSize)}
            disabled={categorias.length === 0}
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

      <Modal title="Importar Categoría">
        <ImportExcel
          importURL={`${API}import/categoriaDocente`}
          onSuccess={() => queryClient.invalidateQueries(["categorias"])}
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
              <td colSpan={columns.length} className="text-center">
                <Spinner />
              </td>
            </tr>
          ) : categorias.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No se encontraron categorías.
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

export default withAuth(CategoriaListClient);
