"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import ImportExcel from "@components/forms/Import";
import Modal from "@components/Modal";

import { fetchFacultades } from "@api/facultadService";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function FacultadListClient({ initialData, totalPages }) {
  const [facultades, setFacultades] = useState(initialData);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const Api_import_URL = `${API}import/facultad`;

  const deleteFacultad = (pk) => {
    deleteEntity(`${API}api/facultad/delete`, pk, setFacultades, "FacultadCodigo");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  console.log(facultades)
  const debouncedFetchData = debounce(async () => {
    const { results } = await fetchFacultades(searchQuery, page);
    setFacultades(results);
    console.log(results)
  }, 300);

  const handlePageChange = async (page) => {
    const { results } = await fetchFacultades(searchQuery, page);
    setFacultades(results);
    setPage(page);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    debouncedFetchData();
  };

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Facultades</h1>

      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/facultad">
          Nueva Facultad
        </Link>
        {facultades.length > 0 && (
          <Link className="btn btn-success" href={`${API}export/facultad`}>
            Exportar
          </Link>
        )}
        <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#Modal">
          Importar
        </button>
      </div>

      <Modal title="Importar Facultad">
        <ImportExcel importURL={Api_import_URL} onSuccess={debouncedFetchData} />
      </Modal>

      <Search
        SearchSubmit={handleSearchSubmit}
        SearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

      <Tables>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Decano</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Campus</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {facultades.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No se han encontrado facultades.
              </td>
            </tr>
          ) : (
            facultades.map((facultad) => (
              <tr key={facultad.FacultadCodigo}>
                <td>{facultad.FacultadCodigo}</td>
                <td>{facultad.FacultadNombre}</td>
                <td>{facultad.FacultadDecano}</td>
                <td>{facultad.FacultadTelefono}</td>
                <td>{facultad.FacultadEstado}</td>
                <td>{facultad.universidadNombre || "—"}</td>
                <td>{facultad.campusNombre || "—"}</td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/facultadEdit/${facultad.FacultadID}`}
                  >
                    <Image src="/edit.svg" alt="editar" width={20} height={20} />
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => deleteFacultad(facultad.FacultadID)}
                  >
                    <Image src="/delete.svg" alt="borrar" width={20} height={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Tables>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}

export default withAuth(FacultadListClient);
