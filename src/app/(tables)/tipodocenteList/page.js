"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function tipodocenteList() {
  const [tipodocentes, setTipodocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      const searchParam = searchQuery
        ? `&search=${encodeURIComponent(searchQuery)}`
        : "";

      const tipoResponse = await fetch(
        `http://localhost:8000/api/tipodocente?page=${page}${searchParam}`
      );
      if (!tipoResponse.ok) {
        throw new Error("Failed to fetch data");
      }
      const tipoData = await tipoResponse.json();

      const universidadResponse = await fetch(
        "http://localhost:8000/api/universidad"
      );
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
      console.error("error tipo docentes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const deleteTipo = (pk) => {
    deleteEntity(
      "http://localhost:8000/api/tipodocente/delete",
      pk,
      setTipodocentes,
      "tipoDocenteCodigo"
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
      <h1 className="text-dark">Lista lista Tipo docente</h1>
      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/tipodocente">
          Nuevo
        </Link>
      </div>

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
                <td>{tipodocente.universidadNombre}</td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/tipoEdit/${tipodocente.tipoDocenteCodigo}`}
                  >
                    {" "}
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deleteTipo(tipodocente.tipoDocenteCodigo)}
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

export default withAuth(tipodocenteList);
