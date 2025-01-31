"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
// Components
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import ImportExcel from "@components/forms/Import";
import Modal from "@components/Modal";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function EscuelaList() {
  const [escuelas, setEscuelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const Api_import_URL = "http://localhost:8000/import/escuela";

  // const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  const fetchData = async () => {
    try {
      // Fetch escuela data
      const escuelaResponse = await fetch(
        `http://localhost:8000/api/escuela?page=${page}`
      );
      if (!escuelaResponse.ok) throw new Error("Failed to fetch escuelas");
      const escuelaData = await escuelaResponse.json();

      // Fetch facultad data
      const facultadResponse = await fetch(
        `http://localhost:8000/api/facultad`
      );
      if (!facultadResponse.ok) throw new Error("Failed to fetch facultades");
      const facultadData = await facultadResponse.json();

      // Fetch universidad data
      const universidadResponse = await fetch(
        `http://localhost:8000/api/universidad`
      );
      if (!universidadResponse.ok)
        throw new Error("Failed to fetch universidades");
      const universidadData = await universidadResponse.json();

      // Merge data
      const mergedData = escuelaData.results.map((escuela) => {
        const facultad = facultadData.results.find(
          (fac) => fac.facultadCodigo === escuela.facultadCodigo
        ) || {
          nombre: "Facultad no encontrada",
        };

        const universidad = universidadData.results.find(
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
      setTotalPages(Math.ceil(escuelaData.count / 30));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const deleteEscuela = (pk) => {
    deleteEntity(
      "http://localhost:8000/api/escuela/delete",
      pk,
      setEscuelas,
      "escuelaCodigo"
    );
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
        <Link
          className="btn btn-success mt-5 ms-2"
          href={`http://localhost:8000/export/escuela`}
        >
          Exportar
        </Link>
      )}
      <button
        type="button"
        className="btn btn-warning mt-5 ms-2"
        data-bs-toggle="modal"
        data-bs-target="#Modal"
      >
        Importar
      </button>

      <Modal title="Importar Escuela">
        <ImportExcel importURL={Api_import_URL} onSuccess={fetchData} />
      </Modal>

      <Tables>
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
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/escuelaEdit/${escuela.escuelaCodigo}`}
                  >
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
      </Tables>

      {escuelas.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export default withAuth(EscuelaList);
