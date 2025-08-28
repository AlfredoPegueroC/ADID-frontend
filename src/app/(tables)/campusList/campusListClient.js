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

import { fetchCampus } from "@api/campusService";
import { exportCampusToPDF } from "@utils/ExportPDF/exportCampusPDF";

function CampusListClient() {
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
      // setPage(1); // reset page on search change
    }, 500)
  );

  useEffect(() => {
    return () => {
      debouncedSearch.current.cancel();
    };
  }, []);

  // Traemos datos sin incluir sorting porque el ordenamiento será local (frontend)
  const { data, isLoading } = useQuery({
    queryKey: ["campus", { page, searchQuery, pageSize }],
    queryFn: () => fetchCampus(page, searchQuery, pageSize, token),
    keepPreviousData: true,
  });

  const mutationDelete = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/campus/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries(["campus"]);
    },
  });

  const handleDeleteCampus = (pk) => {
    if (confirm("¿Está seguro de eliminar este campus?")) {
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

  const campusList = data?.results || [];
  const totalPages = data?.totalPages || 1;

  const columns = useMemo(
    () => [
      { header: "Código", accessorKey: "CampusCodigo" },
      { header: "Nombre", accessorKey: "CampusNombre" },
      { header: "Dirección", accessorKey: "CampusDireccion" },
      { header: "Ciudad", accessorKey: "CampusCiudad" },
      { header: "Provincia", accessorKey: "CampusProvincia" },
      { header: "País", accessorKey: "CampusPais" },
      { header: "Teléfono", accessorKey: "CampusTelefono" },
      { header: "Universidad", accessorKey: "universidadNombre" },
      { header: "Correo", accessorKey: "CampusCorreoContacto" },
      { header: "Estado", accessorKey: "CampusEstado" },
      ...(user?.groups[0] === "admin" || user?.groups[0] === "usuario"
        ? [
            {
              header: "Acción",
              id: "actions",
              cell: ({ row }) => (
                <div className="d-flex">
                  <Link
                    href={`/campusEdit/${row.original.CampusCodigo}`}
                    className="btn btn-primary btn-sm"
                  >
                    Editar
                  </Link>

                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => handleDeleteCampus(row.original.CampusID)}
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


// ...(user?.groups[0] === "admin" || user?.groups[0] === "usuario" ? [] : [])

  const table = useReactTable({
    data: campusList,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Campus</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3 flex-wrap">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          {(user?.groups[0] === "admin" || user?.groups[0] === "usuario") && (
            <Link className="btn btn-primary" href="/campus">
              Nuevo Campus
            </Link>
          )}
          <Link
            className={`btn btn-success`}
            href={`${API}export/campus`}
            tabIndex={campusList.length === 0 ? -1 : 0}
            aria-disabled={campusList.length === 0}
          >
            Exportar Excel
          </Link>
          <button
            className={`btn btn-danger ${
              campusList.length === 0 ? "disabled" : ""
            }`}
            onClick={() => exportCampusToPDF(campusList, page, pageSize)}
            disabled={campusList.length === 0}
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

      <Modal title="Importar Campus">
        <ImportExcel
          importURL={`${API}import/campus`}
          onSuccess={() => queryClient.invalidateQueries(["campus"])}
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
          ) : campusList.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No se encontraron campus.
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

export default withAuth(CampusListClient);
