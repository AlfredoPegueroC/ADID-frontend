"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import ImportExcel from "@components/forms/Import";
import Modal from "@components/Modal";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function TipodocenteList() {
  const [tipodocentes, setTipodocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const Api_import_URL = `${API}/import/tipoDocente`;

  const fetchData = useCallback(async () => {
    try {
      const searchParam = searchQuery
        ? `&search=${encodeURIComponent(searchQuery)}`
        : "";

      const tipoResponse = await fetch(
        `${API}/api/tipodocente?page=${page}${searchParam}`
      );
      if (!tipoResponse.ok) {
        throw new Error("Failed to fetch data");
      }
      const tipoData = await tipoResponse.json();

      const universidadResponse = await fetch(`${API}/api/universidad`);
      if (!universidadResponse.ok) {
        throw new Error("Failed to fetch data");
      }
      const universidadData = await universidadResponse.json();

      const mergedData = tipoData.results.map((tipo) => {
        let universidadNombre = "Universidad no encontrada";
        const universidad = universidadData.results.find(
          (uni) => uni.UniversidadCodigo === tipo.UniversidadCodigo
        );
        if (universidad) {
          universidadNombre = universidad.nombre;
        }
        return {
          ...tipo,
          universidadNombre,
        };
      });
      setTipodocentes(mergedData);
      setTotalPages(Math.ceil(tipoData.count / 30));
    } catch (error) {
      console.error("Error fetching tipo docentes:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, API]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteTipo = (pk) => {
    deleteEntity(
      `${API}/api/tipodocente/delete`,
      pk,
      setTipodocentes,
      "tipoDocenteCodigo"
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const debouncedFetchData = debounce(() => {
    fetchData();
  }, 300);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    debouncedFetchData(); // Trigger debounced search
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
      <h1 className="text-dark">Lista Tipo Docente</h1>
      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/tipodocente">
          Nuevo Tipo Docente
        </Link>
        {tipodocentes.length > 0 && (
          <Link
            className="btn btn-success"
            href={`${API}/export/tipoDocente`}
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
      <Modal title="Importar Tipo Docente">
        <ImportExcel importURL={Api_import_URL} onSuccess={fetchData} />
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
          {tipodocentes.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No se han encontrado tipo docentes.
              </td>
            </tr>
          )}
          {tipodocentes.map((tipodocente, index) => (
            <tr key={tipodocente.tipoDocenteCodigo}>
              <th scope="row">{index + 1}</th>
              <td>{tipodocente.nombre}</td>
              <td>{tipodocente.estado}</td>
              <td>{tipodocente.universidadNombre}</td>
              <td>
                <Link
                  className="btn btn-primary btn-sm"
                  href={`/tipoEdit/${tipodocente.tipoDocenteCodigo}`}
                >
                  <Image
                    src="/edit.svg"
                    alt="editar"
                    width={20}
                    height={20}
                  />
                </Link>
                <button
                  className="btn btn-danger btn-sm mx-2"
                  onClick={() => deleteTipo(tipodocente.tipoDocenteCodigo)}
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

export default withAuth(TipodocenteList);
