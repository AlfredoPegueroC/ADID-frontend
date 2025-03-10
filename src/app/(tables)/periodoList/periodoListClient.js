"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import Modal from "@components/Modal";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchPeriodos } from "@api/periodoService";
import Periodo from "@components/forms/Periodo";

function PeriodoListClient({ initialData, totalPages }) {
  const [periodos, setPeriodos] = useState(initialData);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const deletePeriodo = (pk) => {
    deleteEntity(
      `${API}api/periodoacademico/delete`,
      pk,
      setPeriodos,
      "periodoAcademicoCodigo"
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const debouncedFetchData = debounce(async () => {
    const { results } = await fetchPeriodos(searchQuery, page);
    setPeriodos(results);
  }, 300);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    debouncedFetchData();
  };

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Periodo</h1>
      <div className="d-flex gap-2 mb-3 mt-3">
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#Modal"
        >
          Nuevo Periodo Academico
        </button>
        {periodos.length > 0 && (
          <Link
            className="btn btn-success"
            href={`${API}export/periodoAcademico`}
          >
            Exportar
          </Link>
        )}
      </div>
      <Modal title="Importar Periodo Academico">
        <Periodo
          title="Periodo Academico"
          onSuccess={async () => {
            const { results } = await fetchPeriodos();
            console.log("Updated Periodos:", results);
            setPeriodos(results);
          }}
        />
      </Modal>

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
          {periodos.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No se han encontrado periodos académicos.
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
                  <Image src="/edit.svg" alt="editar" width={20} height={20} />
                </Link>
                <button
                  className="btn btn-danger btn-sm mx-2"
                  onClick={() => deletePeriodo(periodo.periodoAcademicoCodigo)}
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

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export default withAuth(PeriodoListClient);
