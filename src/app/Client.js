"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import Modal from "@components/Modal";
import ImportPage from "@components/forms/ImportAsignacion";
import Notification from "@components/Notification";
import Spinner from "@components/Spinner";


import { useAuth } from "@contexts/AuthContext";
import withAuth from "@utils/withAuth";
import Select from "react-select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteEntity } from "@utils/delete";
import { fetchAsignacionData } from "@api/asignacionService";
import { fetchAcciones } from "@api/accionesService";
import { fetchStatus } from "@api/statusService";
import { debounce } from "lodash";
import { exportAsignacionesToPDF } from "@utils/ExportPDF/exportAsignacionesToPDF";

/* ------------------------ Utilidades de orden ------------------------ */
// Normaliza para ordenar bien en español (quita acentos y case)
const normalize = (v) =>
  (v ?? "")
    .toString()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// Orden de texto (locale-aware)
const compareText = (a, b) => normalize(a).localeCompare(normalize(b), "es");

// Orden numérico (para NRC que puede venir como string)
const toNumber = (v) => {
  const n = Number((v ?? "").toString().replace(/\D+/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const compareNumber = (a, b) => toNumber(a) - toNumber(b);

/* ------------------------ Celdas editables ------------------------ */
function AccionCell({ row, api }) {
  const [value, setValue] = useState(row.original.accion || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  // Traer ACCIONES desde el servicio (página 1, sin filtro, tamaño 100)
  const { data: accionesData, isLoading: accionesLoading } = useQuery({
    queryKey: ["acciones-options"],
    queryFn: () => fetchAcciones(1, "", 100),
    staleTime: 5 * 60 * 1000,
  });

  const opciones = (accionesData?.results || []).map((a) => a.AccionNombre);

  // Si el valor actual no está en el catálogo (por datos viejos), lo añadimos visualmente
  const opcionesFinal = value && !opciones.includes(value)
    ? [value, ...opciones]
    : opciones;

  useEffect(() => {
    setValue(row.original.accion || "");
  }, [row.original.AsignacionID, row.original.accion]);

  const handleChange = async (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsUpdating(true);

    try {
      const res = await fetch(
        `${api}api/asignacion/edit/${row.original.AsignacionID}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ accion: newValue }),
        }
      );

      if (!res.ok) throw new Error("No se pudo actualizar");

      queryClient.setQueriesData(
        { queryKey: ["asignaciones"], exact: false },
        (old) => {
          if (!old) return old;
          const listKey = Array.isArray(old?.results) ? "results" : "asignaciones";
          if (!Array.isArray(old?.[listKey])) return old;
          return {
            ...old,
            [listKey]: old[listKey].map((r) =>
              r.AsignacionID === row.original.AsignacionID
                ? { ...r, accion: newValue }
                : r
            ),
          };
        }
      );

      Notification.alertSuccess("Modificado correctamente");
      queryClient.invalidateQueries({ queryKey: ["asignaciones"] });
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("Error al modificar el campo");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      className="form-select form-select-sm"
      value={value}
      onChange={handleChange}
      disabled={isUpdating || accionesLoading}
    >
      {accionesLoading && <option>Cargando...</option>}
      {!accionesLoading && opcionesFinal.length === 0 && (
        <option value="">(Sin opciones)</option>
      )}
      {!accionesLoading &&
        opcionesFinal.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
    </select>
  );
}


function ComentarioCell({ row, api }) {
  const [value, setValue] = useState(row.original.comentario || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  // Resync cuando cambia la fila/valor original
  useEffect(() => {
    setValue(row.original.comentario || "");
  }, [row.original.AsignacionID, row.original.comentario]);

  const handleSave = async () => {
    if (value === row.original.comentario) return;

    setIsUpdating(true);
    try {
      const res = await fetch(
        `${api}api/asignacion/edit/${row.original.AsignacionID}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ comentario: value }),
        }
      );

      if (!res.ok) throw new Error("No se pudo actualizar");

      queryClient.setQueriesData(
        { queryKey: ["asignaciones"], exact: false },
        (old) => {
          if (!old) return old;
          const listKey = Array.isArray(old?.results) ? "results" : "asignaciones";
          if (!Array.isArray(old?.[listKey])) return old;
          return {
            ...old,
            [listKey]: old[listKey].map((r) =>
              r.AsignacionID === row.original.AsignacionID
                ? { ...r, comentario: value }
                : r
            ),
          };
        }
      );

      Notification.alertSuccess("Comentario actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["asignaciones"] });
    } catch (err) {
      console.error("Error al actualizar comentario:", err);
      alert("Error al modificar el comentario");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <textarea
        className="form-control form-control-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        disabled={isUpdating}
        placeholder="Escribir comentario..."
        rows={1}
      />
    </div>
  );
}

function ModificacionesCell({ row, api }) {
  const [value, setValue] = useState(row.original.modificacion || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  // Traer STATUS desde el servicio (página 1, sin filtro, tamaño 100)
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["status-options"],
    queryFn: () => fetchStatus(1, "", 100),
    staleTime: 5 * 60 * 1000,
  });

  const opciones = (statusData?.results || []).map((s) => s.StatusNombre);

  // Si el valor actual no está en el catálogo, lo añadimos visualmente
  const opcionesFinal = value && !opciones.includes(value)
    ? [value, ...opciones]
    : opciones;

  useEffect(() => {
    setValue(row.original.modificacion || "");
  }, [row.original.AsignacionID, row.original.modificacion]);

  const handleChange = async (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsUpdating(true);

    try {
      const res = await fetch(
        `${api}api/asignacion/edit/${row.original.AsignacionID}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ modificacion: newValue }),
        }
      );

      if (!res.ok) throw new Error("No se pudo actualizar");

      queryClient.setQueriesData(
        { queryKey: ["asignaciones"], exact: false },
        (old) => {
          if (!old) return old;
          const listKey = Array.isArray(old?.results) ? "results" : "asignaciones";
          if (!Array.isArray(old?.[listKey])) return old;
          return {
            ...old,
            [listKey]: old[listKey].map((r) =>
              r.AsignacionID === row.original.AsignacionID
                ? { ...r, modificacion: newValue }
                : r
            ),
          };
        }
      );

      Notification.alertSuccess("Acción modificada correctamente");
      queryClient.invalidateQueries({ queryKey: ["asignaciones"] });
    } catch (err) {
      console.error("Error al actualizar modificaciones:", err);
      alert("Error al modificar la acción");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      className="form-select form-select-sm"
      value={value}
      onChange={handleChange}
      disabled={isUpdating || statusLoading}
    >
      {statusLoading && <option>Cargando...</option>}
      {!statusLoading && opcionesFinal.length === 0 && (
        <option value="">---------</option>
      )}
      {!statusLoading &&
        opcionesFinal.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
    </select>
  );
}



function PrincipalListClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [selectedPeriodo, setSelectedPeriodo] = useState("");
  const [periodoDestino, setPeriodoDestino] = useState("");
  const [copiando, setCopiando] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadingPeriodos, setLoadingPeriodos] = useState(true);
  const [periodos, setPeriodos] = useState([]);


  // Sorting inicial por Profesor asc (client-side)
  const [sorting, setSorting] = useState([{ id: "docenteNombre", desc: false }]);

  const [columnVisibility, setColumnVisibility] = useState({
    facultadNombre: false,
    escuelaNombre: false,
    cupo: false,
    inscripto: false,
  });

  const dropdownRef = useRef(null);
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const Api_import_URL = `${API}import/asignacion`;
  const queryClient = useQueryClient();
  const { user } = useAuth();

  /* ------ Restaurar/Guardar periodo en localStorage (por usuario) ------ */
  useEffect(() => {
    const key = user?.username ? `selectedPeriodo_${user.username}` : "selectedPeriodo";
    const savedPeriodo = localStorage.getItem(key);
    if (savedPeriodo) setSelectedPeriodo(savedPeriodo);
  }, [user]);

  useEffect(() => {
    if (selectedPeriodo) {
      const key = user?.username ? `selectedPeriodo_${user.username}` : "selectedPeriodo";
      localStorage.setItem(key, selectedPeriodo);
    }
  }, [selectedPeriodo, user]);

  /* ------------------------ Cargar periodos ------------------------ */
  useEffect(() => {
    const cargarPeriodos = async () => {
      setLoadingPeriodos(true);
      try {
        const res = await fetch(`${API}periodos`);
        if (!res.ok) throw new Error("Error al obtener los periodos");

        const periodosData = await res.json();
        const nombres = periodosData.map((p) => p.PeriodoNombre);
        const periodosFinal = nombres.sort((a, b) => b.localeCompare(a, "es"));

        setPeriodos(periodosFinal);
        if (!selectedPeriodo && periodosFinal.length > 0) {
          setSelectedPeriodo(periodosFinal[0]);
        }
      } catch (error) {
        console.error("Error al cargar periodos:", error);
        setPeriodos([]);
      } finally {
        setLoadingPeriodos(false);
      }
    };
    cargarPeriodos();
  }, [API, selectedPeriodo]);

  /* ------------------------ Data query ------------------------ */
  const { data, isLoading } = useQuery({
    queryKey: ["asignaciones", currentPage, searchQuery, selectedPeriodo, pageSize],
    queryFn: () => fetchAsignacionData(selectedPeriodo, currentPage, searchQuery, pageSize),
    enabled: !!selectedPeriodo && !loadingPeriodos,
    keepPreviousData: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    gcTime: 5 * 60 * 1000,
  });

  const totalPages = data?.totalPages || 1;

  const handleCopiarPeriodo = async () => {
    setCopiando(true);
    try {
      const res = await fetch(`${API}api/asignacion/copiar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          from_period: selectedPeriodo,
          to_period: periodoDestino,
        }),
      });
      if (!res.ok) throw new Error("Error al copiar asignaciones");
      alert("Asignaciones copiadas correctamente");
      setSelectedPeriodo(periodoDestino);
      await queryClient.invalidateQueries({ queryKey: ["asignaciones"] });
    } catch (error) {
      alert("Hubo un error copiando las asignaciones");
    } finally {
      setCopiando(false);
    }
  };

  const debouncedSearchChange = useCallback(
    debounce((e) => setSearchQuery(e.target.value), 500),
    []
  );

  const opciones = periodos.map((p) => ({ value: p, label: p }));

  /* ------------------------ Columnas (con sortingFn) ------------------------ */
  const columns = useMemo(
    () => [
      {
        accessorKey: "nrc",
        header: "NRC",
        size: 70,
        enableSorting: true,
        sortingFn: (a, b, id) => compareNumber(a.getValue(id), b.getValue(id)),
      },
      {
        accessorKey: "clave",
        header: "Clave",
        size: 80,
        enableSorting: true,
        sortingFn: (a, b, id) => compareText(a.getValue(id), b.getValue(id)),
      },
      {
        accessorKey: "nombre",
        header: "Asignatura",
        size: 140,
        enableSorting: true,
        sortingFn: (a, b, id) => compareText(a.getValue(id), b.getValue(id)),
      },
      {
        accessorKey: "codigo",
        header: "Código",
        size: 80,
        enableSorting: true,
        sortingFn: (a, b, id) => compareText(a.getValue(id), b.getValue(id)),
      },
      {
        accessorKey: "docenteNombre",
        header: "Profesor",
        size: 120,
        enableSorting: true,
        sortingFn: (rowA, rowB, id) => {
          // Ordena por Profesor; desempata por Asignatura, Sección y NRC
          const r = compareText(rowA.getValue(id), rowB.getValue(id));
          if (r !== 0) return r;
          const r2 = compareText(rowA.getValue("nombre"), rowB.getValue("nombre"));
          if (r2 !== 0) return r2;
          const r3 = compareText(rowA.getValue("seccion"), rowB.getValue("seccion"));
          if (r3 !== 0) return r3;
          return compareNumber(rowA.getValue("nrc"), rowB.getValue("nrc"));
        },
        cell: ({ row }) => (
          <Link
            href={`/DocenteDetalle/?docente=${row.original.docenteFk}&periodo=${selectedPeriodo}`}
            className="text-decoration-underline text-primary"
          >
            {row.original.docenteNombre}
          </Link>
        ),
      },
      {
        accessorKey: "seccion",
        header: "Sección",
        size: 80,
        enableSorting: true,
        sortingFn: (a, b, id) => compareText(a.getValue(id), b.getValue(id)),
      },
      {
        accessorKey: "modalidad",
        header: "Modalidad",
        size: 50,
        enableSorting: true,
        sortingFn: (a, b, id) => compareText(a.getValue(id), b.getValue(id)),
      },
      {
        accessorKey: "campusNombre",
        header: "Campus",
        size: 90,
        enableSorting: true,
        sortingFn: (a, b, id) => compareText(a.getValue(id), b.getValue(id)),
      },
      {
        accessorKey: "tipo",
        header: "Tipo",
        size: 100,
        enableSorting: true,
        sortingFn: (a, b, id) => compareText(a.getValue(id), b.getValue(id)),
      },

      // Visibilidad por defecto de algunas columnas
      { accessorKey: "facultadNombre", header: "Facultad", size: 150 },
      { accessorKey: "escuelaNombre", header: "Escuela", size: 150 },
      { accessorKey: "cupo", header: "Cupo", size: 50 },
      { accessorKey: "inscripto", header: "Inscripto", size: 30 },
      { accessorKey: "horario", header: "Horario", size: 100 },
      { accessorKey: "dias", header: "Días", size: 120 },
      { accessorKey: "aula", header: "Aula", size: 100 },
      { accessorKey: "creditos", header: "CR", size: 50 },

      ...(user?.groups[0] === "admin" || user?.groups[0] === "usuario"
        ? [
            {
              accessorKey: "accion",
              header: "Status",
              size: 100,
              cell: ({ row }) => <AccionCell row={row} api={API} />,
            },
            {
              accessorKey: "modificacion",
              header: "Acción",
              size: 140,
              cell: ({ row }) => <ModificacionesCell row={row} api={API} />,
            },
            {
              accessorKey: "comentario",
              header: "Comentario",
              size: 250,
              cell: ({ row }) => <ComentarioCell row={row} api={API} />,
            },
          ]
        : []),
    ],
    [selectedPeriodo, API, user]
  );

  /* ------------------------ Tabla ------------------------ */
  const table = useReactTable({
    data: data?.asignaciones || [],
    columns,
    state: { columnVisibility, sorting },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // client-side sorting activo
    getRowId: (row) => String(row.AsignacionID), // ID estable por fila
  });

  /* ------------------------ Cerrar dropdown fuera ------------------------ */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ------------------------ Render ------------------------ */
  return (
    <div className="mt-4">
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        {(user?.groups[0] === "admin" || user?.groups[0] === "usuario") && (
          <>
            <button
              className="btn btn-warning text-dark"
              data-bs-toggle="modal"
              data-bs-target="#Modal"
              disabled={!selectedPeriodo}
              title={!selectedPeriodo ? "Selecciona un periodo primero" : ""}
            >
              Nueva Asignación
            </button>

            <Link
              className={`btn btn-success ${!selectedPeriodo ? "disabled" : ""}`}
              href={selectedPeriodo ? "/asignacion" : "#"}
              tabIndex={!selectedPeriodo ? -1 : 0}
              aria-disabled={!selectedPeriodo}
            >
              Crear Sección
            </Link>

            <button
              className="btn btn-info text-white"
              data-bs-toggle="modal"
              data-bs-target="#modalcopiar"
              disabled={!selectedPeriodo}
              title={!selectedPeriodo ? "Selecciona un periodo primero" : ""}
            >
              Editar Asignación
            </button>
          </>
        )}

        <Link
          className={`btn btn-secondary ${!selectedPeriodo ? "disabled" : ""}`}
          href={
            selectedPeriodo
              ? `${API}export/asignacionDocenteExport?period=${selectedPeriodo}`
              : "#"
          }
          tabIndex={!selectedPeriodo ? -1 : 0}
          aria-disabled={!selectedPeriodo}
        >
          Exportar Excel
        </Link>
        <button
          className="btn btn-danger"
          onClick={() =>
            exportAsignacionesToPDF(
              table.getAllLeafColumns(),
              table.getRowModel().rows,
              selectedPeriodo,
              currentPage,
              pageSize
            )
          }
          disabled={!selectedPeriodo}
          title={!selectedPeriodo ? "Selecciona un periodo primero" : ""}
        >
          Exportar PDF
        </button>

        {loadingPeriodos ? (
          <span className="text-muted">Cargando periodos...</span>
        ) : periodos.length === 0 ? (
          <span className="text-danger">No hay periodos disponibles</span>
        ) : (
          <Select
            className="w-60 text-black"
            value={opciones.find((opt) => opt.value === selectedPeriodo)}
            onChange={(e) => setSelectedPeriodo(e.value)}
            options={opciones}
            placeholder="Selecciona un periodo"
            isSearchable
          />
        )}

        <div className="dropdown" ref={dropdownRef}>
          <button
            className="btn btn-outline-dark dropdown-toggle"
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Columnas
          </button>
          <div
            className={`dropdown-menu p-3 ${dropdownOpen ? "show" : ""}`}
            style={{ minWidth: "200px" }}
          >
            {table.getAllLeafColumns().map((column) => (
              <div className="form-check" key={column.id}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`col-${column.id}`}
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                <label className="form-check-label" htmlFor={`col-${column.id}`}>
                  {column.columnDef.header}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Search
          SearchSubmit={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          SearchChange={debouncedSearchChange}
          searchQuery={searchQuery}
        />

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
            <option value={75}>75</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <Tables>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort?.();
                const sortState = header.column.getIsSorted?.(); // 'asc' | 'desc' | false
                return (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      cursor: canSort ? "pointer" : "default",
                      userSelect: "none",
                    }}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    title={canSort ? "Ordenar" : undefined}
                  >
                    <div className="d-flex align-items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {canSort && (
                        <span aria-hidden>
                          {sortState === "asc" ? "▲" : sortState === "desc" ? "▼" : ""}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={table.getAllLeafColumns().length} className="text-center py-5">
                <Spinner />
              </td>
            </tr>
          ) : !selectedPeriodo ? (
            <tr>
              <td colSpan={table.getAllLeafColumns().length} className="text-center py-4 text-danger">
                Selecciona un periodo para mostrar las asignaciones.
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
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

      {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      <Modal title="Importar Asignación">
        <ImportPage
          importURL={Api_import_URL}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["asignaciones"] })}
        />
      </Modal>

      <Modal title="Editar asignaciones desde otro periodo" modelName="modalcopiar">
        <div className="d-flex flex-column gap-4 my-4 border rounded p-3 bg-light text-black">
          <div>
            <h5>📄 Editar asignaciones desde otro periodo</h5>
            <select
              className="form-select w-auto d-inline-block me-2"
              onChange={(e) => setPeriodoDestino(e.target.value)}
              value={periodoDestino}
            >
              <option value="">Seleccionar periodo destino</option>
              {periodos
                .filter((p) => p !== selectedPeriodo)
                .map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </select>
            <button
              className="btn btn-warning"
              onClick={handleCopiarPeriodo}
              disabled={!periodoDestino || !selectedPeriodo || copiando}
            >
              {copiando ? "Editando..." : "Editar asignaciones"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default withAuth(PrincipalListClient);
