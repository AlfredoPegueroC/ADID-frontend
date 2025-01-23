"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "@components/Pagination";
import Tables  from "@components/Tables";

export default function UniversidadList() {
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const response = await fetch(`http://localhost:8000/api/universidad?page=${page}`);
        if (!response.ok) {console.error("Failed to fetch data");}
        const data = await response.json();
        setUniversidades(data.results);
        setTotalPages(Math.ceil(data.count / 10));
        setLoading(false);
      }catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  const deleteUniversidad = async (pk) => {
    const confirmDelete = window.confirm("¿Estás seguro de querer eliminar?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/universidad/delete/${pk}/`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setUniversidades((prevUniversidades) =>
            prevUniversidades.filter((uni) => uni.UniversidadCodigo !== pk)
          );
          alert("Universidad eliminada con éxito.");
        } else {
          alert("Error al eliminar la universidad.");
        }
      } catch (error) {
        console.error("Error deleting universidad:", error);
        alert("Error al eliminar la universidad.");
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="d-flex gap-1 mb-3 mt-3">
        <Link className="btn btn-primary" href="/universidad">
          Nuevo
        </Link>
        {universidades.length > 0 && (
          <Link
            className="btn btn-success"
            href="http://127.0.0.1:8000/export/universidad"
          >
            Exportar
          </Link>
        )}
      </div>
      <Tables>
        <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Estado</th>
              <th scope="col">Acción</th>
            </tr>
          </thead>
          <tbody>
            {universidades.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  No se encontraron universidades.
                </td>
              </tr>
            )}
            {universidades.map((universidad, index) => (
              <tr key={universidad.UniversidadCodigo}>
                <th scope="row">{index + 1 + (page - 1) * 10}</th>
                <td>{universidad.nombre}</td>
                <td>{universidad.estado}</td>
                <td>
                  <Link
                    href={`/universidadEdit/${universidad.UniversidadCodigo}`}
                    className="btn btn-primary btn-sm"
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() =>
                      deleteUniversidad(universidad.UniversidadCodigo)
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
      </Tables>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
