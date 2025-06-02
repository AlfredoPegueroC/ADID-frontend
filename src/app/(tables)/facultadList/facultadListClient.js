"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import ImportExcel from "@components/forms/Import";
import Modal from "@components/Modal";
import { exportFacultadesToPDF } from "@utils/ExportPDF/exportFacultadPDF";
import { fetchFacultades } from "@api/facultadService";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function FacultadListClient({ initialData, totalPages: initialTotalPages }) {
  const [facultades, setFacultades] = useState(initialData);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const Api_import_URL = `${API}import/facultad`;

  const deleteFacultad = (pk) => {
    deleteEntity(
      `${API}api/facultad/delete`,
      pk,
      setFacultades,
      "FacultadCodigo"
    );
  };

  const fetchData = async (page, query, size) => {
    const response = await fetchFacultades(query, page, size);
    setFacultades(response.results);
    setTotalPages(response.totalPages);
  };

  const debouncedFetchData = useCallback(
    debounce(() => {
      fetchData(page, searchQuery, pageSize);
    }, 300),
    [page, searchQuery, pageSize]
  );

  useEffect(() => {
    debouncedFetchData();
    return () => debouncedFetchData.cancel();
  }, [debouncedFetchData]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Facultades</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/facultad">
            Nueva Facultad
          </Link>
          {facultades.length > 0 && (
            <>
              <Link className="btn btn-success" href={`${API}export/facultad`}>
                Exportar
              </Link>

              <button
                className="btn btn-danger"
                onClick={() =>
                  exportFacultadesToPDF(facultades, page, pageSize)
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
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <Modal title="Importar Facultad">
        <ImportExcel
          importURL={Api_import_URL}
          onSuccess={debouncedFetchData}
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
            <th>Decano</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Campus</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {facultades.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No se han encontrado facultades.
              </td>
            </tr>
          ) : (
            facultades.map((facultad) => (
              <tr key={facultad.FacultadCodigo}>
                <td>{facultad.FacultadCodigo}</td>
                <td>{facultad.FacultadNombre}</td>
                <td>{facultad.FacultadDecano}</td>
                <td>{facultad.FacultadTelefono}</td>
                <td>{facultad.FacultadEstado}</td>
                <td>{facultad.universidadNombre || "—"}</td>
                <td>{facultad.campusNombre || "—"}</td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/facultadEdit/${facultad.FacultadID}`}
                  >
                    <Image
                      src="/edit.svg"
                      alt="editar"
                      width={20}
                      height={20}
                    />
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deleteFacultad(facultad.FacultadID)}
                  >
                    <Image
                      src="/delete.svg"
                      alt="borrar"
                      width={20}
                      height={20}
                    />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Tables>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default withAuth(FacultadListClient);
