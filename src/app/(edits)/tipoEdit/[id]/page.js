"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Styles from "@styles/form.module.css";

import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";

function TipoEdit({ params }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [tipo, setTipo] = useState(null);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const tipoResponse = await fetch(
          `http://localhost:8000/api/tipodocente/${id}/`
        );
        if (!tipoResponse.ok) throw new Error("Failed to fetch tipo");
        const tipoData = await tipoResponse.json();
        setTipo(tipoData);

        const universidadesResponse = await fetch(
          "http://localhost:8000/api/universidad"
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
    if (!tipo) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/tipodocente/edit/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tipo),
        }
      );

      if (response.ok) {
        alert("Tipo updated successfully!");
        router.push("/tipodocenteList");
      } else {
        alert("Failed to update tipo.");
      }
    } catch (error) {
      console.error("Error updating tipo:", error);
      alert("An error occurred.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTipo({ ...tipo, [name]: value });
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
          <h1 className={Styles.title}>Editar Tipo</h1>

          <div className={Styles.name_group}>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={tipo.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="universidadCodigo">Universidad</label>
            <select
              id="universidadCodigo"
              name="universidadCodigo"
              value={tipo?.UniversidadCodigo || ""}
              onChange={handleChange}
              required
            >
              <option value="" >-- Seleccione --</option>
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

export default withAuth(TipoEdit);
