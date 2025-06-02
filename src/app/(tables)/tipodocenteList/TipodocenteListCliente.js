"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";

import { exportTipoDocenteToPDF } from "@utils/ExportPDF/exportTipoPDF";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchTipoDocentes } from "@api/tipoDocenteService";

function TipodocenteListClient({ initialData, totalPages: initialTotalPages }) {
  const [tipodocentes, setTipodocentes] = useState(initialData);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const deleteTipo = (pk) => {
    deleteEntity(
      `${API}api/tipodocente/delete`,
      pk,
      setTipodocentes,
      "TipoDocenteCodigo"
    );
  };

  const fetchData = async (query, page, size) => {
    const { results, totalPages } = await fetchTipoDocentes(query, page, size);
    setTipodocentes(results);
    setTotalPages(totalPages);
  };

  const debouncedFetchData = useCallback(
    debounce(() => {
      fetchData(searchQuery, page, pageSize);
    }, 300),
    [searchQuery, page, pageSize]
  );

  useEffect(() => {
    debouncedFetchData();
    return () => debouncedFetchData.cancel();
  }, [debouncedFetchData]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Tipos de Docente</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/tipodocente">
            Nuevo Tipo Docente
          </Link>
          {tipodocentes.length > 0 && (
            <>
              <Link
                className="btn btn-success"
                href={`${API}export/tipoDocente`}
              >
                Exportar
              </Link>
              <button
                className="btn btn-danger"
                onClick={() =>
                  exportTipoDocenteToPDF(tipodocentes, page, pageSize)
                }
              >
                Exportar PDF
              </button>
            </>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold mb-0 text-black">
            Resultados por página:
          </label>
          <select
            className="form-select w-auto"
            style={{ height: "38px" }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <Search
        SearchSubmit={handleSearchSubmit}
        SearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

      <Tables>
        <thead>
          <tr>
            <th>#</th>
            <th>Código</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {tipodocentes.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No se han encontrado tipos de docente.
              </td>
            </tr>
          ) : (
            tipodocentes.map((tipo, index) => (
              <tr key={tipo.TipoDocenteCodigo}>
                <th scope="row">{index + 1 + (page - 1) * pageSize}</th>
                <td>{tipo.TipoDocenteCodigo}</td>
                <td>{tipo.TipoDocenteDescripcion}</td>
                <td>{tipo.TipoDocenteEstado}</td>
                <td>{tipo.universidadNombre || "—"}</td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/tipoEdit/${tipo.TipoDocenteID}`}
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
                    onClick={() => deleteTipo(tipo.TipoDocenteID)}
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

export default withAuth(TipodocenteListClient);
