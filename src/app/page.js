"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Tables from "@components/Tables";
import withAuth from "@utils/withAuth";
import Image from "next/image";
import ImportPage from "@components/forms/ImportAsignacion";
import Modal from "@components/Modal";

function Home() {
  const [asignacion, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const Api_import_URL = "http://localhost:8000/import/asignacion";

  const fetchData = async () => {
    let allAsignaciones = [];
    let nextUrl = "http://localhost:8000/api/asignacion";

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok) throw new Error("Fallo al buscar los datos");

        const data = await response.json();
        allAsignaciones = allAsignaciones.concat(data.results);
        nextUrl = data.next;
      }

      // Keep only unique periods
      const uniqueAsignaciones = [
        ...new Set(allAsignaciones.map((asig) => asig.period)),
      ].map((period) => ({ period }));
      setAsignaciones(uniqueAsignaciones);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (period) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar todas las asignaciones del período ${period}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/asignacionDocente/delete?period=${period}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Fallo al eliminar las asignaciones");
      }

      // Remove the deleted items from the list
      setAsignaciones(asignacion.filter((asig) => asig.period !== period));
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container ">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-black mt-5">Selección de Asignación por Período</h3>

      <Modal title="Importar Asignación">
        <ImportPage importURL={Api_import_URL} onSuccess={fetchData} />
      </Modal>
      <button
        type="button"
        className="btn btn-primary mt-5"
        data-bs-toggle="modal"
        data-bs-target="#Modal"
      >
        Nueva Asignación
      </button>
      <Tables>
        <thead>
          <tr>
            <th scope="col">Período</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {asignacion.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center">
                No se encontraron asignaciones.
              </td>
            </tr>
          ) : (
            asignacion.map((asig) => (
              <tr key={asig.period}>
                <Link href={`/asignacionDocente/${asig.period}`}>
                  <td className="d-flex align-items-center gap-3">
                    {" "}
                    <Image
                      src="/excel-icon.png"
                      alt="Logo de la Facultad de Ciencias"
                      width={32}
                      height={32}
                    />{" "}
                    {asig.period}
                  </td>
                </Link>

                <td>
                  <button
                    className="btn btn-danger btn-sm ms-1 "
                    onClick={() => handleDelete(asig.period)}
                  >
                    <Image
                      src="/delete.svg"
                      alt="borrar"
                      width={20}
                      height={20}
                    />
                  </button>
                  <Link
                    className="btn btn-success btn-sm ms-1"
                    href={`http://127.0.0.1:8000/export/asignacionDocenteExport?period=${asig.period}`}
                  >
                    <Image
                      src="/descargar-icon.svg"
                      alt="borrar"
                      width={20}
                      height={20}
                    />
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Tables>
    </div>
  );
}

export default withAuth(Home);
