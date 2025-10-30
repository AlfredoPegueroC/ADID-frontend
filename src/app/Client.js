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
import { debounce } from "lodash";
import { exportAsignacionesToPDF } from "@utils/ExportPDF/exportAsignacionesToPDF";

function AccionCell({ row, api }) {
  const [value, setValue] = useState(row.original.accion || "");
  const [isUpdating, setIsUpdating] = useState(false);

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
      Notification.alertSuccess("Modificado correctamente");
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
      disabled={isUpdating}
    >
      <option value="Pendiente Asignacion">Pendiente Asignacion</option>
      <option value="Asignar">Asignar</option>
      <option value="Eliminar">Eliminar</option>
      <option value="Nuevo">Nuevo</option>
    </select>
  );
}

function ComentarioCell({ row, api }) {
  const [value, setValue] = useState(row.original.comentario || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (value === row.original.comentario) return; // evita enviar si no hubo cambios

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
      Notification.alertSuccess("Comentario actualizado correctamente");
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
        onBlur={handleSave} // guarda automáticamente al salir del campo
        disabled={isUpdating}
        placeholder="Escribir comentario..."
        rows={1}
      />
      {/* <div className="mt-2 text-end">
        <button
          className="btn btn-primary btn-sm"
          onClick={handleSave} // también se puede guardar con el botón
          disabled={isUpdating}
        >
          {isUpdating ? "Guardando..." : "Guardar"}
        </button>
      </div> */}
    </div>
  );
}

