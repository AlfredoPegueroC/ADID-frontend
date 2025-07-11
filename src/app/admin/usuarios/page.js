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
import Notification from '@components/Notification';

export default function UsuarioPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}api/usuarios`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const usuarios = await res.json();

        const formateados = usuarios.map(user => ({
          id: user.id,
          username: user.username,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.groups.includes('admin') ? 'Admin' : 'User',
          is_active: user.is_active,
        }));

        setData(formateados);
      } catch (err) {
        console.error('Error cargando usuarios:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: 'username', header: () => 'Usuario' },
      { accessorKey: 'name', header: () => 'Nombre' },
      { accessorKey: 'email', header: () => 'Email' },
      { accessorKey: 'role', header: () => 'Rol' },
      {
        accessorKey: 'is_active',
        header: () => 'Estado',
        cell: ({ row }) => {
          const { username, is_active } = row.original;

          const handleEstadoChange = async (e) => {
            const nuevoEstado = e.target.value === 'true';

            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}api/usuarios/${row.original.id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                 },
                body: JSON.stringify({ is_active: nuevoEstado }),
              });

              if (res.ok) {
                Notification.alertLogin(`Estado actualizado para ${username}`);
                setData(prev =>
                  prev.map(user =>
                    user.id === row.original.id
                      ? { ...user, is_active: nuevoEstado }
                      : user
                  )
                );
              } else {
                Notification.alertError(`Error al actualizar estado de ${username}`);
              }
            } catch (error) {
              console.error(error);
              Notification.alertError('Error de red al cambiar estado');
            }
          };

          return (
            <select
              className="form-select form-select-sm"
              value={is_active}
              onChange={handleEstadoChange}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          );
        }
      }
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
  });

  if (loading) return <div className="text-center mt-5">Cargando usuarios...</div>;

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

      {/* Tabla */}
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

      {/* Paginación */}
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
