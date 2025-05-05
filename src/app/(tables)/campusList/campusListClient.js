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

function CampusListClient({ initialData, totalPages }) {
  const [campusList, setCampusList] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const fetchData = async (page, query) => {
    try {
      const response = await fetchCampus(query, page);
      setCampusList(response.results);
    } catch (error) {
      console.error("Error fetching campus data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page, searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData(currentPage, searchQuery);
  };

  const deleteCampus = useCallback((pk) => {
    deleteEntity(`${API}api/campus/delete`, pk, setCampusList, "CampusCodigo");
  }, [API]);

  const debouncedFetch = useCallback(debounce(fetchData, 500), []);

  useEffect(() => {
    debouncedFetch(currentPage, searchQuery);
  }, [currentPage, searchQuery, debouncedFetch]);

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
      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/campus">Agregar Campus</Link>
        {campusList.length > 0 && (
          <Link className="btn btn-success" href={`${API}export/campus`}>Exportar</Link>
        )}
        <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#Modal">Importar</button>
      </div>

      <Modal title="Importar Campus">
        <ImportExcel importURL={`${API}import/campus`} onSuccess={() => fetchData(currentPage, searchQuery)} />
      </Modal>

      <Search SearchSubmit={handleSearchSubmit} SearchChange={handleSearchChange} searchQuery={searchQuery} />

      <Tables>
        <thead>
          <tr>
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
              <td colSpan="9" className="text-center">No se encontraron campus.</td>
            </tr>
          ) : (
            campusList.map((c) => (
              <tr key={c.CampusCodigo}>
                <td>{c.CampusNombre}</td>
                <td>{c.CampusDireccion}</td>
                <td>{c.CampusCiudad}</td>
                <td>{c.CampusProvincia}</td>
                <td>{c.CampusPais}</td>
                <td>{c.CampusTelefono}</td>
                <td>{c.CampusCorreoContacto}</td>
                <td>{c.CampusEstado}</td>
                <td>
                  <Link className="btn btn-primary btn-sm" href={`/campusEdit/${c.CampusCodigo}`}>
                    <Image src="/edit.svg" alt="editar" width={20} height={20} />
                  </Link>
                  <button className="btn btn-danger btn-sm mx-2" onClick={() => deleteCampus(c.CampusCodigo)}>
                    <Image src="/delete.svg" alt="borrar" width={20} height={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Tables>

      {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}

export default withAuth(CampusListClient);
