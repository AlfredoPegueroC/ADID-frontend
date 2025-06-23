"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import Styles from "@styles/form.module.css"; // Estilo estandarizado
import Notification from "@components/Notification";
import withAuth from "@utils/withAuth";
import { use } from 'react';
function CategoriaEdit({ params }) {
  const router = useRouter();
  const { id } = use(params) ;
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [categoria, setCategoria] = useState({
    categoriaCodigo: "",
    CategoriaNombre: "",
    CategoriaEstado: "",
    CategoriaDocente_UniversidadFK: "",
    UsuarioRegistro: "admin",
  });

  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const catRes = await fetch(`${API}api/categoriadocente/${id}/`);
        if (!catRes.ok) throw new Error("Error al cargar categoría.");
        const catData = await catRes.json();
        setCategoria(catData);

        const univRes = await fetch(`${API}universidades`);
        if (!univRes.ok) throw new Error("Error al cargar universidades.");
        const univData = await univRes.json();
        setUniversidades(univData);
      } catch (error) {
        console.error("Error:", error);
        Notification.alertError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCategoria((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        Notification.alertError("Fallo al editar.");
      }
    } catch (error) {
      console.error("Error updating categoria:", error);
      Notification.alertError("Fallo al editar.");
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <FormLayout>
      <div className={Styles.container}>
        <form className={Styles.form} onSubmit={handleSubmit}>
          <h1 className={Styles.title}>Editar Categoría Docente</h1>

          <div className={Styles.name_group}>
            <label htmlFor="categoriaCodigo">Código</label>
            <input
              type="text"
              id="categoriaCodigo"
              value={categoria.categoriaCodigo || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="CategoriaNombre">Nombre</label>
            <input
              type="text"
              id="CategoriaNombre"
              value={categoria.CategoriaNombre || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="CategoriaEstado">Estado</label>
            <select
              id="CategoriaEstado"
              value={categoria.CategoriaEstado || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione Estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="Categoria_UniversidadFK">Universidad</label>
            <select
              id="Categoria_UniversidadFK"
              value={categoria.Categoria_UniversidadFK || ""}
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

          

          <div className={Styles.btn_group}>
            <button type="submit" className={Styles.btn}>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(CategoriaEdit);