function ModificacionesCell({ row, api }) {
  const [value, setValue] = useState(
    row.original.modificacion || "Modificar"
  );
  const [isUpdating, setIsUpdating] = useState(false);

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
      Notification.alertSuccess("Acción modificada correctamente");
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
      disabled={isUpdating}
    >
      <option value="Pendiente Modificar">Pendiente Modificar</option>
      <option value="Modificar">Modificar</option>
      <option value="Deasignar">Deasignar</option>
      <option value="Eliminar">Eliminar</option>
      <option value="Crear">Crear</option>
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
  const [sorting, setSorting] = useState([]);
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

  useEffect(() => {
    const cargarPeriodos = async () => {
      setLoadingPeriodos(true);
      try {
        const res = await fetch(`${API}periodos`);
        if (!res.ok) throw new Error("Error al obtener los periodos");

        const periodosData = await res.json();
        const nombres = periodosData.map((p) => p.PeriodoNombre);
        const periodosFinal = nombres.sort((a, b) => b.localeCompare(a));

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

  const { data, isLoading } = useQuery({
    queryKey: [
      "asignaciones",
      currentPage,
      searchQuery,
      selectedPeriodo,
      pageSize,
    ],
    queryFn: () =>
      fetchAsignacionData(selectedPeriodo, currentPage, searchQuery, pageSize),
    enabled: !!selectedPeriodo && !loadingPeriodos,
    keepPreviousData: true,
  });

  const totalPages = data?.totalPages || 1;

  const deleteAsignacion = useCallback(
    (id) => {
      deleteEntity(
        `${API}api/asignacion/delete`,
        id,
        data?.asignaciones,
        "AsignacionID"
      );
    },
    [API, data]
  );

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

  const columns = useMemo(
    () => [
      {
        accessorKey: "nrc",
        header: "NRC",
        size: 70,
        minSize: 70,
        maxSize: 70,
      },
      {
        accessorKey: "clave",
        header: "Clave",
        size: 80,
        minSize: 80,
        maxSize: 150,
        enableSorting: true,
      },
      {
        accessorKey: "nombre",
        header: "Asignatura",
        size: 140,
        minSize: 120,
        maxSize: 120,
      },
      {
        accessorKey: "codigo",
        header: "Código",
        size: 80,
        minSize: 80,
        maxSize: 150,
        enableSorting: true,
      },
      {
        accessorKey: "docenteNombre",
        header: "Profesor",
        size: 120,
        minSize: 100,
        maxSize: 150,
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
        size: 20,
        minSize: 80,
        maxSize: 30,
        enableSorting: true,
      },
      {
        accessorKey: "modalidad",
        header: "Modalidad",
        size: 50,
        minSize: 50,
        maxSize: 70,
      },
      {
        accessorKey: "campusNombre",
        header: "Campus",
        size: 90,
        minSize: 90,
        maxSize: 110,
        enableSorting: true,
      },
      {
        accessorKey: "facultadNombre",
        header: "Facultad",
        size: 150,
        minSize: 150,
        maxSize: 200,
      },
      {
        accessorKey: "escuelaNombre",
        header: "Escuela",
        size: 150,
        minSize: 150,
        maxSize: 200,
      },
      {
        accessorKey: "tipo",
        header: "Tipo",
        size: 100,
        minSize: 100,
        maxSize: 70,
      },
      {
        accessorKey: "cupo",
        header: "Cupo",
        size: 50,
        minSize: 50,
        maxSize: 150,
      },
      {
        accessorKey: "inscripto",
        header: "Inscripto",
        size: 30,
        minSize: 30,
        maxSize: 150,
      },
      {
        accessorKey: "horario",
        header: "Horario",
        size: 100,
        minSize: 100,
        maxSize: 110,
      },
      {
        accessorKey: "dias",
        header: "Días",
        size: 120,
        minSize: 120,
        maxSize: 80,
      },
      {
        accessorKey: "aula",
        header: "Aula",
        size: 100,
        minSize: 100,
        maxSize: 80,
      },
      { accessorKey: "creditos", header: "CR", size: 50 },

      ...(user?.groups[0] === "admin" || user?.groups[0] === "usuario"
        ? [
            {
              accessorKey: "accion",
              header: "Status",
              size: 100,
              minSize: 120,
              maxSize: 110,
              cell: ({ row }) => <AccionCell row={row} api={API} />,
            },
            // {
            //   id: "acciones",
            //   header: "Acción",
            //   size: 200,
            //   minSize: 100,
            //   maxSize: 200,
            //   cell: ({ row }) => (
            //     <div className="d-flex gap-2">
            //       {/* <Link
            //         className="btn btn-primary btn-sm"
            //         href={`/asignacionEdit/${row.original.AsignacionID}?period=${selectedPeriodo}`}
            //       >
            //         Editar
            //       </Link> */}

            //       {/* <button
            //         className="btn btn-warning btn-sm text-white"
            //         data-bs-toggle="modal"
            //         data-bs-target={`#modal_comment_${row.original.AsignacionID}`}
            //         disabled={!selectedPeriodo}
            //         title={!selectedPeriodo ? "Comentario" : ""}
            //       >
            //         Comentar
            //       </button> */}

            //       {/* <Modal
            //         title="Observaciones"
            //         modelName={`modal_comment_${row.original.AsignacionID}`}
            //       >
            //         <ComentarioCell row={row} api={API} />
            //       </Modal> */}
            //     </div>
            //   ),
            // },
            {
              accessorKey: "modificacion",
              header: "Acción",
              size: 140,
              minSize: 120,
              maxSize: 180,
              cell: ({ row }) => <ModificacionesCell row={row} api={API} />,
            },

            {
              accessorKey: "comentario",
              header: "Comentario",
              size: 120, // ajusta ancho a tu gusto
              minSize: 250,
              maxSize: 500,
              cell: ({ row }) => <ComentarioCell row={row} api={API} />,
            },
          ]
        : []),
    ],
    [selectedPeriodo, API, user]
  );

  const table = useReactTable({
    data: data?.asignaciones || [],
    columns,
    state: { columnVisibility, sorting },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              className={`btn btn-success ${
                !selectedPeriodo ? "disabled" : ""
              }`}
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
                <label
                  className="form-check-label"
                  htmlFor={`col-${column.id}`}
                >
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
          <label className="fw-bold mb-0 text-black">
            Resultados por página:
          </label>
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
              <td
                colSpan={table.getAllLeafColumns().length}
                className="text-center py-5"
              >
                <Spinner />
              </td>
            </tr>
          ) : !selectedPeriodo ? (
            <tr>
              <td
                colSpan={table.getAllLeafColumns().length}
                className="text-center py-4 text-danger"
              >
                Selecciona un periodo para mostrar las asignaciones.
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={table.getAllLeafColumns().length}
                className="text-center py-4"
              >
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
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <Modal title="Importar Asignación">
        <ImportPage
          importURL={Api_import_URL}
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["asignaciones"] })
          }
        />
      </Modal>

      <Modal
        title="Editar asignaciones desde otro periodo"
        modelName="modalcopiar"
      >
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
