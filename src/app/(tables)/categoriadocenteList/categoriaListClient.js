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
import { fetchCategorias } from "@api/categoriaService";

function CategoriaListClient({ initialData, totalPages }) {
  const [categorias, setCategorias] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategoriaData = async (page, query) => {
    try {
      const { results } = await fetchCategorias(query, page);
      setCategorias(results);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchCategoriaData(page, searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCategoriaData(currentPage, searchQuery);
  };

  useEffect(() => {
    fetchCategoriaData(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Categoría docente</h1>
      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/categoriadocente">
          Nuevo Categoría
        </Link>
        {categorias.length > 0 && (
          <Link className="btn btn-success" href={`${process.env.NEXT_PUBLIC_API_KEY}/export/categoriaDocente`}>
            Exportar
          </Link>
        )}
        <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#Modal">
          Importar
        </button>
      </div>

      <Modal title="Importar Categoria">
        <ImportExcel importURL={`${process.env.NEXT_PUBLIC_API_KEY}/import/categoriaDocente`} onSuccess={() => fetchCategoriaData(currentPage, searchQuery)} />
      </Modal>

      <Search SearchSubmit={handleSearchSubmit} SearchChange={handleSearchChange} searchQuery={searchQuery} />

      <Tables>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Estado</th>
            <th scope="col">Universidad</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No se encontraron categorías.
              </td>
            </tr>
          ) : (
            categorias.map((categoria, index) => (
              <tr key={categoria.categoriaCodigo}>
                <th scope="row">{index + 1 + (currentPage - 1) * 30}</th>
                <td>{categoria.nombre}</td>
                <td>{categoria.estado}</td>
                <td>{categoria.universidadNombre}</td>
                <td>
                  <Link href={`/categoriaEdit/${categoria.categoriaCodigo}`} className="btn btn-primary btn-sm">
                    <Image src="/edit.svg" alt="editar" width={20} height={20} />
                  </Link>
                  <button className="btn btn-danger btn-sm mx-2" onClick={() => deleteEntity(`${process.env.NEXT_PUBLIC_API_KEY}/api/categoriadocente/delete`, categoria.categoriaCodigo, setCategorias, "categoriaCodigo")}>
                    <Image src="/delete.svg" alt="borrar" width={20} height={20} />
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

export default withAuth(CategoriaListClient);
