"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import withAuth from "@utils/withAuth";
import Image from "next/image";
import ImportPage from "@components/forms/ImportAsignacion";
import Modal from "@components/Modal";

import Styles from "@styles/home.module.css";

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
    <div className={Styles.home}>
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
      <div className={Styles.home_container}>
        <h1 className={Styles.home_title}>
          Selección de Asignación por Período
        </h1>
        {asignacion.length === 0 ? (
          <div className={Styles.empty_asig}>
            <p className={Styles.empty_title}>
              No se encontraron asignaciones.
            </p>
            <Image
              src="/undraw_no-data_ig65.svg"
              alt="excel"
              width={400}
              height={400}
            />
          </div>
        ) : (
          asignacion.map((asig) => (
            <div key={asig.period} className={Styles.home_items}>
              <Link
                className={Styles.item}
                href={`/asignacionDocente/${asig.period}`}
              >
                <Image
                  src="/excel-icon.png"
                  alt="excel"
                  width={32}
                  height={32}
                />
                {asig.period}
              </Link>

              <div className="home_btns">
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default withAuth(Home);
