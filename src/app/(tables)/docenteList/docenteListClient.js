"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import Search from "@components/search";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchDocentes } from "@api/docenteService";
import { debounce } from "lodash";
import { exportDocentesToPDF } from "@utils/ExportPDF/exportDocentePDF";

function DocenteListClient({ initialData, totalPages: initialTotalPages }) {
  const [docentes, setDocentes] = useState(initialData || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const fetchDocentesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDocentes(currentPage, searchQuery, pageSize);
      setDocentes(response.results);
      setTotalPages(response.totalPages);
    } catch (error) {
      setError("Error al cargar los docentes.");
      console.error("Error fetching docentes:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, pageSize]);

  const debouncedFetch = useCallback(debounce(fetchDocentesData, 500), [fetchDocentesData]);

  useEffect(() => {
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  const deleteDocente = useCallback(
    (pk) => {
      deleteEntity(`${API}api/docente/delete`, pk, setDocentes, "DocenteID");
    },
    [API]
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Docentes</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/docente">
            Agregar Docente
          </Link>
          {docentes.length > 0 && (
            <>
              <Link className="btn btn-success" href={`${API}export/docente`}>
                Exportar
              </Link>
              <button
                className="btn btn-danger"
                onClick={() => exportDocentesToPDF(docentes, currentPage, pageSize)}
              >
                Exportar PDF
              </button>
            </>
          )}
          <button
            type="button"
            className="btn btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#Modal"
          >
            Importar
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold mb-0 text-black">
            Resultados por página:
          </label>
          <select
            className="form-select w-auto"
            style={{ height: "38px" }}
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <Modal title="Importar Docente">
        <ImportExcel
          importURL={`${API}import/docente`}
          onSuccess={fetchDocentesData}
        />
      </Modal>

      <Search
        SearchSubmit={handleSearchSubmit}
        SearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

      <Tables>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Sexo</th>
            <th>Estado Civil</th>
            <th>Nacimiento</th>
            <th>Ingreso</th>
            <th>Nacionalidad</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {docentes.length === 0 ? (
            <tr>
              <td colSpan="14" className="text-center">
                No se encontraron docentes.
              </td>
            </tr>
          ) : (
            docentes.map((d, index) => (
              <tr key={d.DocenteID}>
                <td>{d.DocenteNombre}</td>
                <td>{d.DocenteApellido}</td>
                <td>{d.DocenteSexo}</td>
                <td>{d.DocenteEstadoCivil}</td>
                <td>{d.DocenteFechaNacimiento}</td>
                <td>{d.DocenteFechaIngreso}</td>
                <td>{d.DocenteNacionalidad}</td>
                <td>{d.DocenteTelefono}</td>
                <td>{d.DocenteCorreoElectronico}</td>
                <td>{d.DocenteEstado}</td>
                <td>{d.universidadNombre || "—"}</td>
                <td>{d.tipoDocenteNombre || "—"}</td>
                <td>{d.categoriaDocenteNombre || "—"}</td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/docenteEdit/${d.DocenteID}`}
                  >
                    editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deleteDocente(d.DocenteID)}
                  >
                    borrar
                  </button>
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
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default withAuth(DocenteListClient);
