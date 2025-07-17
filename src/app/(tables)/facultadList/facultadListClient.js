"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Search from "@components/search";
import ImportExcel from "@components/forms/Import";
import Modal from "@components/Modal";
import withAuth from "@utils/withAuth";
import { debounce } from "lodash";

import { fetchFacultades } from "@api/facultadService";
import { deleteEntity } from "@utils/delete";
import { exportFacultadesToPDF } from "@utils/ExportPDF/exportFacultadPDF";

function FacultadListClient() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
  const queryClient = useQueryClient();

  // debounce solo actualiza searchQuery, no resetea página aquí
  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
    }, 300)
  ).current;

  // Cuando cambia searchQuery, resetear página a 1
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const { data, isLoading } = useQuery({
    queryKey: ["facultades", { page, searchQuery, pageSize }],
    queryFn: () => fetchFacultades(page, searchQuery, pageSize, token),
    keepPreviousData: true,
  });

  const mutationDelete = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/facultad/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries(["facultades"]);
    },
  });

  const handleDeleteFacultad = (pk) => {
    mutationDelete.mutate(pk);
  };

  // Aquí solo llama debounce para actualizar searchQuery
  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // Solo previene el submit, no toca página
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const facultades = data?.results || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Facultades</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/facultad">
            Nueva Facultad
          </Link>

          <Link className="btn btn-success" href={`${API}export/facultad`}>
            Exportar Excel
          </Link>

          <button
            className={`btn btn-danger ${facultades.length === 0 ? "disabled" : ""}`}
            onClick={() => exportFacultadesToPDF(facultades, page, pageSize)}
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

      <Modal title="Importar Facultad">
        <ImportExcel
          importURL={`${API}import/facultad`}
          onSuccess={() => queryClient.invalidateQueries(["facultades"])}
        />
      </Modal>

      <Tables>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Decano</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Campus</th>
            <th>Acción</th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td colSpan={10} className="text-center">
                Cargando...
              </td>
            </tr>
          </tbody>
        ) : facultades.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={10} className="text-center">No se han encontrado facultades.</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {facultades.map((facultad) => (
              <tr key={facultad.FacultadID}>
                <td>{facultad.FacultadCodigo}</td>
                <td>{facultad.FacultadNombre}</td>
                <td>{facultad.FacultadDecano}</td>
                <td>{facultad.FacultadTelefono}</td>
                <td>{facultad.FacultadDireccion}</td>
                <td>{facultad.FacultadEmail}</td>
                <td>{facultad.FacultadEstado}</td>
                <td>{facultad.universidadNombre || "—"}</td>
                <td>{facultad.campusNombre || "—"}</td>
                <td>
                  <Link className="btn btn-primary btn-sm" href={`/facultadEdit/${facultad.FacultadCodigo}`}>
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => handleDeleteFacultad(facultad.FacultadID)}
                  >
                    borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </Tables>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

export default withAuth(FacultadListClient);
