"use client";

import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { fetchLogs } from "@api/logService";
import Pagination from "@components/Pagination";
import Search from "@components/search";
import { useAuth } from "@contexts/AuthContext";

export default function LogListClient() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { user } = useAuth();

  useEffect(() => {
    console.log("👤 Usuario conectado:", user?.username || "No autenticado");
  }, [user]);

  const pageSize = 10;

  const methodStyle = (method) => {
    switch (method) {
      case "GET":
        return "text-blue-600 font-semibold";
      case "POST":
        return "text-green-600 font-semibold";
      case "PATCH":
        return "text-yellow-600 font-semibold";
      case "DELETE":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-700";
    }
  };

  const statusLabel = (code) => {
    const map = {
      200: "Éxito",
      201: "Creado",
      204: "Sin contenido",
      400: "Solicitud inválida",
      401: "No autenticado",
      403: "No autorizado",
      404: "No encontrado",
      500: "Error del servidor",
    };
    return map[code] || `Código: ${code}`;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "user",
        header: "Usuario",
        cell: ({ row }) => {
          const user = row.original.user;
          return <span>{user || "Anónimo"}</span>;
        },
      },
      {
        accessorKey: "method",
        header: "Método",
        cell: ({ row }) => (
          <span className={methodStyle(row.original.method)}>
            {row.original.method}
          </span>
        ),
      },
      { accessorKey: "path", header: "Ruta" },
      {
        accessorKey: "status_code",
        header: "Estado",
        cell: ({ getValue }) => {
          const code = getValue();
          const label = statusLabel(code);
          const color = code >= 400 ? "text-red-600" : "text-green-600";
          return <span className={color}>{label}</span>;
        },
      },
      {
        accessorKey: "timestamp",
        header: "Fecha",
        cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
      },
    ],
    []
  );

  const table = useReactTable({
    data: logs,
    columns,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.warn("No access token found. Redirecting to login...");
      router.push("/login");
      return;
    }

    setLoading(true);
    fetchLogs(page, search, token)
      .then(({ results, totalPages }) => {
        setLogs(results);
        setTotalPages(totalPages);
      })
      .catch((err) => {
        console.error("Error fetching logs:", err.message);
        if (err.message.includes("401")) {
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [page, search]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📋 Registro de Actividad API</h2>

      <Search
        value={search}
        onChange={setSearch}
        placeholder="Buscar por usuario, ruta o método..."
      />

      <div className="overflow-x-auto mt-4 border rounded-lg shadow-sm">
        {loading ? (
          <div className="text-center p-8 text-gray-500">Cargando logs...</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-2 border-b text-left text-sm font-medium text-gray-700"
                    >
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
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 border-b text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
