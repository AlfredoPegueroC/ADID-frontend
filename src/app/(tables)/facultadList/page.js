"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// Components
import Pagination from "@components/Pagination";
import Tables from "@/src/components/Tables";
import ImportExcel from "@components/forms/Import";
import Modal from "@components/Modal";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function FacultadList() {
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const Api_import_URL = "http://localhost:8000/import/facultad";

  const fetchData = async () => {
    try {
      const facultadesResponse = await fetch(
        `http://localhost:8000/api/facultad?page=${page}`
      );
      if (!facultadesResponse.ok) throw new Error("Failed to fetch facultades");
      const facultadesData = await facultadesResponse.json();

      const universidadesResponse = await fetch(
        "http://localhost:8000/api/universidad"
      );
      if (!universidadesResponse.ok)
        throw new Error("Failed to fetch universidades");
      const universidadesData = await universidadesResponse.json();

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
      setTotalPages(Math.ceil(facultadesData.count / 30));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const deleteFacultad = (pk) => {
    deleteEntity(
      "http://localhost:8000/api/facultad/delete",
      pk,
      setFacultades,
      "facultadCodigo"
    );
  };

  // Loading state
  if (loading) {
    return <p>Loading...</p>;
  }

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

      <button
        type="button"
        className="btn btn-warning mt-5 ms-2"
        data-bs-toggle="modal"
        data-bs-target="#Modal"
      >
        Importar
      </button>

      {/* Modal components */}
      <Modal title="Importar Facultad">
        <ImportExcel importURL={Api_import_URL} onSuccess={fetchData} />
      </Modal>

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
                <Link
                  className="btn btn-primary btn-sm"
                  href={`/facultadEdit/${facultad.facultadCodigo}`}
                >
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
      </Tables>

      {/* Pagination Controls */}
      {totalPages.length > 0 && (
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
