"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import Styles from "@styles/form.module.css";
import Notification from "@components/Notification";
import withAuth from "@utils/withAuth";

function CategoriaEdit({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [categoria, setCategoria] = useState(null);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriasResponse = await fetch(`${API}api/categoriadocente/${id}/`);
        if (!categoriasResponse.ok) throw new Error("Failed to fetch categorias");
        const categoriasData = await categoriasResponse.json();
        setCategoria(categoriasData);

        const universidadesResponse = await fetch(`${API}api/universidad`);
        if (!universidadesResponse.ok) throw new Error("Failed to fetch universidades");
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
      const response = await fetch(`${API}api/categoriadocente/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria),
      });

      if (response.ok) {
        Notification.alertSuccess("Categoría Docente editada.");
        router.push("/categoriadocenteList");
      } else {
        Notification.alertError("Fallo al editar");
      }
    } catch (error) {
      console.error("Error updating categoria:", error);
      Notification.alertError("Fallo al editar");
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
          <h1>Editar Categoría Docente</h1>

          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label htmlFor="categoriaCodigo">Código</label>
              <input
                type="text"
                id="categoriaCodigo"
                name="categoriaCodigo"
                value={categoria?.categoriaCodigo || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Styles.name_group}>
              <label htmlFor="CategoriaNombre">Nombre</label>
              <input
                type="text"
                id="CategoriaNombre"
                name="CategoriaNombre"
                value={categoria?.CategoriaNombre || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className={Styles.name_group}>
              <label htmlFor="CategoriaEstado">Estado</label>
              <select
                id="CategoriaEstado"
                name="CategoriaEstado"
                value={categoria?.CategoriaEstado || ""}
                onChange={handleChange}
                required
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="CategoriaDocente_UniversidadFK">Universidad</label>
            <select
              id="CategoriaDocente_UniversidadFK"
              name="CategoriaDocente_UniversidadFK"
              value={categoria?.Categoria_UniversidadFK|| ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                -- Seleccione una Universidad --
              </option>
              {universidades.map((u) => (
                <option key={u.UniversidadID} value={u.UniversidadID}>
                  {u.UniversidadNombre}
                </option>
              ))}
            </select>
          </div>

          {/* UsuarioRegistro solo si deseas mostrarlo */}
          <input
            type="hidden"
            name="UsuarioRegistro"
            value={categoria?.UsuarioRegistro || "admin"}
          />

          <button type="submit" className={Styles.btn}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(CategoriaEdit);
