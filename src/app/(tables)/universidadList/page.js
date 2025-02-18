"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Components
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function UniversidadList() {
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const Api_import_URL = `${API}/import/universidad`;

  const fetchData = async () => {
    console.log("here it is: ", API);
    try {
      const searchParam = searchQuery
        ? `&search=${encodeURIComponent(searchQuery)}`
        : "";

      const response = await fetch(
        `${API}/api/universidad?page=${page}${searchParam}`
      );
      if (!response.ok) {
        console.error("Failed to fetch data");
        return;
      }
      const data = await response.json();
      setUniversidades(data.results);
      setTotalPages(Math.ceil(data.count / 30));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchQuery]);

  const handleDelete = (pk) => {
    deleteEntity(
      `${API}/api/universidad/delete`,
      pk,
      setUniversidades,
      "UniversidadCodigo"
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
    <div>
      <h1 className="text-dark mt-5">Lista Universidad</h1>
      <div className="d-flex gap-1 mb-3 mt-3">
        <Link className="btn btn-primary" href="/universidad">
          Nuevo Universidad
        </Link>
        {universidades.length > 0 && (
          <Link className="btn btn-success" href={`${API}/export/universidad`}>
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
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {universidades.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No se encontraron universidades.
              </td>
            </tr>
          )}
          {universidades.map((universidad, index) => (
            <tr key={universidad.UniversidadCodigo}>
              <th scope="row">{index + 1 + (page - 1) * 10}</th>
              <td>{universidad.nombre}</td>
              <td>{universidad.estado}</td>
              <td>
                <Link
                  href={`/universidadEdit/${universidad.UniversidadCodigo}`}
                  className="btn btn-primary btn-sm"
                >
                  <Image src="/edit.svg" alt="editar" width={20} height={20} />
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

export default withAuth(UniversidadList);
