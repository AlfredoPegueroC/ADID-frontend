"use client";

import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { fetchLogs } from "@services/logService";
import Search from "@components/search";
import Pagination from "@components/Pagination";

export default function LogListClient() {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const pageSize = 10;

  const columns = useMemo(() => [
    { accessorKey: "user", header: "Usuario" },
    { accessorKey: "method", header: "Método" },
    { accessorKey: "path", header: "Ruta" },
    { accessorKey: "status_code", header: "Estado" },
    {
      accessorKey: "timestamp",
      header: "Fecha",
      cell: ({ getValue }) =>
        new Date(getValue()).toLocaleString("es-DO"),
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setLoading(true);
    fetchLogs({ page: pageIndex + 1, pageSize, search, token })
      .then((res) => {
        setData(res.results);
        setPageCount(res.total_pages || 1);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [pageIndex, search]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Logs de API</h2>
      <Search value={search} onChange={setSearch} placeholder="Buscar por usuario o ruta..." />
      <div className="overflow-x-auto mt-2">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-2 border-b">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-2 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination table={table} />
    </div>
  );
}
