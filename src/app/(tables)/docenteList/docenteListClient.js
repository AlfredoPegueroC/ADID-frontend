"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import Search from "@components/search";
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";
import { fetchDocentes } from "@api/docenteService";
import { debounce } from "lodash";

function DocenteListClient({ initialData, totalPages }) {
  const [docentes, setDocentes] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const fetchDocentesData = async (page, query) => {
    try {
      const response = await fetchDocentes(query, page);
      setDocentes(response.results);
    } catch (error) {
      console.error("Error fetching docentes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDocentesData(page, searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDocentesData(currentPage, searchQuery);
  };

  const deleteDocente = useCallback((pk) => {
    deleteEntity(`${API}api/docente/delete`, pk, setDocentes, "DocenteID");
  }, [API]);

  const debouncedFetchDocentesData = useCallback(debounce(fetchDocentesData, 500), []);

  useEffect(() => {
    debouncedFetchDocentesData(currentPage, searchQuery);
  }, [searchQuery, currentPage, debouncedFetchDocentesData]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista de Docentes</h1>
      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/docente">Agregar Docente</Link>
        {docentes.length > 0 && (
          <Link className="btn btn-success" href={`${API}export/docente`}>Exportar</Link>
        )}
        <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#Modal">
          Importar
        </button>
      </div>

      <Modal title="Importar Docente">
        <ImportExcel importURL={`${API}import/docente`} onSuccess={() => fetchDocentesData(currentPage, searchQuery)} />
      </Modal>

      <Search SearchSubmit={handleSearchSubmit} SearchChange={handleSearchChange} searchQuery={searchQuery} />

      <Tables>
        <thead>
          <tr>
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
        <tbody>
          {docentes.length === 0 ? (
            <tr>
              <td colSpan="16" className="text-center">No se encontraron docentes.</td>
            </tr>
          ) : (
            docentes.map((d) => (
              <tr key={d.DocenteID}>
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
                <td>{d.universidadNombre}</td>
                <td>{d.tipoDocenteNombre}</td>
                <td>{d.categoriaDocenteNombre}</td>
                <td>
                  <Link className="btn btn-primary btn-sm" href={`/docenteEdit/${d.DocenteID}`}>
                    <Image src="/edit.svg" alt="editar" width={20} height={20} />
                  </Link>
                  <button className="btn btn-danger btn-sm mx-2" onClick={() => deleteDocente(d.DocenteID)}>
                    <Image src="/delete.svg" alt="borrar" width={20} height={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Tables>

      {totalPages > 1 && (
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}

export default withAuth(DocenteListClient);
