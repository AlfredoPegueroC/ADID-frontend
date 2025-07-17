"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import { exportUniversidadesToPDF } from "@utils/ExportPDF/exportUniversidadesToPDF";

import withAuth from "@utils/withAuth";
import { fetchUniversidades } from "@api/universidadService";
import { deleteEntity } from "@utils/delete";

function UniversidadListClient() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
      // setPage(1);
    }, 500)
  ).current;

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["universidades", { page, searchQuery, pageSize }],
    queryFn: () => fetchUniversidades(page, searchQuery, pageSize, token),
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/universidad/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries(["universidades"]);
    },
  });

  const handleDelete = (pk) => {
    mutation.mutate(pk);
  };

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const universidades = data?.results || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div>
      <h1 className="text-dark mt-5">Lista de Universidades</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/universidad">Nueva Universidad</Link>
          <Link className="btn btn-success" href={`${API}export/universidad`}>Exportar Excel</Link>
          <button
            className={`btn btn-danger ${universidades.length === 0 ? "disabled" : ""}`}
            onClick={() => exportUniversidadesToPDF(universidades, page, pageSize)}
          >
            Exportar PDF
          </button>
          <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#Modal">
            Importar Excel
          </button>

          <Search
            SearchSubmit={(e) => e.preventDefault()}
            SearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold mb-0 text-black">Resultados por página:</label>
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
          importURL={`${API}import/universidad`}
          onSuccess={() => queryClient.invalidateQueries(["universidades"])}
        />
      </Modal>

      <Tables>
        <thead>
          <tr>
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
          {isLoading ? (
            <tr><td colSpan="10" className="text-center">Cargando...</td></tr>
          ) : universidades.length === 0 ? (
            <tr><td colSpan="10" className="text-center">No se encontraron universidades.</td></tr>
          ) : (
            universidades.map((universidad) => (
              <tr key={universidad.UniversidadCodigo}>
                <td>{universidad.UniversidadCodigo}</td>
                <td>{universidad.UniversidadNombre}</td>
                <td>{universidad.UniversidadDireccion}</td>
                <td>{universidad.UniversidadTelefono}</td>
                <td>{universidad.UniversidadEmail}</td>
                <td>
                  <a href={universidad.UniversidadSitioWeb} target="_blank" rel="noopener noreferrer">
                    {universidad.UniversidadSitioWeb}
                  </a>
                </td>
                <td>{universidad.UniversidadRector}</td>
                <td>{universidad.UniversidadEstado}</td>
                <td>
                  <Link href={`/universidadEdit/${universidad.UniversidadCodigo}`} className="btn btn-primary btn-sm">
                    editar
                  </Link>
                  <button className="btn btn-danger btn-sm mx-2" onClick={() => handleDelete(universidad.UniversidadID)}>
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
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export default withAuth(UniversidadListClient);
