"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";

// Components
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchUniversidades } from "@api/universidadService";

function UniversidadListClient({ initialData }) {
  const [universidades, setUniversidades] = useState(initialData.results || []);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 1);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedFetchData = useCallback(
    debounce(async () => {
      try {
        setLoading(true);
        const { results, totalPages } = await fetchUniversidades(
          page,
          searchQuery
        );
        setUniversidades(results);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [page, searchQuery]
  );

  useEffect(() => {
    debouncedFetchData();
    return () => debouncedFetchData.cancel();
  }, [debouncedFetchData]);

  const handleDelete = (pk) => {
    deleteEntity(
      `${process.env.NEXT_PUBLIC_API_KEY}api/universidad/delete`,
      pk,
      setUniversidades,
      "UniversidadCodigo"
    );
  };

  return (
    <div>
      <h1 className="text-dark mt-5">Lista Universidad</h1>
      <div className="d-flex gap-1 mb-3 mt-3">
        <Link className="btn btn-primary" href="/universidad">
          Nuevo Universidad
        </Link>
        {universidades.length > 0 && (
          <Link
            className="btn btn-success"
            href={`${process.env.NEXT_PUBLIC_API_KEY}export/universidad`}
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

      <Modal title="Importar Universidad">
        <ImportExcel
          importURL={`${process.env.NEXT_PUBLIC_API_KEY}/import/universidad`}
          onSuccess={debouncedFetchData}
        />
      </Modal>

      <Search
        SearchSubmit={(e) => {
          e.preventDefault();
          debouncedFetchData();
        }}
        SearchChange={(e) => {
          setSearchQuery(e.target.value);
          debouncedFetchData();
        }}
        searchQuery={searchQuery}
      />

      <Tables>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Estado</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {universidades.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No se encontraron universidades.
              </td>
            </tr>
          ) : (
            universidades.map((universidad, index) => (
              <tr key={universidad.UniversidadCodigo}>
                <th scope="row">{index + 1 + (page - 1) * 30}</th>
                <td>{universidad.nombre}</td>
                <td>{universidad.estado}</td>
                <td>
                  <Link
                    href={`/universidadEdit/${universidad.UniversidadCodigo}`}
                    className="btn btn-primary btn-sm"
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
                    onClick={() => handleDelete(universidad.UniversidadCodigo)}
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
            ))
          )}
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

export default withAuth(UniversidadListClient);
