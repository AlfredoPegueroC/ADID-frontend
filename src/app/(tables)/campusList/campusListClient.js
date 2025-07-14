"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import Search from "@components/search";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { debounce } from "lodash";
import { fetchCampus } from "@api/campusService";
import { exportCampusToPDF } from "@utils/ExportPDF/exportCampusPDF";

function CampusListClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

  const queryClient = useQueryClient();

  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
    }, 300)
  ).current;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["campus", { currentPage, searchQuery, pageSize }],
    queryFn: () => fetchCampus(currentPage, searchQuery, pageSize, token),
    keepPreviousData: true,
  });

  const mutationDelete = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/campus/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries(["campus"]);
    },
  });

  const handleDeleteCampus = (pk) => {
    mutationDelete.mutate(pk);
  };

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const campusList = data?.results || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Campus</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/campus">
            Nuevo Campus
          </Link>

          <Link className="btn btn-success" href={`${API}export/campus`}>
            Exportar Excel
          </Link>

          <button
            className={`btn btn-danger ${campusList.length === 0 ? "disabled" : ""}`}
            onClick={() => exportCampusToPDF(campusList, currentPage, pageSize)}
          >
            Exportar PDF
          </button>

          <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#Modal">
            Importar Excel
          </button>

          <Search
            SearchSubmit={handleSearchSubmit}
            SearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold mb-0 text-black">Resultados por página:</label>
          <select
            className="form-select w-auto"
            style={{ height: "38px" }}
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <Modal title="Importar Campus">
        <ImportExcel
          importURL={`${API}import/campus`}
          onSuccess={() => queryClient.invalidateQueries(["campus"])}
        />
      </Modal>

      <Tables>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Provincia</th>
            <th>País</th>
            <th>Teléfono</th>
            <th>Universidad</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td colSpan="11" className="text-center">
                Cargando...
              </td>
            </tr>
          </tbody>
        ) : campusList.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan="11" className="text-center">
                No se encontraron campus.
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {campusList.map((c) => (
              <tr key={c.CampusCodigo}>
                <td>{c.CampusCodigo}</td>
                <td>{c.CampusNombre}</td>
                <td>{c.CampusDireccion}</td>
                <td>{c.CampusCiudad}</td>
                <td>{c.CampusProvincia}</td>
                <td>{c.CampusPais}</td>
                <td>{c.CampusTelefono}</td>
                <td>{c.universidadNombre}</td>
                <td>{c.CampusCorreoContacto}</td>
                <td>{c.CampusEstado}</td>
                <td>
                  <Link className="btn btn-primary btn-sm" href={`/campusEdit/${c.CampusCodigo}`}>
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => handleDeleteCampus(c.CampusID)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </Tables>

      {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}

export default withAuth(CampusListClient);
