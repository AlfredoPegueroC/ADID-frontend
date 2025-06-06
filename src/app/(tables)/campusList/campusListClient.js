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
import { fetchCampus } from "@api/campusService";
import { debounce } from "lodash";
import { exportCampusToPDF } from "@utils/ExportPDF/exportCampusPDF";

function CampusListClient({ initialData, totalPages: initialTotalPages }) {
  const [campusList, setCampusList] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const fetchData = async (page, query, size) => {
    try {
      const response = await fetchCampus(query, page, size);
      setCampusList(response.results);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching campus data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const deleteCampus = useCallback(
    (pk) => {
      deleteEntity(`${API}api/campus/delete`, pk, setCampusList, "CampusCodigo");
    },
    [API]
  );

  const debouncedFetch = useCallback(debounce(fetchData, 500), []);

  useEffect(() => {
    debouncedFetch(currentPage, searchQuery, pageSize);
  }, [currentPage, searchQuery, pageSize, debouncedFetch]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

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
        </div>

        <div className="d-flex align-items-center gap-2">
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
          </select>
        </div>
      </div>

      <Modal title="Importar Campus">
        <ImportExcel
          importURL={`${API}import/campus`}
          onSuccess={() => fetchData(currentPage, searchQuery, pageSize)}
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
                    href={`/campusEdit/${c.CampusCodigo}`}
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deleteCampus(c.CampusCodigo)}
                  >
                    Borrar
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
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default withAuth(CampusListClient);
