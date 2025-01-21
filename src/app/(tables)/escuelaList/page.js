"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function EscuelaList() {
  const [escuelas, setEscuelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch escuela data
        const escuelaResponse = await fetch(`http://localhost:8000/api/escuela`);
        if (!escuelaResponse.ok) throw new Error("Failed to fetch escuelas");
        const escuelaData = await escuelaResponse.json();

        // Fetch facultad data
        const facultadResponse = await fetch(`http://localhost:8000/api/facultad`);
        if (!facultadResponse.ok) throw new Error("Failed to fetch facultades");
        const facultadData = await facultadResponse.json();

        // Fetch universidad data
        const universidadResponse = await fetch(`http://localhost:8000/api/universidad`);
        if (!universidadResponse.ok) throw new Error("Failed to fetch universidades");
        const universidadData = await universidadResponse.json();

        // Merge data
        const mergedData = escuelaData.map((escuela) => {
          const facultad = facultadData.find((fac) => fac.facultadCodigo === escuela.facultadCodigo) || {
            nombre: "Facultad no encontrada",
          };

          const universidad = universidadData.find(
            (uni) => uni.UniversidadCodigo === escuela.UniversidadCodigo
          ) || {
            nombre: "Universidad no encontrada",
          };

          return {
            ...escuela,
            facultadNombre: facultad.nombre,
            universidadNombre: universidad.nombre,
          };
        });

        setEscuelas(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [API_BASE_URL]);

  const deleteEscuela = (pk) => {
    const confirm = window.confirm("¿Estás seguro de querer eliminar?");
    if (confirm) {
      fetch(`${API_BASE_URL}/escuela/delete/${pk}/`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setEscuelas(escuelas.filter((esc) => esc.escuelaCodigo !== pk));
            alert("Escuela eliminada exitosamente.");
          } else {
            alert("Error al eliminar la escuela.");
          }
        })
        .catch((error) => {
          console.error("Error deleting escuela:", error);
        });
    }
  };

  if (loading) {
    return <p>Loading...</p>; 
  }

  return (
    <div>
      <Link className="btn btn-primary mt-5" href="/escuela">
        Nuevo
      </Link>
      {escuelas.length > 0 && (
        <Link className="btn btn-success mt-5 ms-2" href={`${API_BASE_URL}/export/escuela`}>
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
            <th scope="col">Facultad</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {escuelas.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No escuelas found.
              </td>
            </tr>
          ) : (
            escuelas.map((escuela, index) => (
              <tr key={escuela.escuelaCodigo}>
                <th scope="row">{index + 1}</th>
                <td>{escuela.nombre}</td>
                <td>{escuela.estado}</td>
                <td>{escuela.universidadNombre}</td>
                <td>{escuela.facultadNombre}</td>
                <td>
                  <Link className="btn btn-primary btn-sm" href={`/escuelaEdit/${escuela.escuelaCodigo}`}>
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deleteEscuela(escuela.escuelaCodigo)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
