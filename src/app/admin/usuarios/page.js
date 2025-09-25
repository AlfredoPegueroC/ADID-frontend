"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";

import Tables from "@components/Tables";
import Pagination from "@components/Pagination";
import Notification from "@components/Notification";
import Spinner from "@components/Spinner";

export default function UsuarioPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState([]);

  const queryClient = useQueryClient();
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
      setPage(1);
    }, 500)
  ).current;

  const { data, isLoading } = useQuery({
    queryKey: ["usuarios", { page, pageSize, searchQuery }],
    queryFn: async () => {
      const res = await fetch(
        `${API}api/usuarios?page=${page}&page_size=${pageSize}&search=${searchQuery}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const formateados = data.results.map((user) => ({
        id: user.id,
        username: user.username,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.groups.includes("admin") ? "Admin" : "User",
        is_active: user.is_active,
        universidad: user.profile?.universidad_name || "-",
        facultad: user.profile?.facultad_name || "-",
        escuela: user.profile?.escuela_name || "-",
      }));
      return {
        results: formateados,
        totalPages: data.totalPages || Math.ceil(data.count / pageSize),
      };
    },
    keepPreviousData: true,
  });

  const handleEstadoChange = async (id, username, nuevoEstado) => {
    try {
      const res = await fetch(`${API}api/usuarios/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: nuevoEstado }),
      });

      if (res.ok) {
        Notification.alertLogin(`Estado actualizado para ${username}`);
        queryClient.invalidateQueries(["usuarios"]);
      } else {
        Notification.alertError(`Error al actualizar estado de ${username}`);
      }
    } catch (error) {
      console.error(error);
      Notification.alertError("Error de red al cambiar estado");
    }
  };

  // --- Definir tamaños fijos como programador ---
  const columns = useMemo(
    () => [
      {
        accessorKey: "username",
        header: "Usuario",
        size: 120,
        minSize: 80,
        maxSize: 200,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        size: 180,
        minSize: 120,
        maxSize: 300,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
        minSize: 150,
        maxSize: 350,
      },
      {
        accessorKey: "role",
        header: "Rol",
        size: 100,
        minSize: 80,
        maxSize: 150,
      },
      {
        accessorKey: "universidad",
        header: "Universidad",
        size: 180,
        minSize: 120,
        maxSize: 300,
      },
      {
        accessorKey: "facultad",
        header: "Facultad",
        size: 150,
        minSize: 100,
        maxSize: 250,
      },
      {
        accessorKey: "escuela",
        header: "Escuela",
        size: 180,
        minSize: 120,
        maxSize: 300,
      },
      {
        accessorKey: "is_active",
        header: "Estado",
        size: 100,
        minSize: 80,
        maxSize: 150,
        cell: ({ row }) => {
          const user = row.original;
          return (
            <select
              className="form-select form-select-sm"
              value={user.is_active.toString()}
              onChange={(e) =>
                handleEstadoChange(
                  user.id,
                  user.username,
                  e.target.value === "true"
                )
              }
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.results || [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // manualPagination: true,
  });

  return (
    <div>
      <h2 className="mb-4">Usuarios Registrados</h2>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div className="d-flex gap-2">
          <Link
            className="btn btn-primary"
            href="/admin/registrar"
            style={{ width: "200px" }}
          >
            Nuevo Usuario
          </Link>
          <input
            type="text"
            placeholder="Buscar en todos los campos..."
            className="form-control"
            style={{ maxWidth: "300px" }}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold mb-0 text-black">
            Resultados por página:
          </label>
          <select
            className="form-select w-auto"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <Tables>
          <thead className="table-light">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} style={{ width: header.getSize() }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center">
                  <Spinner />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </Tables>
      </div>

      {data?.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
