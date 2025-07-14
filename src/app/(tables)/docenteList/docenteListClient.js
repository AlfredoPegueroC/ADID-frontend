"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";

import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import Search from "@components/search";
import withAuth from "@utils/withAuth";
import { fetchDocentes } from "@api/docenteService";
import { exportDocentesToPDF } from "@utils/ExportPDF/exportDocentePDF";
import { deleteEntity } from "@utils/delete";

function DocenteListClient() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const queryClient = useQueryClient();

  // Debounce para búsqueda
  const debouncedSearch = useRef(
    debounce((value) => {
      setSearchQuery(value);
      // setPage(1);
    }, 300)
  ).current;

  // Consulta react-query para traer docentes
  const { data, isLoading, isError } = useQuery({
    queryKey: ["docentes", { page, searchQuery, pageSize }],
    queryFn: () => fetchDocentes(page, searchQuery, pageSize),
    keepPreviousData: true,
  });

  // Mutación para borrar docente
  const mutationDelete = useMutation({
    mutationFn: (pk) => deleteEntity(`${API}api/docente/delete`, pk),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docentes"] });
    },
  });

  const handleDeleteDocente = (pk) => {
    mutationDelete.mutate(pk);
  };

  // Handlers
  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // setPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const docentes = data?.results || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Docentes</h1>

      {isError && (
        <div className="alert alert-danger">Error al cargar los docentes.</div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" href="/docente">
            Agregar Docente
          </Link>

          <Link className="btn btn-success" href={`${API}export/docente`}>
            Exportar Excel
          </Link>
          <button
            className={`btn btn-danger ${docentes.length === 0 ? "disabled" : ""}`}
            onClick={() => exportDocentesToPDF(docentes, page, pageSize)}
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

      <Modal title="Importar Docente">
        <ImportExcel
          importURL={`${API}import/docente`}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["docentes"] })}
        />
      </Modal>

      <Tables>
        <thead>
          <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Sexo</th>
            <th>Estado Civil</th>
            <th>Nacimiento</th>
            <th>Ingreso</th>
            <th>Nacionalidad</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Acción</th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td colSpan={15} className="text-center">
                Cargando...
              </td>
            </tr>
          </tbody>
        ) : docentes.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={15} className="text-center">
                No se encontraron docentes.
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {docentes.map((d) => (
              <tr key={d.DocenteID}>
                <td>{d.DocenteCodigo}</td>
                <td>{d.DocenteNombre}</td>
                <td>{d.DocenteApellido}</td>
                <td>{d.DocenteSexo}</td>
                <td>{d.DocenteEstadoCivil}</td>
                <td>{d.DocenteFechaNacimiento}</td>
                <td>{d.DocenteFechaIngreso}</td>
                <td>{d.DocenteNacionalidad}</td>
                <td>{d.DocenteTelefono}</td>
                <td>{d.DocenteCorreoElectronico}</td>
                <td>{d.DocenteEstado}</td>
                <td>{d.universidadNombre || "—"}</td>
                <td>{d.tipoDocenteNombre || "—"}</td>
                <td>{d.categoriaDocenteNombre || "—"}</td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/docenteEdit/${d.DocenteID}`}
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() => handleDeleteDocente(d.DocenteID)}
                    disabled={mutationDelete.isLoading}
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
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

export default withAuth(DocenteListClient);
