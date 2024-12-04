"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function UniversidadList() {
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
    fetch("http://localhost:8000/api/universidad")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setUniversidades(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching universidades:", error);
        setLoading(false);
      });
  }, []);

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
      <Link className="btn btn-primary mt-5" href="/universidad">
        Nuevo
      </Link>

      {universidades.length > 0 && (
        <Link
          className="btn btn-success mt-5 ms-2"
          href="http://127.0.0.1:8000/export/universidad"
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
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {universidades.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No universities found.
              </td>
            </tr>
          )}
          {universidades.map((universidad, index) => (
            <tr key={universidad.UniversidadCodigo}>
              <th scope="row">{index + 1}</th>
              <td>{universidad.nombre}</td>
              <td>{universidad.estado}</td>
              <td>
                <Link
                  href={`/universidadEdit/${universidad.UniversidadCodigo}`}
                  className="btn btn-primary btn-sm"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger btn-sm mx-2"
                  onClick={() =>
                    deleteUniversidad(universidad.UniversidadCodigo)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
