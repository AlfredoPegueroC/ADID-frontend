"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";
import Notification from "@components/Notification";
function EditFacultad({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const [facultad, setFacultad] = useState(null);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function fetchData() {
      try {
        const facultadesResponse = await fetch(`${API}/api/facultad/${id}/`);
        if (!facultadesResponse.ok)
          throw new Error("Failed to fetch facultades");
        const facultadesData = await facultadesResponse.json();
        setFacultad(facultadesData);

        const universidadesResponse = await fetch(`${API}/api/universidad`);
        if (!universidadesResponse.ok)
          throw new Error("Failed to fetch universidades");
        const universidadesData = await universidadesResponse.json();
        setUniversidades(universidadesData.results);
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
    if (!facultad) return;

    try {
      const response = await fetch(`${API}/api/facultad/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(facultad),
      });

      if (response.ok) {
        Notification.alertSuccess("Facultad updated successfully!");
        router.push("/facultadList");
      } else {
        Notification.alertError("Failed to update facultad.");
      }
    } catch (error) {
      console.error("Error updating facultad:", error);
      Notification.alertError("An error occurred.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacultad({
      ...facultad,
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
          <h1 className={Styles.title}>Editar Facultad</h1>

          <div className={Styles.name_group}>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={facultad?.nombre || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="UniversidadCodigo">Universidad</label>
            <select
              id="UniversidadCodigo"
              name="UniversidadCodigo"
              value={facultad?.UniversidadCodigo || ""}
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
              value={facultad?.estado || ""}
              onChange={handleChange}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
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

export default withAuth(EditFacultad);
