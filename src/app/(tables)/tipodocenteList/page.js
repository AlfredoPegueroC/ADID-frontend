"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function tipodocenteList() {
  const [tipodocentes, setTipodocentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/facultad")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setTipodocentes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("error tipo docentes", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <Link className="btn btn-primary mt-5" href="/facultad">
        Nuevo
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
          {tipodocentes.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No universities found.
              </td>
            </tr>
          )}
          {tipodocentes.length > 0 &&
            tipodocentes.map((tipodocente, index) => (
              <tr key={tipodocente.tipoDocenteCodigo}>
                <th scope="row">{index + 1}</th>
                <td>{tipodocente.nombre}</td>
                <td>{tipodocente.estado}</td>
                <td>{tipodocente.UniversidadCodigo}</td>
                <td>
                  <button className="btn btn-primary btn-sm">Edit</button>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    // onClick={() =>
                    //   deleteUniversidad(universidad.UniversidadCodigo)
                    // }
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
