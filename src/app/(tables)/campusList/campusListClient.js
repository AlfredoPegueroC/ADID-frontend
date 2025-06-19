"use client";

import { useEffect, useState, useCallback } from "react";
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

  const fetchData = async (page, query, size) => {
    setLoading(true);
    try {
      const response = await fetchCampus(page, query, size);
      setCampusList(response.results);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching campus data:", error);
    } finally {
      setLoading(false);
    }
  };

  // debounce para evitar múltiples llamadas rápidas
  const debouncedFetchData = useCallback(
    debounce((page, query, size) => {
      fetchData(page, query, size);
    }, 300),
    []
  );

  // Llama al fetchData con debounce cuando cambian page, query o pageSize
  useEffect(() => {
    debouncedFetchData(currentPage, searchQuery, pageSize);
    return () => debouncedFetchData.cancel();
  }, [currentPage, searchQuery, pageSize, debouncedFetchData]);

  // Actualizar lista localmente sin hacer fetch tras eliminación
  const deleteCampus = useCallback(
    (pk) => {
      deleteEntity(`${API}api/campus/delete`, pk, setCampusList, "CampusID");
    },
    [API]
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // No fetch explícito, lo hará el useEffect con debounce
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
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
          onSuccess={() => fetchData(currentPage, searchQuery, pageSize)}
        />
      </Modal>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
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
        </Tables>
      )}

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

export default withAuth(CampusListClient);
