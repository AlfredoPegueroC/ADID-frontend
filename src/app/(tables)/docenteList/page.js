"use client";

import { useEffect, useState } from "react";
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

  const fetchData = async () => {
    try {
      const searchParam = searchQuery
        ? `&search=${encodeURIComponent(searchQuery)}`
        : "";
      // Fetch main data
      const docenteResponse = await fetch(
        `http://localhost:8000/api/docente?page=${page}${searchParam}`
      );
      if (!docenteResponse.ok) {
        throw new Error("Failed to fetch docentes");
      }
      const docenteData = await docenteResponse.json();

      const universidadResponse = await fetch(
        "http://localhost:8000/api/universidad"
      );
      if (!universidadResponse.ok) {
        throw new Error("Failed to fetch universidades");
      }
      const universidadData = await universidadResponse.json();

      const facultadResponse = await fetch(
        "http://localhost:8000/api/facultad"
      );
      if (!facultadResponse.ok) {
        throw new Error("Failed to fetch facultades");
      }
      const facultadData = await facultadResponse.json();

      const escuelaResponse = await fetch("http://localhost:8000/api/escuela");
      if (!escuelaResponse.ok) {
        throw new Error("Failed to fetch escuelas");
      }
      const escuelaData = await escuelaResponse.json();

      const tipoResponse = await fetch("http://localhost:8000/api/tipodocente");
      if (!tipoResponse.ok) {
        throw new Error("Failed to fetch tipos");
      }
      const tipoData = await tipoResponse.json();

      const categoriaResponse = await fetch(
        "http://localhost:8000/api/categoriaDocente"
      );
      if (!categoriaResponse.ok) {
        throw new Error("Failed to fetch categorias");
      }
      const categoriaData = await categoriaResponse.json();

      // Merge data
      const mergedData = docenteData.results.map((docente) => {
        const universidad = universidadData.results.find(
          (uni) => uni.UniversidadCodigo === docente.UniversidadCodigo
        );
        const facultad = facultadData.results.find(
          (fac) => fac.facultadCodigo === docente.facultadCodigo
        );
        const escuela = escuelaData.results.find(
          (esc) => esc.escuelaCodigo === docente.escuelaCodigo
        );
        const tipo = tipoData.results.find(
          (tip) => tip.tipoDocenteCodigo === docente.tipoDocenteCodigo
        );
        const categoria = categoriaData.results.find(
          (cat) => cat.categoriaCodigo === docente.categoriaCodigo
        );

        return {
          ...docente,
          universidadNombre: universidad ? universidad.nombre : "N/A",
          facultadNombre: facultad ? facultad.nombre : "N/A",
          escuelaNombre: escuela ? escuela.nombre : "N/A",
          tipoNombre: tipo ? tipo.nombre : "N/A",
          categoriaNombre: categoria ? categoria.nombre : "N/A",
        };
      });

      setDocentes(mergedData);
      setTotalPages(Math.ceil(docenteData.count / 30));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchQuery]);

  const deleteDocente = (pk) => {
    deleteEntity(
      "http://localhost:8000/api/docente/delete",
      pk,
      setDocentes,
      "Docentecodigo"
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
    <div className="mt-5">
      <h1 className="text-dark">Lista Docente</h1>
      <div className="d-flex gap-2 mb-3 mt-3">
        <Link className="btn btn-primary" href="/docente">
          Agregar Docente
        </Link>
        {docentes.length > 0 && (
          <Link
            className="btn btn-success"
            href="http://127.0.0.1:8000/export/docente"
          >
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

      <Modal title="Importar Docente">
        <ImportExcel
          importURL="http://localhost:8000/import/docente"
          onSuccess={fetchData}
        />
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
            <th scope="col">Apellidos</th>
            <th scope="col">Sexo</th>
            <th scope="col">Estado Civil</th>
            <th scope="col">Fecha</th>
            <th scope="col">Teléfono</th>
            <th scope="col">Dirección</th>
            <th scope="col">Estado</th>
            <th scope="col">Universidad</th>
            <th scope="col">Facultad</th>
            <th scope="col">Escuela</th>
            <th scope="col">Tipo D.</th>
            <th scope="col">Categoría</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {docentes.length === 0 && (
            <tr>
              <td colSpan="15" className="text-center">
                No docentes found.
              </td>
            </tr>
          )}
          {docentes.map((docente, index) => (
            <tr key={docente.Docentecodigo}>
              <th scope="row">{index + 1}</th>
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
                <Link
                  className="btn btn-primary btn-sm"
                  href={`/docenteEdit/${docente.Docentecodigo}`}
                >
                  <Image src="/edit.svg" alt="editar" width={20} height={20} />
                </Link>
                <button
                  className="btn btn-danger btn-sm mx-2"
                  onClick={() => deleteDocente(docente.Docentecodigo)}
                >
                  <Image
                    src="/descargar-icon.svg"
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

export default withAuth(DocenteList);
