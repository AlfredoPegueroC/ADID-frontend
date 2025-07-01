"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
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

function CategoriaListClient({ initialData, totalPages: initialTotalPages }) {
  const [categorias, setCategorias] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const importURL = `${API}import/categoriaDocente`;

  // Función para cargar datos
  const fetchCategoriasData = async (page, query, size) => {
    setLoading(true);
    try {
      const { results, totalPages } = await fetchCategorias(page, query, size);
      setCategorias(results);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  // debounce para búsqueda y cambios rápidos
  const debouncedFetchCategorias = useCallback(
    debounce((page, query, size) => {
      fetchCategoriasData(page, query, size);
    }, 400),
    []
  );

  // Efecto para cargar datos cuando cambian búsqueda, página o tamaño de página
  useEffect(() => {
    debouncedFetchCategorias(currentPage, searchQuery, pageSize);
    // Cancelar debounce al desmontar o cambiar parámetros
    return () => debouncedFetchCategorias.cancel();
  }, [searchQuery, currentPage, pageSize, debouncedFetchCategorias]);

  // Cuando se envía el formulario de búsqueda, reiniciamos la página
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // No es necesario llamar fetch aquí porque el useEffect ya se activa
  };

  // Cambiar texto búsqueda
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Borrar categoría
  const deleteCategoria = (pk) => {
    deleteEntity(
      `${API}api/categoriadocente/delete`,
      pk,
      setCategorias,
      "CategoriaID"
    );
  };

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Categorías de Docente</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/categoriadocente">
            Nueva Categoría
          </Link>

          
              <Link
                className="btn btn-success"
                href={`${API}export/categoriaDocente`}
              >
                Exportar
              </Link>

              <button
                className={`btn btn-danger ${categorias.length === 0 ? "disabled" : ""}`}
                onClick={() =>
                  exportCategoriasToPDF(categorias, currentPage, pageSize)
                }
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
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1); // Reiniciar página al cambiar tamaño
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <Modal title="Importar Categoría">
        <ImportExcel
          importURL={importURL}
          onSuccess={() => fetchCategoriasData(currentPage, searchQuery, pageSize)}
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
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="6" className="text-center">
                Cargando...
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {categorias.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No se encontraron categorías.
                </td>
              </tr>
            ) : (
              categorias.map((categoria, index) => (
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
                      onClick={() => deleteCategoria(categoria.CategoriaID)}
                    >
                      borrar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        )}
      </Tables>

      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default withAuth(CategoriaListClient);
