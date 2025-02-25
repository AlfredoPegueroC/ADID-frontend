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

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function FacultadListClient({ initialData, totalPages }) {
  const [facultades, setFacultades] = useState(initialData);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const Api_import_URL = `${API}import/facultad`;

  const deleteFacultad = (pk) => {
    deleteEntity(`${API}api/facultad/delete`, pk, setFacultades, "facultadCodigo");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const debouncedFetchData = debounce(async () => {
    const { results } = await fetchFacultades(searchQuery, page);
    setFacultades(results);
  }, 300);
 
  const handlePageChange = async (page) => {
    const { results } = await fetchFacultades(searchQuery, page);
    setFacultades(results);
    setPage(page);
  }
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    debouncedFetchData();
  };

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Facultad</h1>
      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/facultad">
          Nuevo Facultad
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

      <Search SearchSubmit={handleSearchSubmit} SearchChange={handleSearchChange} searchQuery={searchQuery} />

      <Tables>
        <thead>
          <tr>
          
            <th scope="col">Nombre</th>
            <th scope="col">Estado</th>
            <th scope="col">Universidad</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {facultades.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No se han encontrado facultades.
              </td>
            </tr>
          )}
          {facultades.map((facultad, index) => (
            <tr key={facultad.facultadCodigo}>
              <td>{facultad.nombre}</td>
              <td>{facultad.estado}</td>
              <td>{facultad.universidadNombre}</td>
              <td>
                <Link className="btn btn-primary btn-sm" href={`/facultadEdit/${facultad.facultadCodigo}`}>
                  <Image src="/edit.svg" alt="editar" width={20} height={20} />
                </Link>
                <button className="btn btn-danger btn-sm mx-2" onClick={() => deleteFacultad(facultad.facultadCodigo)}>
                  <Image src="/delete.svg" alt="borrar" width={20} height={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Tables>

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />}
    </div>
  );
}

export default withAuth(FacultadListClient);
