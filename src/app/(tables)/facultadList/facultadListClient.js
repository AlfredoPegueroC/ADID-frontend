"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { debounce } from "lodash";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import ImportExcel from "@components/forms/Import";
import Modal from "@components/Modal";
import Spinner from "@components/Spinner";

import withAuth from "@utils/withAuth";
import { fetchFacultades } from "@api/facultadService";
import { deleteEntity } from "@utils/delete";
import { exportFacultadesToPDF } from "@utils/ExportPDF/exportFacultadPDF";

function FacultadListClient() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState([]);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  const queryClient = useQueryClient();

  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
      // setPage(1);
    }, 500)
  );

  useEffect(() => {
    return () => {
      debouncedSearch.current.cancel();
    };
  }, []);

  // Aquí NO incluimos sorting en queryKey ni en queryFn para que no recargue al ordenar
  const { data, isLoading } = useQuery({
    queryKey: ["facultades", { page, searchQuery, pageSize }],
    queryFn: () => fetchFacultades(page, searchQuery, pageSize, token),
    keepPreviousData: true,
  });

  const mutationDelete = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/facultad/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries(["facultades"]);
    },
  });

  const handleDeleteFacultad = (pk) => {
    if (confirm("¿Está seguro de que desea eliminar esta facultad?")) {
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

  const facultades = data?.results || [];
  const totalPages = data?.totalPages || 1;

  const columns = useMemo(
    () => [
      { header: "Código", accessorKey: "FacultadCodigo" },
      { header: "Nombre", accessorKey: "FacultadNombre" },
      { header: "Decano", accessorKey: "FacultadDecano" },
      { header: "Teléfono", accessorKey: "FacultadTelefono" },
      { header: "Dirección", accessorKey: "FacultadDireccion" },
      { header: "Correo", accessorKey: "FacultadEmail" },
      { header: "Estado", accessorKey: "FacultadEstado" },
      { header: "Universidad", accessorKey: "universidadNombre" },
      { header: "Campus", accessorKey: "campusNombre" },
      {
        header: "Acción",
        id: "actions",
        cell: ({ row }) => (
          <div className="d-flex">
            <Link
              href={`/facultadEdit/${row.original.FacultadCodigo}`}
              className="btn btn-primary btn-sm"
            >
              Editar
            </Link>
            <button
              className="btn btn-danger btn-sm mx-2"
              onClick={() => handleDeleteFacultad(row.original.FacultadID)}
              disabled={mutationDelete.isLoading}
            >
              borrar
            </button>
          </div>
        ),
      },
    ],
    [mutationDelete.isLoading]
  );

  const table = useReactTable({
    data: facultades,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Facultades</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3 flex-wrap">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <Link className="btn btn-primary" href="/facultad">
            Nueva Facultad
          </Link>

          <Link
            className={`btn btn-success ${facultades.length === 0 ? "disabled" : ""}`}
            href={`${API}export/facultad`}
            tabIndex={facultades.length === 0 ? -1 : 0}
            aria-disabled={facultades.length === 0}
          >
            Exportar Excel
          </Link>

          <button
            className={`btn btn-danger ${facultades.length === 0 ? "disabled" : ""}`}
            onClick={() => exportFacultadesToPDF(facultades, page, pageSize)}
            disabled={facultades.length === 0}
          >
            Exportar PDF
          </button>

          <button
            type="button"
            className="btn btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#Modal"
          >
            Importar Excel
          </button>

          <Search
            SearchSubmit={handleSearchSubmit}
            SearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
        </div>

        <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
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

      <Modal title="Importar Facultad">
        <ImportExcel
          importURL={`${API}import/facultad`}
          onSuccess={() => queryClient.invalidateQueries(["facultades"])}
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
              <td colSpan={columns.length} className="text-center">
                <Spinner />
              </td>
            </tr>
          ) : facultades.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No se han encontrado facultades.
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
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

export default withAuth(FacultadListClient);
