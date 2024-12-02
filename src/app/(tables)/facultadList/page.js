"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function FacultadList() {
  const [facultades, setFacultades] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch faculties
        const facultadesResponse = await fetch("http://localhost:8000/api/facultad");
        if (!facultadesResponse.ok) throw new Error("Failed to fetch facultades");
        const facultadesData = await facultadesResponse.json();

        // Fetch universities
        const universidadesResponse = await fetch("http://localhost:8000/api/universidad");
        if (!universidadesResponse.ok) throw new Error("Failed to fetch universidades");
        const universidadesData = await universidadesResponse.json();

        // Merge university names into faculties
        const mergedData = facultadesData.map((facultad) => {
          const universidad = universidadesData.find(
            (uni) => uni.UniversidadCodigo === facultad.UniversidadCodigo
          );
          return {
            ...facultad,
            universidadNombre: universidad ? universidad.nombre : "Universidad no encontrada",
          };
        });

        setFacultades(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const deleteFacultad = (pk) => {
    const confirm = window.confirm("¿Estás seguro de querer eliminar?");
    if (confirm) {
      fetch(`http://localhost:8000/api/facultad/delete/${pk}/`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setFacultades(facultades.filter((fac) => fac.facultadCodigo !== pk));
          } else {
            alert("Failed to delete facultad.");
          }
        })
        .catch((error) => {
          console.error("Error deleting facultad:", error);
        });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link className="btn btn-primary mt-5" href="/facultad">
        Nuevo
      </Link>
      <Link
        className="btn btn-success mt-5 ms-2"
        href="http://127.0.0.1:8000/export/facultad"
      >
        Exportar
      </Link>
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
                <button className="btn btn-primary btn-sm">Edit</button>
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
    </div>
  );
}
