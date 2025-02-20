"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// Components
import Pagination from "@components/Pagination";
import Tables from "@components/Tables";
import Modal from "@components/Modal";
import ImportExcel from "@components/forms/Import";
import Search from "@components/search";

// Utils
import withAuth from "@utils/withAuth";
import { deleteEntity } from "@utils/delete";

function DocenteList() {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const fetchData = useCallback(async () => {
    try {
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";
      
      const endpoints = [
        `${API}/api/docente?page=${page}${searchParam}`,
        `${API}/api/universidad`,
        `${API}/api/facultad`,
        `${API}/api/escuela`,
        `${API}/api/tipodocente`,
        `${API}/api/categoriaDocente`
      ];
      
      const [docenteData, universidadData, facultadData, escuelaData, tipoData, categoriaData] = await Promise.all(
        endpoints.map(url => fetch(url).then(res => res.json()))
      );
      
      const mergedData = docenteData.results.map((docente) => ({
        ...docente,
        universidadNombre: universidadData.results.find(uni => uni.UniversidadCodigo === docente.UniversidadCodigo)?.nombre || "N/A",
        facultadNombre: facultadData.results.find(fac => fac.facultadCodigo === docente.facultadCodigo)?.nombre || "N/A",
        escuelaNombre: escuelaData.results.find(esc => esc.escuelaCodigo === docente.escuelaCodigo)?.nombre || "N/A",
        tipoNombre: tipoData.results.find(tip => tip.tipoDocenteCodigo === docente.tipoDocenteCodigo)?.nombre || "N/A",
        categoriaNombre: categoriaData.results.find(cat => cat.categoriaCodigo === docente.categoriaCodigo)?.nombre || "N/A",
      }));
      
      setDocentes(mergedData);
      setTotalPages(Math.ceil(docenteData.count / 30));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, API]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteDocente = useCallback((pk) => {
    deleteEntity(`${API}/api/docente/delete`, pk, setDocentes, "Docentecodigo");
  }, [API]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h1 className="text-dark">Lista Docente</h1>
      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/docente">Agregar Docente</Link>
        {docentes.length > 0 && <Link className="btn btn-success" href={`${API}/export/docente`}>Exportar</Link>}
        <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#Modal">Importar</button>
      </div>

      <Modal title="Importar Docente">
        <ImportExcel importURL={`${API}/import/docente`} onSuccess={fetchData} />
      </Modal>

      <Search SearchSubmit={handleSearchSubmit} SearchChange={handleSearchChange} searchQuery={searchQuery} />

      <Tables>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Sexo</th>
            <th>Estado Civil</th>
            <th>Fecha</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Facultad</th>
            <th>Escuela</th>
            <th>Tipo D.</th>
            <th>Categoría</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {docentes.length === 0 && <tr><td colSpan="15" className="text-center">No docentes found.</td></tr>}
          {docentes.map((docente, index) => (
            <tr key={docente.Docentecodigo}>
              <td>{docente.nombre}</td>
              <td>{docente.apellidos}</td>
              <td>{docente.sexo}</td>
              <td>{docente.estado_civil}</td>
              <td>{docente.fecha_nacimiento}</td>
              <td>{docente.telefono}</td>
              <td>{docente.direccion}</td>
              <td>{docente.estado}</td>
              <td>{docente.universidadNombre}</td>
              <td>{docente.facultadNombre}</td>
              <td>{docente.escuelaNombre}</td>
              <td>{docente.tipoNombre}</td>
              <td>{docente.categoriaNombre}</td>
              <td>
                <Link className="btn btn-primary btn-sm" href={`/docenteEdit/${docente.Docentecodigo}`}>
                  <Image src="/edit.svg" alt="editar" width={20} height={20} />
                </Link>
                <button className="btn btn-danger btn-sm mx-2" onClick={() => deleteDocente(docente.Docentecodigo)}>
                  <Image src="/delete.svg" alt="borrar" width={20} height={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Tables>

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  );
}

export default withAuth(DocenteList);
