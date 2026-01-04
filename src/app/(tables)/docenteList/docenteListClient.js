"use client";

import React, { useState, useRef, useMemo, useEffect, use } from "react";
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
import { fetchDocentes } from "@api/docenteService";
import { exportDocentesToPDF } from "@utils/ExportPDF/exportDocentePDF";
import { deleteEntity } from "@utils/delete";
import Styles from "@styles/table.module.css";

function DocenteListClient() {
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
    }, 300)
  );

  useEffect(() => {
    return () => {
      debouncedSearch.current.cancel();
    };
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["docentes", { page, searchQuery, pageSize }],
    queryFn: () => fetchDocentes(page, searchQuery, pageSize),
    keepPreviousData: true,
  });

  const mutationDelete = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/docente/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries(["docentes"]);
    },
  });

  const handleDeleteDocente = (pk) => {
    if (confirm("¿Está seguro de eliminar este docente?")) {
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

  const docentes = data?.results || [];
  const totalPages = data?.totalPages || 1;

  const columns = useMemo(
    () => [
      { header: "Código", accessorKey: "DocenteCodigo" },
      { header: "Nombre", accessorKey: "DocenteNombre" },
      { header: "Apellido", accessorKey: "DocenteApellido" },
      { header: "Sexo", accessorKey: "DocenteSexo" },
      { header: "Estado Civil", accessorKey: "DocenteEstadoCivil" },
      { header: "Nacimiento", accessorKey: "DocenteFechaNacimiento" },
      { header: "Fec. Ingreso", accessorKey: "DocenteFechaIngreso" },
      { header: "Nacionalidad", accessorKey: "DocenteNacionalidad" },
      {header: "Direccion", accessorKey: "DocenteDireccion"},
      { header: "Teléfono", accessorKey: "DocenteTelefono" },
      { header: "Celular", accessorKey: "DocenteCelular" },
      { header: "Correo", accessorKey: "DocenteCorreoElectronico" },
      { header: "Estado", accessorKey: "DocenteEstado" },
      { header: "Universidad", accessorKey: "universidadNombre" },
      { header: "Tipo", accessorKey: "tipoDocenteNombre" },
      { header: "Categoría", accessorKey: "categoriaDocenteNombre" },

      ...(user?.groups[0] === "admin" || user?.groups[0] === "usuario"
        ? [
            {
              header: "Acción",
              id: "actions",
              cell: ({ row }) => (
                <div className="d-flex gap-2">
                  <Link
                    href={`/docenteEdit/${row.original.DocenteCodigo}`}
                    className="btn btn-primary btn-sm"
                  >
                    Editar
                  </Link>
                  {user?.groups[0] === "admin" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleDeleteDocente(row.original.DocenteID)
                      }
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
    data: docentes,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={`${Styles.containerScale}`}>
      <h1 className="text-dark">Lista de Docentes</h1>

      {isError && (
        <div className="alert alert-danger">Error al cargar los docentes.</div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3 flex-wrap">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          {(user?.groups[0] === "admin" || user?.groups[0] === "usuario") && (
            <Link className="btn btn-primary" href="/docente">
              Agregar Docente
            </Link>
          )}

          <Link
            className={`btn btn-success`}
            href={`${API}export/docente`}
            tabIndex={docentes.length === 0 ? -1 : 0}
            aria-disabled={docentes.length === 0}
          >
            Exportar Excel
          </Link>

          <button
            className={`btn btn-danger ${
              docentes.length === 0 ? "disabled" : ""
            }`}
            onClick={() => exportDocentesToPDF(docentes, page, pageSize)}
            disabled={docentes.length === 0}
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

      <Modal title="Importar Docente">
        <ImportExcel
          importURL={`${API}import/docente`}
          onSuccess={() => queryClient.invalidateQueries(["docentes"])}
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
                    asc: "▲",
                    desc: " ▼",
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
          ) : docentes.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No se encontraron docentes.
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

export default withAuth(DocenteListClient);
