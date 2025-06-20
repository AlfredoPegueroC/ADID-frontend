"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import Search from "@components/search";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { debounce } from "lodash";
import { fetchCampus } from "@api/campusService";
import { exportCampusToPDF } from "@utils/ExportPDF/exportCampusPDF";

function CampusListClient({ initialData, totalPages: initialTotalPages }) {
  const [campusList, setCampusList] = useState(initialData || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
  const API = process.env.NEXT_PUBLIC_API_KEY;

  // fetchData usa estados actuales
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchCampus(currentPage, searchQuery, pageSize);
      setCampusList(response.results);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching campus data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, pageSize]);

  // Debounce para actualización de búsqueda
  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
    }, 300)
  ).current;

  // Reset página a 1 si cambia búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Carga datos cada vez que cambia página, búsqueda o tamaño de página
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Eliminar campus
  const deleteCampus = useCallback(
    (pk) => {
      deleteEntity(`${API}api/campus/delete`, pk, setCampusList, "CampusID");
    },
    [API]
  );

  // Manejo cambio búsqueda
  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // Manejo submit búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Cambio tamaño página
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Campus</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/campus">
            Agregar Campus
          </Link>
          {campusList.length > 0 && (
            <>
              <Link className="btn btn-success" href={`${API}export/campus`}>
                Exportar
              </Link>
              <button
                className="btn btn-danger"
                onClick={() =>
                  exportCampusToPDF(campusList, currentPage, pageSize)
                }
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
          <Search
            SearchSubmit={handleSearchSubmit}
            SearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
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

      <Modal title="Importar Campus">
        <ImportExcel
          importURL={`${API}import/campus`}
          onSuccess={fetchData}
        />
      </Modal>

      <Tables>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Provincia</th>
            <th>País</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="10" className="text-center">
                Cargando...
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {campusList.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">
                  No se encontraron campus.
                </td>
              </tr>
            ) : (
              campusList.map((c) => (
                <tr key={c.CampusCodigo}>
                  <td>{c.CampusCodigo}</td>
                  <td>{c.CampusNombre}</td>
                  <td>{c.CampusDireccion}</td>
                  <td>{c.CampusCiudad}</td>
                  <td>{c.CampusProvincia}</td>
                  <td>{c.CampusPais}</td>
                  <td>{c.CampusTelefono}</td>
                  <td>{c.CampusCorreoContacto}</td>
                  <td>{c.CampusEstado}</td>
                  <td>
                    <Link
                      className="btn btn-primary btn-sm"
                      href={`/campusEdit/${c.CampusID}`}
                    >
                      Editar
                    </Link>
                    <button
                      className="btn btn-danger btn-sm mx-2"
                      onClick={() => deleteCampus(c.CampusID)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        )}
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

export default withAuth(CampusListClient);


