"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import ImportExcel from "@components/forms/Import";
import Modal from "@components/Modal";
import Search from "@components/search";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { debounce } from "lodash";

import { fetchEscuelas } from "@api/escuelaService";
import { exportEscuelasToPDF } from "@utils/ExportPDF/exportEscuelaPDF";

function EscuelaListClient() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const queryClient = useQueryClient();

  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
      // setPage(1);
    }, 300)
  ).current;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["escuelas", { page, searchQuery, pageSize }],
    queryFn: () => fetchEscuelas(page, searchQuery, pageSize),
    keepPreviousData: true,
  });

  const mutationDelete = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/escuela/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escuelas"] });
    },
  });

  const handleDeleteEscuela = (pk) => {
    mutationDelete.mutate(pk);
  };

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // setPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const escuelas = data?.results || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Escuelas</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/escuela">
            Nueva Escuela
          </Link>

          <Link className="btn btn-success" href={`${API}export/escuela`}>
            Exportar Excel
          </Link>

          <button
            className={`btn btn-danger ${escuelas.length === 0 ? "disabled" : ""}`}
            onClick={() => exportEscuelasToPDF(escuelas, page, pageSize)}
          >
            Exportar PDF
          </button>

          <button
            type="button"
            className="btn btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#Modal"
          >
            Importar Excel
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

      <Modal title="Importar Escuela">
        <ImportExcel
          importURL={`${API}import/escuela`}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["escuelas"] })}
        />
      </Modal>

      <Tables>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Directora</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Facultad</th>
            <th>Acción</th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td colSpan={10} className="text-center">
                Cargando...
              </td>
            </tr>
          </tbody>
        ) : escuelas.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={10} className="text-center">
                No se han encontrado escuelas.
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {escuelas.map((escuela) => (
              <tr key={escuela.EscuelaId}>
                <td>{escuela.EscuelaCodigo}</td>
                <td>{escuela.EscuelaNombre}</td>
                <td>{escuela.EscuelaDirectora}</td>
                <td>{escuela.EscuelaTelefono}</td>
                <td>{escuela.EscuelaCorreo}</td>
                <td>{escuela.EscuelaEstado}</td>
                <td>{escuela.universidadNombre || "—"}</td>
                <td>{escuela.facultadNombre || "—"}</td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/escuelaEdit/${escuela.EscuelaId}`}
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => handleDeleteEscuela(escuela.EscuelaId)}
                  >
                    borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </Tables>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

export default withAuth(EscuelaListClient);
