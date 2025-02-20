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
  const [error, setError] = useState(null); 
  const [successMessage, setSuccessMessage] = useState(""); 

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const Api_import_URL = `${API}/import/asignacion`;

  const fetchData = async () => {
    let allAsignaciones = [];
    let nextUrl = `${API}/api/asignacion`;

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
      setError(error.message); // Set error message
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
        `${API}/api/asignacionDocente/delete?period=${period}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Fallo al eliminar las asignaciones");
      }

      // Remove the deleted items from the list
      setAsignaciones(asignacion.filter((asig) => asig.period !== period));
      setSuccessMessage(`Asignaciones del período ${period} eliminadas con éxito.`);
    } catch (error) {
      setError(error.message); // Set error message
      console.error("Error deleting data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Cargando...</p> {/* Loading message */}
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
      {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Display success message */}
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
              alt="No data"
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
                  alt="Excel Icon"
                  width={32}
                  height={32}
                />
                {asig.period}
              </Link>

              <div className="home_btns">
                <Link
                  className="btn btn-success btn-sm ms-1"
                  href={`${API}/export/asignacionDocenteExport?period=${asig.period}`}
                >
                  <Image
                    src="/descargar-icon.svg"
                    alt="Download"
                    width={20}
                    height={20}
                  />
                </Link>

                <button
                  className="btn btn-danger btn-sm ms-1"
                  onClick={() => handleDelete(asig.period)}
                  aria-label={`Eliminar asignaciones del período ${asig.period}`} 
                >
                  <Image
                    src="/delete.svg"
                    alt="Eliminar"
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
