'use client';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import Modal from "@components/Modal";
import ImportPage from "@components/forms/ImportAsignacion";
import Notification from '@components/Notification';
import withAuth from "@utils/withAuth";

import { deleteEntity } from "@utils/delete";
import { fetchAsignacionData } from "@api/asignacionService";
import { fetchPeriodos } from "@api/periodoService";
import { debounce } from "lodash";

function AccionCell({ row, api }) {
  const [value, setValue] = useState(row.original.accion || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsUpdating(true);

    try {
      const res = await fetch(`${api}api/asignacion/edit/${row.original.AsignacionID}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: newValue }),
      });

      if (!res.ok) throw new Error('No se pudo actualizar');
      Notification.alertSuccess("Modificado correctamente");
    } catch (err) {
      console.error('Error al actualizar:', err);
      alert('Error al modificar el campo');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      className="form-select form-select-sm"
      value={value}
      onChange={handleChange}
      disabled={isUpdating}
    >
      <option value="Nueva">Nueva</option>
      <option value="Editada">Editada</option>
    </select>
  );
}

function PrincipalListClient({ initialData, totalPages: initialTotalPages }) {
  const [asignaciones, setAsignaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState("");
  const [periodoDestino, setPeriodoDestino] = useState("");
  const [copiando, setCopiando] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingPeriodos, setLoadingPeriodos] = useState(true);
  const [pageSize, setPageSize] = useState(10);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const dropdownRef = useRef(null);

  const [columnVisibility, setColumnVisibility] = useState({
    facultadNombre: false,
    escuelaNombre: false,
    cupo: false,
    inscripto: false,
  });

  const Api_import_URL = `${API}import/asignacion`;
  
  const fetchData = async (page, query, periodo = null) => {
    setLoading(true);
    try {
      const { asignaciones, totalPages } = await fetchAsignacionData(periodo, page, query, pageSize);
      setAsignaciones(asignaciones);
      setTotalPages(totalPages);
      
      console.log("Asignaciones cargadas:", asignaciones.length, "página:", page, "periodo:", periodo);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingPeriodos && selectedPeriodo !== "") {
      fetchData(currentPage, searchQuery, selectedPeriodo);
    }
  }, [selectedPeriodo, currentPage, searchQuery, pageSize, loadingPeriodos]);


useEffect(() => {
  const cargarPeriodos = async () => {
    setLoadingPeriodos(true);

    try {
      const cached = localStorage.getItem("periodosCache");
      let periodosFinal = [];

      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log("🧠 Periodos cargados desde cache");
          periodosFinal = parsed;
        }
      }

      // Si no hay cache válido, pedirlo al servidor
      if (periodosFinal.length === 0) {
        const res = await fetch(`${API}api/periodoacademico`);
        if (!res.ok) throw new Error("Error al obtener los periodos");

        const periodosData = await res.json();
        const nombres = periodosData.results.map((p) => p.PeriodoNombre);
        periodosFinal = nombres.sort((a, b) => b.localeCompare(a));

        localStorage.setItem("periodosCache", JSON.stringify(periodosFinal));
        console.log("📡 Periodos cargados desde API");
      }

      setPeriodos(periodosFinal);
      if (!selectedPeriodo && periodosFinal.length > 0) {
        setSelectedPeriodo(periodosFinal[0]);
      }
    } catch (error) {
      console.error("Error al cargar periodos:", error);
    } finally {
      setLoadingPeriodos(false);
    }
  };

  cargarPeriodos();
}, []);



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e) => { e.preventDefault(); setCurrentPage(1); };
  const handlePeriodoChange = (e) => { setSelectedPeriodo(e.target.value); setCurrentPage(1); };

  const handleCopiarPeriodo = async () => {
    setCopiando(true);
    try {
      const res = await fetch(`${API}api/asignacion/copiar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from_period: selectedPeriodo, to_period: periodoDestino }),
      });

      if (!res.ok) throw new Error("Error al copiar asignaciones");
      alert("Asignaciones copiadas correctamente");
      setSelectedPeriodo(periodoDestino);
    } catch (error) {
      console.error("Error copiando periodo:", error);
      alert("Hubo un error copiando las asignaciones");
    } finally {
      setCopiando(false);
    }
  };

  const deleteAsignacion = useCallback(
    (id) => {
      deleteEntity(`${API}api/asignacion/delete`, id, setAsignaciones, "AsignacionID");
    },
    [API]
  );

  const debouncedSearchChange = useCallback(debounce(handleSearchChange, 500), []);

  const columns = useMemo(() => [
    { accessorKey: 'nrc', header: 'NRC' },
    { accessorKey: 'clave', header: 'Clave' },
    { accessorKey: 'nombre', header: 'Asignatura' },
    { accessorKey: 'codigo', header: 'Código' },
    {
      accessorKey: 'docenteNombre',
      header: 'Profesor',
      cell: ({ row }) => (
        <Link
          href={`/DocenteDetalle/?docente=${row.original.docenteFk}&periodo=${selectedPeriodo}`}
          className="text-decoration-underline text-primary"
        >
          {row.original.docenteNombre}
        </Link>
      )
    },
    { accessorKey: 'seccion', header: 'Sección' },
    { accessorKey: 'modalidad', header: 'Modalidad' },
    { accessorKey: 'campusNombre', header: 'Campus' },
    { accessorKey: 'facultadNombre', header: 'Facultad' },
    { accessorKey: 'escuelaNombre', header: 'Escuela' },
    { accessorKey: 'tipo', header: 'Tipo' },
    { accessorKey: 'cupo', header: 'Cupo' },
    { accessorKey: 'inscripto', header: 'Inscripto' },
    { accessorKey: 'horario', header: 'Horario' },
    { accessorKey: 'dias', header: 'Días' },
    { accessorKey: 'aula', header: 'Aula' },
    { accessorKey: 'creditos', header: 'CR' },
    {
      accessorKey: 'accion',
      header: 'Modificación',
      cell: ({ row }) => <AccionCell row={row} api={API} />
    },
    {
      id: 'acciones',
      header: 'Acción',
      cell: ({ row }) => (
        <Link className="btn btn-primary btn-sm" href={`/asignacionEdit/${row.original.AsignacionID}?period=${selectedPeriodo}`}>
          Editar
        </Link>
      )
    }
  ], [selectedPeriodo, API]);

  const table = useReactTable({
    data: asignaciones,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-4">
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <button className="btn btn-warning text-dark" data-bs-toggle="modal" data-bs-target="#Modal">Nueva Asignación</button>
        <button className="btn btn-info text-white" data-bs-toggle="modal" data-bs-target="#modalcopiar">Editar Asignación</button>
        <Link className="btn btn-success" href="/asignacion">Crear Sección</Link>
        <Link className="btn btn-secondary" href={`${API}export/asignacionDocenteExport?period=${selectedPeriodo}`}>Exportar</Link>

        {loadingPeriodos ? (
          <span className="text-muted">Cargando periodos...</span>
        ) : (
          <select className="form-select w-auto" value={selectedPeriodo} onChange={handlePeriodoChange}>
            {periodos.map((p) => (<option key={p} value={p}>{p}</option>))}
          </select>
        )}

        <div className="dropdown" ref={dropdownRef}>
          <button className="btn btn-outline-dark dropdown-toggle" type="button" onClick={() => setDropdownOpen(!dropdownOpen)}>
            Columnas
          </button>
          <div className={`dropdown-menu p-3 ${dropdownOpen ? 'show' : ''}`} style={{ minWidth: '200px' }}>
            {table.getAllLeafColumns().map(column => (
              <div className="form-check" key={column.id}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`col-${column.id}`}
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                <label className="form-check-label" htmlFor={`col-${column.id}`}>{column.columnDef.header}</label>
              </div>
            ))}
          </div>
        </div>
        <Search SearchSubmit={handleSearchSubmit} SearchChange={debouncedSearchChange} searchQuery={searchQuery} />


        <div className="d-flex align-items-center gap-2 ms-auto">
          <label className="fw-bold mb-0 text-black">Resultados por página:</label>
          <select
            className="form-select w-auto"
            style={{ height: "38px" }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      

      {loading ? (
  <div className="d-flex justify-content-center my-5">
    <div
      className="spinner-border text-primary"
      role="status"
      style={{ width: "3rem", height: "3rem" }}
    >
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
) : (
  <Tables>
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody>
      {table.getRowModel().rows.length === 0 ? (
        <tr>
          <td colSpan={table.getAllLeafColumns().length} className="text-center py-4">
            No se encontraron resultados.
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
)}


      {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}

      <Modal title="Importar Asignación">
        <ImportPage importURL={Api_import_URL} onSuccess={debouncedSearchChange} />
      </Modal>

      <Modal title="Editar asignaciones desde otro periodo" modelName="modalcopiar">
        <div className="d-flex flex-column gap-4 my-4 border rounded p-3 bg-light text-black">
          <div>
            <h5>📄 Editar asignaciones desde otro periodo</h5>
            <select className="form-select w-auto d-inline-block me-2" onChange={(e) => setPeriodoDestino(e.target.value)} value={periodoDestino}>
              <option value="">Seleccionar periodo destino</option>
              {periodos.filter(p => p !== selectedPeriodo).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <button className="btn btn-warning" onClick={handleCopiarPeriodo} disabled={!periodoDestino || copiando}>
              {copiando ? "Editando..." : "Editar asignaciones"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default withAuth(PrincipalListClient);
