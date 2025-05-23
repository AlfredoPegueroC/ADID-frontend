"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";

import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import Search from "@components/search";
import Tables from "@components/Tables";
import Pagination from "@components/Pagination";

import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchCategorias } from "@api/categoriaService";

function CategoriaListClient({ initialData, totalPages: initialTotalPages }) {
  const [categorias, setCategorias] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const Api_import_URL = `${API}import/categoriaDocente`;

  const deleteCategoria = (pk) => {
    deleteEntity(`${API}api/categoriadocente/delete`, pk, setCategorias, "categoriaCodigo");
  };

  const fetchData = async (query, page, size) => {
    const { results, totalPages } = await fetchCategorias(query, page, size);
    setCategorias(results);
    setTotalPages(totalPages);
  };

  const debouncedFetchData = useCallback(
    debounce(() => {
      fetchData(searchQuery, currentPage, pageSize);
    }, 300),
    [searchQuery, currentPage, pageSize]
  );

  useEffect(() => {
    debouncedFetchData();
    return () => debouncedFetchData.cancel();
  }, [debouncedFetchData]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Categorías de Docente</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/categoriadocente">
            Nueva Categoría
          </Link>
          {categorias.length > 0 && (
            <Link className="btn btn-success" href={`${API}export/categoriaDocente`}>
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
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold mb-0 text-black">Resultados por página:</label>
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

      <Modal title="Importar Categoría">
        <ImportExcel importURL={Api_import_URL} onSuccess={debouncedFetchData} />
      </Modal>

      <Search
        SearchSubmit={handleSearchSubmit}
        SearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

      <Tables>
        <thead>
          <tr>
            <th>#</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No se encontraron categorías.
              </td>
            </tr>
          ) : (
            categorias.map((categoria, index) => (
              <tr key={categoria.categoriaCodigo}>
                <th scope="row">{index + 1 + (currentPage - 1) * pageSize}</th>
                <td>{categoria.categoriaCodigo}</td>
                <td>{categoria.CategoriaNombre}</td>
                <td>{categoria.CategoriaEstado}</td>
                <td>{categoria.universidadNombre || "—"}</td>
                <td>
                  <Link
                    href={`/categoriaEdit/${categoria.CategoriaID}`}
                    className="btn btn-primary btn-sm"
                  >
                    <Image src="/edit.svg" alt="editar" width={20} height={20} />
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deleteCategoria(categoria.CategoriaID)}
                  >
                    <Image src="/delete.svg" alt="borrar" width={20} height={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Tables>

      {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}

export default withAuth(CategoriaListClient);
