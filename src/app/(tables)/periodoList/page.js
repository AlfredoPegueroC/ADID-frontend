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

  const fetchData = async () => {
    try {
      const periodoResponse = await fetch(
        `http://localhost:8000/api/periodoacademico?page=${page}`
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
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
