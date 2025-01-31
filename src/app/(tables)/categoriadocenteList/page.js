"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function FacultadList() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriaResponse = await fetch(
          "http://localhost:8000/api/categoriaDocente"
        );
        if (!categoriaResponse.ok)
          throw new Error("Failed to fetch categoriaDocente data");
        const categoriaData = await categoriaResponse.json();

        const universidadResponse = await fetch(
          "http://localhost:8000/api/universidad"
        );
        if (!universidadResponse.ok)
          throw new Error("Failed to fetch universidad data");
        const universidadData = await universidadResponse.json();

        const mergedData = categoriaData.results.map((categoria) => {
          const universidad = universidadData.results.find(
            (uni) => uni.UniversidadCodigo === categoria.UniversidadCodigo
          );

          return {
            ...categoria,
            universidadNombre: universidad
              ? universidad.nombre
              : "Universidad no encontrada",
          };
        });

        setCategorias(mergedData);
        setTotalPages(Math.ceil(categoriaData.count / 30));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  const deleteCategoria = (pk) => {
    deleteEntity(
      "http://localhost:8000/api/categoriadocente/delete",
      pk,
      setCategorias,
      "categoriaCodigo"
    );
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link className="btn btn-primary mt-5" href="/categoriadocente">
        Nuevo
      </Link>
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
                No categories found.
              </td>
            </tr>
          ) : (
            categorias.map((categoria, index) => (
              <tr key={categoria.categoriaCodigo}>
                <th scope="row">{index + 1}</th>
                <td>{categoria.nombre}</td>
                <td>{categoria.estado}</td>
                <td>{categoria.universidadNombre}</td>
                <td>
                  <Link
                    href={`/categoriaEdit/${categoria.categoriaCodigo}`}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deleteCategoria(categoria.categoriaCodigo)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Tables>

      {categorias.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export default withAuth(FacultadList);
