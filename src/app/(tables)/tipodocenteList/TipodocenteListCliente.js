"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";

import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import Search from "@components/search";
import Tables from "@components/Tables";
import Pagination from "@components/Pagination";

import { exportTipoDocenteToPDF } from "@utils/ExportPDF/exportTipoPDF";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchTipoDocentes } from "@api/tipoDocenteService";

function TipoDocenteListClient() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const queryClient = useQueryClient();

  // Debounce para evitar llamadas múltiples al escribir
  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
      // setPage(1);
    }, 400)
  ).current;

  // React Query: cargar tipos
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tiposDocente", { page, searchQuery, pageSize }],
    queryFn: () => fetchTipoDocentes(page, searchQuery, pageSize),
    keepPreviousData: true,
  });

  // Mutación para borrar
  const mutationDelete = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/tipodocente/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiposDocente"] });
    },
  });

  const handleDeleteTipo = (pk) => {
    mutationDelete.mutate(pk);
  };

  // Handlers
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

  const tipos = data?.results || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Tipos de Docente</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/tipodocente">
            Nuevo Tipo
          </Link>

          <Link className="btn btn-success" href={`${API}export/tipoDocente`}>
            Exportar Excel
          </Link>
          <button
            className={`btn btn-danger ${tipos.length === 0 ? "disabled" : ""}`}
            onClick={() => exportTipoDocenteToPDF(tipos, page, pageSize)}
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
          <label className="fw-bold mb-0 text-black">Resultados por página:</label>
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

      <Modal title="Importar Tipo de Docente">
        <ImportExcel
          importURL={`${API}import/tipoDocente`}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["tiposDocente"] })}
        />
      </Modal>

      <Tables>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Acción</th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td colSpan={6} className="text-center">Cargando...</td>
            </tr>
          </tbody>
        ) : tipos.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={6} className="text-center">No se encontraron tipos de docente.</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {tipos.map((tipo) => (
              <tr key={tipo.TipoDocenteID}>
                <td>{tipo.TipoDocenteCodigo}</td>
                <td>{tipo.TipoDocenteDescripcion}</td>
                <td>{tipo.TipoDocenteEstado}</td>
                <td>{tipo.universidadNombre || "—"}</td>
                <td>
                  <Link
                    href={`/tipoEdit/${tipo.TipoDocenteCodigo}`}
                    className="btn btn-primary btn-sm"
                  >
                    editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => handleDeleteTipo(tipo.TipoDocenteID)}
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

export default withAuth(TipoDocenteListClient);
