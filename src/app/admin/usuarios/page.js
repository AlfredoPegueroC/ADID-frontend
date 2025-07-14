"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import { useMemo, useState, useEffect } from "react";
import Tables from "@components/Tables";
import Pagination from "@components/Pagination";
import Notification from "@components/Notification";

export default function UsuarioPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_KEY}api/usuarios`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const usuarios = await res.json();

        const formateados = usuarios.results.map((user) => ({
          id: user.id,
          username: user.username,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.groups.includes("admin") ? "Admin" : "User",
          is_active: user.is_active,
        }));

        setData(formateados);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "username", header: () => "Usuario" },
      { accessorKey: "name", header: () => "Nombre" },
      { accessorKey: "email", header: () => "Email" },
      { accessorKey: "role", header: () => "Rol" },
      {
        accessorKey: "is_active",
        header: () => "Estado",
        cell: ({ row }) => {
          const { username, is_active } = row.original;

          const handleEstadoChange = async (e) => {
            const nuevoEstado = e.target.value === "true";

            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_KEY}api/usuarios/${row.original.id}/`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                  },
                  body: JSON.stringify({ is_active: nuevoEstado }),
                }
              );

              if (res.ok) {
                Notification.alertLogin(`Estado actualizado para ${username}`);
                setData((prev) =>
                  prev.map((user) =>
                    user.id === row.original.id
                      ? { ...user, is_active: nuevoEstado }
                      : user
                  )
                );
              } else {
                Notification.alertError(
                  `Error al actualizar estado de ${username}`
                );
              }
            } catch (error) {
              console.error(error);
              Notification.alertError("Error de red al cambiar estado");
            }
          };

          return (
            <select
              className="form-select form-select-sm"
              value={is_active.toString()}
              onChange={handleEstadoChange}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          );
        },
      },
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize]);

  if (loading)
    return <div className="text-center mt-5">Cargando usuarios...</div>;

  return (
    <div>
      <h2 className="mb-4">Usuarios Registrados</h2>

      {/* Filtro global y selector página */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <input
          type="text"
          placeholder="Buscar en todos los campos..."
          className="form-control"
          style={{ maxWidth: "300px" }}
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold mb-0 text-black">
            Resultados por página:
          </label>
          <select
            className="form-select w-auto"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <Tables>
          <thead className="table-light">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: "pointer" }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc"
                      ? " 🔼"
                      : header.column.getIsSorted() === "desc"
                      ? " 🔽"
                      : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Tables>
      </div>

      {/* Paginación */}
      {table.getPageCount() > 1 && (
        <Pagination
          page={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(newPage) => table.setPageIndex(newPage - 1)}
        />
      )}
    </div>
  );
}
