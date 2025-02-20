"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Modal from "@components/Modal";
import Periodo from "@components/forms/Periodo";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

function PeriodoList() {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const fetchData = useCallback(async () => {
    try {
      const searchParam = searchQuery
        ? `&search=${encodeURIComponent(searchQuery)}`
        : "";

      // Fetch both periodo and universidad data concurrently
      const [periodoResponse, universidadesResponse] = await Promise.all([
        fetch(`${API}/api/periodoacademico?page=${page}${searchParam}`),
        fetch(`${API}/api/universidad`),
      ]);

      if (!periodoResponse.ok)
        throw new Error("Fallo la busqueda de datos de periodo");
      const periodoData = await periodoResponse.json();

      if (!universidadesResponse.ok)
        throw new Error("Failed to fetch universidades");
      const universidadesData = await universidadesResponse.json();

      // Merge the fetched data
      const mergedData = periodoData.results.map((periodo) => {
        const universidad = universidadesData.results.find(
          (uni) => uni.UniversidadCodigo === periodo.UniversidadCodigo
        );
        return {
          ...periodo,
          universidadNombre: universidad
            ? universidad.nombre
            : "Universidad no encontrada",
        };
      });

      setPeriodos(mergedData);
      setTotalPages(Math.ceil(periodoData.count / 30));
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, API]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deletePeriodo = (pk) => {
    deleteEntity(
      `${API}/api/periodoacademico/delete`,
      pk,
      setPeriodos,
      "periodoAcademicoCodigo"
    );
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 500), // Delay of 500 ms
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value); // Call the debounced search function
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    fetchData(); // Trigger search after form submit
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
      <h1 className="text-dark">Lista Periodo</h1>
      <div className="d-flex gap-2 mb-3 mt-3">
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#Modal"
        >
          Nuevo Periodo
        </button>

        {periodos.length > 0 && (
          <Link
            className="btn btn-success"
            href={`${API}/export/periodoAcademico`}
          >
            Exportar
          </Link>
        )}
      </div>

      <Modal title="Importar Facultad">
        <Periodo title="Periodo Academico" onSuccess={fetchData} />
      </Modal>

      <form onSubmit={handleSearchSubmit} className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar por nombre o estado"
          onChange={handleSearchChange} // This just updates the input value
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

export default withAuth(PeriodoList);
