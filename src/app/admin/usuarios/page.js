'use client';

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

import { useMemo, useState, useEffect } from 'react';
import Tables from '@components/Tables';

export default function UsuarioPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // ✅ Reemplaza esta URL con la tuya
  const API = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API}api/usuarios`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: () => 'ID',
        footer: props => props.column.id,
      },
      {
        accessorKey: 'username',
        header: () => 'Username',
        footer: props => props.column.id,
      },
      {
        accessorKey: 'email',
        header: () => 'Email',
        footer: props => props.column.id,
      },
      {
        accessorKey: 'first_name',
        header: () => 'First Name',
        footer: props => props.column.id,
      },
      {
        accessorKey: 'last_name',
        header: () => 'Last Name',
        footer: props => props.column.id,
      },
      {
        accessorKey: 'groups',
        header: () => 'Groups',
        footer: props => props.column.id,
        cell: info => info.getValue().join(', '), // para mostrar lista de grupos
      },
    ],
    []
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
  });

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div>
      <h2 className="mb-4">Usuarios Registrados</h2>

      {/* Filtro global */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar en todos los campos..."
          className="form-control"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Mostrar/Ocultar columnas */}
      <div className="mb-3 d-flex gap-3 flex-wrap">
        {table.getAllLeafColumns().map(column => (
          <label key={column.id} className="form-check-label">
            <input
              type="checkbox"
              className="form-check-input me-1"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
            {column.columnDef.header()}
          </label>
        ))}
      </div>

      <div className="table-responsive">
        <Tables>
          <thead className="table-light">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: 'pointer' }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc'
                      ? ' 🔼'
                      : header.column.getIsSorted() === 'desc'
                      ? ' 🔽'
                      : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Tables>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>

        <div className="btn-group">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
