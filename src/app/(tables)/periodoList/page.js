"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Modal from "@components/Modal";

import Periodo from "@components/forms/Periodo";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function periodoList() {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("")

  const fetchData = async () => {
    try {
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';

      const periodoResponse = await fetch(
        `http://localhost:8000/api/periodoacademico?page=${page}${searchParam}`
      );
      if (!periodoResponse.ok)
        throw new Error("Fallo la busqueda de datos de periodo");
      const periodoData = await periodoResponse.json();

      const universidadesResponse = await fetch(
        "http://localhost:8000/api/universidad"
      );

      if (!universidadesResponse.ok)
        throw new Error("Failed to fetch universidades");
      const universidadesData = await universidadesResponse.json();

      const mergedData = periodoData.results.map((periodo) => {
        let universidadNombre = "Universidad no encontrada"; // Default value
        const universidad = universidadesData.results.find(
          (uni) => uni.UniversidadCodigo === periodo.UniversidadCodigo
        );
        if (universidad) {
          universidadNombre = universidad.nombre;
        }
        return {
          ...periodo,
          universidadNombre,
        };
      });

      setPeriodos(mergedData);
      setTotalPages(Math.ceil(periodoData.count / 30));
    } catch (error) {
      console.error("Error feaching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const deleteFacultad = (pk) => {
    deleteEntity(
      "http://localhost:8000/api/periodoacademico/delete",
      pk,
      setPeriodos,
      "periodoAcademicoCodigo"
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query as user types, but won't trigger search here
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    fetchData(); // Trigger search after form submit
  };



  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-dark">Lista Periodo</h1>

      <button
        type="button"
        className="btn btn-primary mt-5"
        data-bs-toggle="modal"
        data-bs-target="#Modal"
      >
        Nuevo Periodo
      </button>

      {/* Modal components */}
      <Modal title="Importar Facultad">
        <Periodo title="Periodo Academico" />
      </Modal>

      <form onSubmit={handleSearchSubmit} className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar por nombre o estado"
          value={searchQuery}
          onChange={handleSearchChange} // This just updates the input value, not triggering search yet
        />
        <button className="btn btn-primary" type="submit">
          Buscar
        </button>
      </form>

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
          {periodos.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No se ha Encontrado Periodo Academico.
              </td>
            </tr>
          )}
          {periodos.map((periodo, index) => (
            <tr key={periodo.periodoAcademicoCodigo}>
              <th scope="row">{index + 1}</th>
              <td>{periodo.nombre}</td>
              <td>{periodo.estado}</td>
              <td>{periodo.universidadNombre}</td>
              <td>
                <Link
                  className="btn btn-primary btn-sm"
                  href={`/periodoEdit/${periodo.periodoAcademicoCodigo}`}
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger btn-sm mx-2"
                  onClick={() => deleteFacultad(periodo.periodoAcademicoCodigo)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Tables>

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

export default withAuth(periodoList);
