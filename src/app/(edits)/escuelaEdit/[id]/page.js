"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";


function EditEscuela({ params }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [escuela, setEscuela] = useState(null);
  const [facultades, setFacultades] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    async function fetchData() {
      try {
        const escuelaResponse = await fetch(
          `${API}/api/escuela/${id}/`
        );
        if (!escuelaResponse.ok) throw new Error("Failed to fetch escuela");
        const escuelaData = await escuelaResponse.json();
        setEscuela(escuelaData);

        const facultadesResponse = await fetch(
          `${API}/api/facultad`
        );
        if (!facultadesResponse.ok)
          throw new Error("Failed to fetch facultades");
        const facultadesData = await facultadesResponse.json();
        setFacultades(facultadesData.results);

        const universidadesResponse = await fetch(
          `${API}/api/universidad`
        );
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
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!escuela) return;

    try {
      const response = await fetch(
        `${API}/api/escuela/edit/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(escuela),
        }
      );

      if (response.ok) {
        alert("Escuela updated successfully!");
        router.push("/escuelaList");
      } else {
        alert("Failed to update escuela.");
      }
    } catch (error) {
      console.error("Error updating escuela:", error);
      alert("An error occurred.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEscuela({
      ...escuela,
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
          <h1 className={Styles.title}>Editar Escuela</h1>

          <div className={Styles.name_group}>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={escuela.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="facultadCodigo">Facultad</label>
            <select
              id="facultadCodigo"
              name="facultadCodigo"
              value={escuela.facultadCodigo}
              onChange={handleChange}
            >
              <option value="">Seleccione una facultad</option>
              {facultades.map((facultad) => (
                <option
                  key={facultad.facultadCodigo}
                  value={facultad.facultadCodigo}
                >
                  {facultad.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="UniversidadCodigo">Universidad</label>
            <select
              id="UniversidadCodigo"
              name="UniversidadCodigo"
              value={escuela?.UniversidadCodigo || ""}
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

          <button type="submit" className={Styles.btn}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(EditEscuela);
