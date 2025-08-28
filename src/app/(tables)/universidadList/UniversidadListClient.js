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

import Pagination from "@components/Pagination";
import Search from "@components/search";
import Modal from "@components/Modal";
import Spinner from "@components/Spinner";
import ImportExcel from "@components/forms/Import";
import { exportUniversidadesToPDF } from "@utils/ExportPDF/exportUniversidadesToPDF";

import withAuth from "@utils/withAuth";
import { fetchUniversidades } from "@api/universidadService";
import { deleteEntity } from "@utils/delete";
import Tables from "@/src/components/Tables";

function UniversidadListClient() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState([]);

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
    }, 500)
  ).current;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["universidades", { page, searchQuery, pageSize }],
    queryFn: () => fetchUniversidades(page, searchQuery, pageSize, token),
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/universidad/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries(["universidades"]);
    },
  });

  const handleDelete = (pk) => {
    mutation.mutate(pk);
  };

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const universidades = data?.results || [];
  const totalPages = data?.totalPages || 1;

  const columns = useMemo(
    () => [
      { header: "Código", accessorKey: "UniversidadCodigo" },
      { header: "Nombre", accessorKey: "UniversidadNombre" },
      { header: "Dirección", accessorKey: "UniversidadDireccion" },
      { header: "Teléfono", accessorKey: "UniversidadTelefono" },
      { header: "Email", accessorKey: "UniversidadEmail" },
      {
        header: "Sitio Web",
        accessorKey: "UniversidadSitioWeb",
        cell: (info) => (
          <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
            {info.getValue()}
          </a>
        ),
      },
      { header: "Rector", accessorKey: "UniversidadRector" },
      { header: "Estado", accessorKey: "UniversidadEstado" },
      ...(user?.groups[0] === "admin" || user?.groups[0] === "usuario"
        ? [
            {
              header: "Acción",
              id: "actions",
              cell: ({ row }) => (
                <div className="d-flex">
                  <Link
                    href={`/universidadEdit/${row.original.UniversidadCodigo}`}
                    className="btn btn-primary btn-sm"
                  >
                    editar
                  </Link>

                  {user?.groups[0] === "admin" && (
                    <button
                      className="btn btn-danger btn-sm mx-2"
                      onClick={() => handleDelete(row.original.UniversidadID)}
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
    []
  );

  const table = useReactTable({
    data: universidades,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <h1 className="text-dark mt-5">Lista de Universidades</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2 flex-wrap">
          {(user?.groups[0] === "admin" || user?.groups[0] === "usuario") && (
            <Link className="btn btn-primary" href="/universidad">
              Nueva Universidad
            </Link>
          )}

          <Link className="btn btn-success" href={`${API}export/universidad`}>
            Exportar Excel
          </Link>
          <button
            className={`btn btn-danger ${
              universidades.length === 0 ? "disabled" : ""
            }`}
            onClick={() =>
              exportUniversidadesToPDF(universidades, page, pageSize)
            }
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
            SearchSubmit={(e) => e.preventDefault()}
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
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <Modal title="Importar Universidad">
        <ImportExcel
          importURL={`${API}import/universidad`}
          onSuccess={() => queryClient.invalidateQueries(["universidades"])}
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
              <td colSpan="10" className="text-center">
                <Spinner />
              </td>
            </tr>
          ) : universidades.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">
                No se encontraron universidades.
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

export default withAuth(UniversidadListClient);
