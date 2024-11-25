"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link'

export default function UniversidadList() {
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
    fetch("http://localhost:8000/api/universidad") // Replace with your API URL
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

  const deleteUniversidad = (pk) => {
    // Send DELETE request to the API
    fetch(`http://localhost:8000/api/universidad/delete/${pk}/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // If successful, filter out the deleted university from the state
          setUniversidades(
            universidades.filter((uni) => uni.UniversidadCodigo !== pk)
          );
        } else {
          alert("Failed to delete universidad.");
        }
      })
      .catch((error) => {
        console.error("Error deleting universidad:", error);
      });
  };

  // Display loading or error states
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link className="btn btn-primary mt-5" href="/universidad">Nuevo</Link>
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
          {universidades.length > 0 &&
            universidades.map((universidad, index) => (
              <tr key={universidad.UniversidadCodigo}>
                <th scope="row">{index + 1}</th>
                <td>{universidad.nombre}</td>
                <td>{universidad.estado}</td>
                <td>
                  <button className="btn btn-primary btn-sm">Edit</button>
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
