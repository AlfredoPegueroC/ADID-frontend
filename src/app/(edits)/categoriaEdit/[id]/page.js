"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import Styles from "@styles/form.module.css";

// utils
import withAuth from "@utils/withAuth";

function CategoriaEdit({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [categoria, setCategoria] = useState(null);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(id);
    async function fetchData() {
      try {
        const categoriasResponse = await fetch(
          `${API}/api/categoriadocente/${id}/`
        );
        if (!categoriasResponse.ok)
          throw new Error("Failed to fetch categorias");
        const categoriasData = await categoriasResponse.json();
        setCategoria(categoriasData);

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
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoria) return;

    try {
      const response = await fetch(`${API}/api/categoriadocente/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria),
      });

      if (response.ok) {
        alert("Categoria updated successfully!");
        router.push("/categoriadocenteList");
      } else {
        alert("Failed to update categoria.");
      }
    } catch (error) {
      console.error("Error updating categoria:", error);
      alert("An error occurred.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoria({
      ...categoria,
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
        <form className={Styles.form} onSubmit={handleSubmit}>
          <h1>Editar Categoria</h1>

          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={categoria.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Styles.name_group}>
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={categoria?.estado || ""}
                onChange={handleChange}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="universidad">Universidad</label>
            <select
              id="UniversidadCodigo"
              name="UniversidadCodigo"
              value={categoria?.UniversidadCodigo || ""}
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

export default withAuth(CategoriaEdit);
