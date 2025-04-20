'use client';

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

import { useMemo, useState } from 'react';
import Tables from '@components/Tables';

export default function UsuarioPage() {
  const data = useMemo(
    () => [
      { id: 1, name: 'Alfredo Peguero', email: 'alfredo@example.com', role: 'Admin' },
      { id: 2, name: 'Laura Garcia', email: 'laura@example.com', role: 'User' },
      { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'User' },
      { id: 4, name: 'Ana Pérez', email: 'ana@example.com', role: 'Admin' },
      { id: 5, name: 'Luis Jiménez', email: 'luis@example.com', role: 'User' },
      { id: 6, name: 'Mario Castro', email: 'mario@example.com', role: 'User' },
    ],
    []
  );

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: () => 'ID',
        footer: props => props.column.id,
      },
      {
        accessorKey: 'name',
        header: () => 'Name',
        footer: props => props.column.id,
      },
      {
        accessorKey: 'email',
        header: () => 'Email',
        footer: props => props.column.id,
      },
      {
        accessorKey: 'role',
        header: () => 'Role',
        footer: props => props.column.id,
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
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
            {/* Filtros individuales */}
            {/* <tr>
              {table.getHeaderGroups()[0].headers.map(header => (
                <th key={header.id}>
                  {header.column.getCanFilter() ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder={`Filtrar...`}
                      value={
                        header.column.getFilterValue() ?? ''
                      }
                      onChange={e =>
                        header.column.setFilterValue(e.target.value)
                      }
                    />
                  ) : null}
                </th>
              ))}
            </tr> */}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Tables>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount()}
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
