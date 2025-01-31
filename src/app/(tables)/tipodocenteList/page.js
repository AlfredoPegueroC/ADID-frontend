"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function tipodocenteList() {
  const [tipodocentes, setTipodocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const tipoResponse = await fetch(
          "http://localhost:8000/api/tipodocente"
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
    }
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

  if (loading) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <Link className="btn btn-primary mt-5" href="/tipodocente">
        Nuevo
      </Link>

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
