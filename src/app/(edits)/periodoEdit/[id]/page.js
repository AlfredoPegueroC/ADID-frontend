"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";
import Notification from "@components/Notification";
function EditPeriodo({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const [periodo, setperiodo] = useState(null);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchData() {
      try {
        const periodoesResponse = await fetch(
          `${API}/api/periodoacademico/${id}/`
        );
        if (!periodoesResponse.ok) throw new Error("Failed to fetch periodoes");
        const periodoesData = await periodoesResponse.json();
        setperiodo(periodoesData);

        const universidadesResponse = await fetch(`${API}/api/universidad`);
        if (!universidadesResponse.ok)
          throw new Error("Failed to fetch universidades");
        const universidadesData = await universidadesResponse.json();
        setUniversidades(universidadesData.results); // results es donde esta el contenido del json
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, API]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!periodo) return;

    try {
      const response = await fetch(`${API}/api/periodoacademico/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(periodo),
      });

      if (response.ok) {
        Notification.alertSuccess("periodo Academico Editado.");
        router.push("/periodoList");
      } else {
        Notification.alertError("Falla al Editar.");
      }
    } catch (error) {
      console.error("Error updating periodo:", error);
      Notification.alertError("Falla al Editar.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setperiodo({
      ...periodo,
      [name]: value,
    });
  };

  if (loading) {
    return (
      <div className="spinner-container ">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <FormLayout>
      <div className={Styles.container}>
        <form onSubmit={handleSubmit} className={Styles.form}>
          <h1 className={Styles.title}>Editar Periodo</h1>

          <div className={Styles.name_group}>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={periodo?.nombre || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="UniversidadCodigo">Universidad</label>
            <select
              id="UniversidadCodigo"
              name="UniversidadCodigo"
              value={periodo?.UniversidadCodigo || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                -- Seleccione una Universidad --
              </option>
              {universidades.map((universidad) => (
                <option
                  key={universidad.UniversidadCodigo}
                  value={universidad.UniversidadCodigo}
                >
                  {universidad.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={periodo?.estado || ""}
              onChange={handleChange}
            >
              <option value="Abierto">Abierto</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>

          <button type="submit" className={Styles.btn}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(EditPeriodo);
