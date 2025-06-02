"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";

// Components
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import { exportUniversidadesToPDF } from "@utils/ExportPDF/exportUniversidadesToPDF";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchUniversidades } from "@api/universidadService";

function UniversidadListClient({ initialData }) {
  const [universidades, setUniversidades] = useState(initialData.results || []);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const debouncedFetchData = useCallback(
    debounce(async () => {
      try {
        setLoading(true);
        const { results, totalPages } = await fetchUniversidades(
          page,
          searchQuery,
          pageSize
        );
        setUniversidades(results);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [page, searchQuery, pageSize]
  );

  useEffect(() => {
    debouncedFetchData();
    return () => debouncedFetchData.cancel();
  }, [debouncedFetchData]);

  const handleDelete = (pk) => {
    deleteEntity(
      `${process.env.NEXT_PUBLIC_API_KEY}api/universidad/delete`,
      pk,
      setUniversidades,
      "UniversidadCodigo"
    );
  };

  return (
    <div>
      <h1 className="text-dark mt-5">Lista de Universidades</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-1">
          <Link className="btn btn-primary" href="/universidad">
            Nueva Universidad
          </Link>

          {universidades.length > 0 && (
            <Link
              className="btn btn-success"
              href={`${process.env.NEXT_PUBLIC_API_KEY}export/universidad`}
            >
              Exportar
            </Link>
          )}

          <button
            type="button"
            className="btn btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#Modal"
          >
            Importar
          </button>

          <button
            className="btn btn-danger"
            onClick={() =>
              exportUniversidadesToPDF(universidades, page, pageSize)
            }
          >
            Exportar PDF
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

      <Modal title="Importar Universidad">
        <ImportExcel
          importURL={`${process.env.NEXT_PUBLIC_API_KEY}import/universidad`}
          onSuccess={debouncedFetchData}
        />
      </Modal>

      <Search
        SearchSubmit={(e) => {
          e.preventDefault();
          debouncedFetchData();
        }}
        SearchChange={(e) => {
          setSearchQuery(e.target.value);
          debouncedFetchData();
        }}
        searchQuery={searchQuery}
      />

      <Tables>
        <thead>
          <tr>
            <th>#</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Sitio Web</th>
            <th>Rector</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {universidades.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">
                No se encontraron universidades.
              </td>
            </tr>
          ) : (
            universidades.map((universidad, index) => (
              <tr key={universidad.UniversidadCodigo}>
                <td>{index + 1 + (page - 1) * pageSize}</td>
                <td>{universidad.UniversidadCodigo}</td>
                <td>{universidad.UniversidadNombre}</td>
                <td>{universidad.UniversidadDireccion}</td>
                <td>{universidad.UniversidadTelefono}</td>
                <td>{universidad.UniversidadEmail}</td>
                <td>
                  <a
                    href={universidad.UniversidadSitioWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {universidad.UniversidadSitioWeb}
                  </a>
                </td>
                <td>{universidad.UniversidadRector}</td>
                <td>{universidad.UniversidadEstado}</td>
                <td>
                  <Link
                    href={`/universidadEdit/${universidad.UniversidadID}`}
                    className="btn btn-primary btn-sm"
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
                    onClick={() => handleDelete(universidad.UniversidadID)}
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
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export default withAuth(UniversidadListClient);
