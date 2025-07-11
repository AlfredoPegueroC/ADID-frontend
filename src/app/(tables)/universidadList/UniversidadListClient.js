"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { debounce } from "lodash";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import { exportUniversidadesToPDF } from "@utils/ExportPDF/exportUniversidadesToPDF";

import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchUniversidades } from "@api/universidadService";

function UniversidadListClient({ initialData }) {
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
 

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
    }, 500)
  ).current;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  
  const fetchData = useCallback(async () => {
    setLoading(true);
    // AQUI PASO EL TOKEN DE ACCESO AUTORIZADO
    const token = localStorage.getItem("accessToken");
    try {
      const { results, totalPages } = await fetchUniversidades(
        page,
        searchQuery,
        pageSize,
        token
      );
      setUniversidades(results);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching universidades:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = (pk) => {
    deleteEntity(
      `${API}api/universidad/delete`,
      pk,
      setUniversidades,
      "UniversidadID"
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  return (
    <div>
      <h1 className="text-dark mt-5">Lista de Universidades</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/universidad">
            Nueva Universidad
          </Link>

          <Link className={`btn btn-success`} href={`${API}export/universidad`}>
            Exportar Excel
          </Link>
          <button
            className={`btn btn-danger ${universidades.length === 0 ? "disabled" : ""}`}
            onClick={() =>
              exportUniversidadesToPDF(universidades, page, pageSize)
            }
          >
            Exportar PDF
          </button>

          <button
            type="button"
            className="btn btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#Modal"
          >
            Importar Excel
          </button>

          <Search
            SearchSubmit={(e) => e.preventDefault()}
            SearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
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

      <Modal title="Importar Universidad">
        <ImportExcel
          importURL={`${API}import/universidad`}
          onSuccess={() => fetchData()}
        />
      </Modal>

      <Tables>
        <thead>
          <tr>
           
            <th>Código</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Sitio Web</th>
            <th>Rector</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="10" className="text-center">
                Cargando...
              </td>
            </tr>
          ) : universidades.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">
                No se encontraron universidades.
              </td>
            </tr>
          ) : (
            universidades.map((universidad, index) => (
              <tr key={universidad.UniversidadCodigo}>
                <td>{universidad.UniversidadCodigo}</td>
                <td>{universidad.UniversidadNombre}</td>
                <td>{universidad.UniversidadDireccion}</td>
                <td>{universidad.UniversidadTelefono}</td>
                <td>{universidad.UniversidadEmail}</td>
                <td>
                  <a
                    href={universidad.UniversidadSitioWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {universidad.UniversidadSitioWeb}
                  </a>
                </td>
                <td>{universidad.UniversidadRector}</td>
                <td>{universidad.UniversidadEstado}</td>
                <td>
                  <Link
                    href={`/universidadEdit/${universidad.UniversidadID}`}
                    className="btn btn-primary btn-sm"
                  >
                    editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => handleDelete(universidad.UniversidadID)}
                  >
                    borrar
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

// export async function getServerSideProps(context) {
//   const { page = 1, searchQuery = "", pageSize = 10 } = context.query;
//   const initialData = await fetchUniversidades(
//     Number(page),
//     searchQuery,
//     Number(pageSize)
//   );

//   return {
//     props: {
//       initialData,
//     },
//   };
// }
