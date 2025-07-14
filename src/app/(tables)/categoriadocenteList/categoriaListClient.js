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

import { exportCategoriasToPDF } from "@utils/ExportPDF/exportCategoriaPDF";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchCategorias } from "@api/categoriaService";

function CategoriaListClient() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const queryClient = useQueryClient();

  // Debounce para evitar demasiadas llamadas al escribir
  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
      // setPage(1);
    }, 400)
  ).current;

  // Hook useQuery para cargar categorías
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categorias", { page, searchQuery, pageSize }],
    queryFn: () => fetchCategorias(page, searchQuery, pageSize),
    keepPreviousData: true,
  });

  // Mutación para borrar categoría
  const mutationDelete = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/categoriadocente/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  // Función para llamar al borrado
  const handleDeleteCategoria = (pk) => {
    mutationDelete.mutate(pk);
  };

  // Manejadores
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

  const categorias = data?.results || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Categorías de Docente</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/categoriadocente">
            Nueva Categoría
          </Link>

          <Link className="btn btn-success" href={`${API}export/categoriaDocente`}>
            Exportar
          </Link>

          <button
            className={`btn btn-danger ${categorias.length === 0 ? "disabled" : ""}`}
            onClick={() => exportCategoriasToPDF(categorias, page, pageSize)}
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

      <Modal title="Importar Categoría">
        <ImportExcel
          importURL={`${API}import/categoriaDocente`}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["categorias"] })}
        />
      </Modal>

      <Tables>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Acción</th>
          </tr>
        </thead>

        {isLoading ? (
          <tbody>
            <tr>
              <td colSpan={6} className="text-center">
                Cargando...
              </td>
            </tr>
          </tbody>
        ) : categorias.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={6} className="text-center">
                No se encontraron categorías.
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.CategoriaID}>
                <td>{categoria.categoriaCodigo}</td>
                <td>{categoria.CategoriaNombre}</td>
                <td>{categoria.CategoriaEstado}</td>
                <td>{categoria.universidadNombre || "—"}</td>
                <td>
                  <Link
                    href={`/categoriaEdit/${categoria.CategoriaID}`}
                    className="btn btn-primary btn-sm"
                  >
                    editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => handleDeleteCategoria(categoria.CategoriaID)}
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

export default withAuth(CategoriaListClient);
