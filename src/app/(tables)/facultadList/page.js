"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "@components/Pagination";

export default function FacultadList() {
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch faculties data with pagination
  useEffect(() => {
    async function fetchData() {
      try {
        const facultadesResponse = await fetch(`http://localhost:8000/api/facultad?page=${page}`);
        if (!facultadesResponse.ok) throw new Error("Failed to fetch facultades");
        const facultadesData = await facultadesResponse.json();

        // Fetch universities
        const universidadesResponse = await fetch("http://localhost:8000/api/universidad");
        if (!universidadesResponse.ok) throw new Error("Failed to fetch universidades");
        const universidadesData = await universidadesResponse.json();

        // Merge university names into faculties
        const mergedData = facultadesData.results.map((facultad) => {
          let universidadNombre = "Universidad no encontrada"; // Default value
          const universidad = universidadesData.results.find(
            (uni) => uni.UniversidadCodigo === facultad.UniversidadCodigo
          );
          if (universidad) {
            universidadNombre = universidad.nombre;
          }
          return {
            ...facultad,
            universidadNombre,
          };
        });

        setFacultades(mergedData);
        setTotalPages(Math.ceil(facultadesData.count / 10)); // Assuming 10 items per page
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  // Handle deletion of facultad
  const deleteFacultad = (pk) => {
    const confirmDelete = window.confirm("¿Estás seguro de querer eliminar?");
    if (confirmDelete) {
      fetch(`http://localhost:8000/api/facultad/delete/${pk}/`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setFacultades(facultades.filter((fac) => fac.facultadCodigo !== pk));
            alert("Facultad eliminada con éxito");
          } else {
            alert("Error al eliminar la facultad.");
          }
        })
        .catch((error) => {
          console.error("Error deleting facultad:", error);
        });
    }
  };

  // Loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Handle page change
  const handlePagination = (direction) => {
    if (direction === "next" && page < totalPages) {
      setPage(page + 1);
    } else if (direction === "prev" && page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <Link className="btn btn-primary mt-5" href="/facultad">
        Nuevo
      </Link>
      {facultades.length > 0 && (
        <Link
          className="btn btn-success mt-5 ms-2"
          href="http://127.0.0.1:8000/export/facultad"
        >
          Exportar
        </Link>
      )}

      <table className="table mt-5">
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
          {facultades.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No faculties found.
              </td>
            </tr>
          )}
          {facultades.map((facultad, index) => (
            <tr key={facultad.facultadCodigo}>
              <th scope="row">{index + 1}</th>
              <td>{facultad.nombre}</td>
              <td>{facultad.estado}</td>
              <td>{facultad.universidadNombre}</td>
              <td>
                <Link className="btn btn-primary btn-sm" href={`/facultadEdit/${facultad.facultadCodigo}`}>
                  Edit
                </Link>
                <button
                  className="btn btn-danger btn-sm mx-2"
                  onClick={() => deleteFacultad(facultad.facultadCodigo)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
