"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import withAuth from "@utils/withAuth";
import Image from "next/image";
import ImportPage from "@components/forms/ImportAsignacion";
import Modal from "@components/Modal";
import { fetchPeriodos } from "@api/periodoService";
import debounce from "lodash/debounce"; 
import Styles from "@styles/home.module.css";

import Notification from "@components/Notification";
function HomeListClient() {
  const [asignaciones, setAsignaciones] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const Api_import_URL = `${API}/import/asignacion`;

  const fetchData = useCallback(async () => {
    try {
      const allAsignaciones = await fetchPeriodos();
    
      setAsignaciones(allAsignaciones.results);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  }, []); 

  const debouncedFetchData = debounce(fetchData, 500); 

  // const handleDelete = (pk) => {
  //     deleteEntity(`${API}/api/periodoacademico/delete`, pk, setAsignaciones, "periodoAcademicoCodigo");
  //   };
  

  const handleDelete = async (period) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar todas las asignaciones del período ${period}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API}/api/asignacionDocente/delete?period=${period}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Fallo al eliminar las asignaciones");
      }

  
      setAsignaciones((prevAsignaciones) => prevAsignaciones.filter((asig) => asig.period !== period));
      Notification.alertSuccess(`Asignaciones del período ${period} eliminadas con éxito.`);

    } catch (error) {
      setError(error.message);
      console.error("Error deleting data", error);
    }
  };

  useEffect(() => {
    debouncedFetchData(); 
    return () => {
      debouncedFetchData.cancel();
    };
  }, [debouncedFetchData]); 

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={Styles.home}>
      <Modal title="Importar Asignación">
        <ImportPage importURL={Api_import_URL} onSuccess={debouncedFetchData} />
      </Modal>
      <button
        type="button"
        className="btn btn-primary mt-5"
        data-bs-toggle="modal"
        data-bs-target="#Modal"
      >
        Nueva Asignación
      </button>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <div className={Styles.home_container}>
        <h1 className={Styles.home_title}>
          Selección de Asignación por Período
        </h1>
        {asignaciones.length === 0 ? (
          <div className={Styles.empty_asig}>
            <p className={Styles.empty_title}>No se encontraron asignaciones.</p>
            <Image
              src="/undraw_no-data_ig65.svg"
              alt="No data"
              width={400}
              height={400}
            />
          </div>
        ) : (
          asignaciones.map((asig) => (
            <div key={asig.nombre} className={Styles.home_items}>
              <Link
                className={Styles.item}
                href={`/asignacionDocente/${asig.nombre}`}
              >
                <Image
                  src="/excel-icon.png"
                  alt="Excel Icon"
                  width={32}
                  height={32}
                />
                {asig.nombre}
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

export default withAuth(HomeListClient);
