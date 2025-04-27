"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import Modal from "@components/Modal";
import ImportPage from "@components/forms/ImportAsignacion";

import { deleteEntity } from "@utils/delete";
import { fetchAsignacionData } from "@api/asignacionService";
import { fetchPeriodos } from "@api/periodoService";
import { debounce } from "lodash";

function PrincipalListClient({ initialData, totalPages: initialTotalPages }) {
  const [asignaciones, setAsignaciones] = useState(initialData || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState("");
  const [periodoDestino, setPeriodoDestino] = useState("");
  const [copiando, setCopiando] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const fileInputRef = useRef(null);
  const [mostrarColumnasExtra, setMostrarColumnasExtra] = useState(true); //**** */


  const Api_import_URL = `${API}import/asignacion`;

  const fetchData = async (page, query, periodo = null) => {
    setLoading(true);
    try {
      const { asignaciones, totalPages } = await fetchAsignacionData(
        periodo,
        page,
        query
      );
      setAsignaciones(asignaciones);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPeriodo) {
      fetchData(currentPage, searchQuery, selectedPeriodo);
    }
  }, [selectedPeriodo, currentPage, searchQuery]);

  useEffect(() => {
    const CargarPeriodos = async () => {
      try {
        const periodosData = await fetchPeriodos();
        const nombres = periodosData.results.map((p) => p.nombre);
  
        // Ordenamos los períodos del más reciente al más antiguo
        const nombresOrdenados = nombres.sort((a, b) => {
          const [aYear, aTerm] = a.split("-").map(Number);
          const [bYear, bTerm] = b.split("-").map(Number);
          return bYear !== aYear ? bYear - aYear : bTerm - aTerm;
        });
  
        setPeriodos(nombresOrdenados);
  
        // Establecemos por defecto el más reciente
        if (nombresOrdenados.length > 0 && !selectedPeriodo) {
          setSelectedPeriodo(nombresOrdenados[0]);
        }
      } catch (error) {
        console.error("Error al cargar periodos:", error);
      }
    };
    CargarPeriodos();
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePeriodoChange = (e) => {
    const periodo = e.target.value;
    setSelectedPeriodo(periodo);
    setCurrentPage(1);
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("periodo", selectedPeriodo);

    fetch(`${API}api/asignacion/importar`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al importar Excel");
        return res.json();
      })
      .then(() => {
        alert("Importación exitosa");
        fetchData(currentPage, searchQuery, selectedPeriodo);
      })
      .catch((err) => {
        console.error(err);
        alert("Ocurrió un error al importar el archivo.");
      });
  };

  const handleCopiarPeriodo = async () => {
    setCopiando(true);
    try {
      const res = await fetch(`${API}api/asignacion/copiar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_period: selectedPeriodo,
          to_period: periodoDestino,
        }),
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
      deleteEntity(
        `${API}api/asignacionDocente/delete`,
        id,
        setAsignaciones,
        "ADIDcodigo"
      );
    },
    [API]
  );

  const debouncedSearchChange = useCallback(
    debounce(handleSearchChange, 500),
    []
  );

  return (
    <div className="mt-4">
      <div className="d-flex gap-1 mb-3 mt-3">
        

        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle=""
          data-bs-target=""
        >
          Consulta
        </button>

        <button
          type="button"
          className="btn btn-warning text-dark"
          data-bs-toggle="modal"
          data-bs-target="#Modal"
        >
          Nueva Asignación
        </button>
        <button
          type="button"
          className="btn btn-info text-white"
          data-bs-toggle="modal"
          data-bs-target="#modalcopiar"
        >
          Editar Asignación
        </button>

        <button
          type="button"
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#modalcopiar"
        >
          Crear Seccion
        </button>

        <Link
          className="btn btn-secondary"
          href={`${API}export/asignacionDocenteExport?period=${selectedPeriodo}`}
        >
          Exportar
        </Link>

        <button
        type="button"
        className="btn btn-outline-dark"
        onClick={() => setMostrarColumnasExtra((prev) => !prev)}
    >
  {mostrarColumnasExtra ? "Ocultar detalles" : "Mostrar detalles"}
</button>

        <select
          className="form w-auto"
          value={selectedPeriodo}
          onChange={handlePeriodoChange}
        >
          {periodos.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <Modal title="Importar Asignación">
        <ImportPage importURL={Api_import_URL} onSuccess={debouncedSearchChange} />
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
              disabled={!periodoDestino || copiando}
            >
              {copiando ? "Editar..." : "Editar asignaciones"}
            </button>
          </div>
        </div>
      </Modal>

      <Search
        SearchSubmit={handleSearchSubmit}
        SearchChange={debouncedSearchChange}
        searchQuery={searchQuery}
      />

      <Tables>
      <thead>
  <tr>
    <th>NRC</th>
    <th>Clave</th>
    <th>Asignatura</th>
    <th>Codigo</th>
    <th>Profesor</th>
    <th>Seccion</th>
    <th>Modalidad</th>
    <th>Campus</th>
    {mostrarColumnasExtra && (
      <>
        <th>Facultad</th>
        <th>Escuela</th>
        <th>Tipo</th>
      </>
    )}
    <th>Cupo</th>
    <th>Inscripto</th>
    <th>Horario</th>
    <th>Dias</th>
    <th>Aulas</th>
    {mostrarColumnasExtra && <th>CR</th>}
    <th>Accion</th>
  </tr>
</thead>
        <tbody>
          {asignaciones.length === 0 ? (
            <tr>
              <td colSpan="18" className="text-center">
                No asignaciones encontradas para este periodo.
              </td>
            </tr>
          ) : (
            asignaciones.map((asignacion) => (
              <tr key={asignacion.ADIDcodigo}>
                <td>{asignacion.nrc}</td>
                <td>{asignacion.clave}</td>
                <td>{asignacion.asignatura}</td>
                <td>{asignacion.codigo}</td>
                <td>{asignacion.docenteNombre}</td>
                <td>{asignacion.seccion}</td>
                <td>{asignacion.modalidad}</td>
                <td>{asignacion.campus}</td>
                <td>{asignacion.facultadNombre}</td>
                <td>{asignacion.escuelaNombre}</td>
                <td>{asignacion.tipo}</td>
                <td>{asignacion.cupo}</td>
                <td>{asignacion.inscripto}</td>
                <td>{asignacion.horario}</td>
                <td>{asignacion.dias}</td>
                <td>{asignacion.Aula}</td>
                <td>{asignacion.creditos}</td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/asignacionEdit/${asignacion.ADIDcodigo}?period=${selectedPeriodo}`}
                  >
                    <Image
                      src="/edit.svg"
                      alt="editar"
                      width={20}
                      height={20}
                    />
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Tables>

      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
    
  );
}

export default PrincipalListClient;
