"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Components
import Pagination from "@components/Pagination";
import Tables from "@/src/components/Tables";
import ImportExcel from "@components/forms/Import";
import Modal from "@components/Modal";
import Search from "@components/search";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function FacultadList() {
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const Api_import_URL = "http://localhost:8000/import/facultad";

  const fetchData = async () => {
    try {
      const searchParam = searchQuery
        ? `&search=${encodeURIComponent(searchQuery)}`
        : "";

      const facultadesResponse = await fetch(
        `http://localhost:8000/api/facultad?page=${page}${searchParam}`
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  if (loading) {
    return (
      <div className="spinner-container ">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Facultad</h1>
      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/facultad">
          Nuevo
        </Link>
        {facultades.length > 0 && (
          <Link
            className="btn btn-success"
            href="http://127.0.0.1:8000/export/facultad"
          >
            Exportar
          </Link>
        )}

        <button
          type="button"
          className="btn btn-warning"
          data-bs-toggle="modal"
          data-bs-target="#Modal"
        >
          Importar
        </button>
      </div>

      {/* Modal components */}
      <Modal title="Importar Facultad">
        <ImportExcel importURL={Api_import_URL} onSuccess={fetchData} />
      </Modal>

      {/* Search Form */}
      <Search
        SearchSubmit={handleSearchSubmit}
        SearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

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
                  <Image src="/edit.svg" alt="editar" width={20} height={20} />
                </Link>
                <button
                  className="btn btn-danger btn-sm mx-2"
                  onClick={() => deleteFacultad(facultad.facultadCodigo)}
                >
                  <Image
                    src="/delete.svg"
                    alt="borrar"
                    width={20}
                    height={20}
                  />
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
