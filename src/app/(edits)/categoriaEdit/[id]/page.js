"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import Styles from "@styles/form.module.css";
import Notification from "@components/Notification";
import withAuth from "@utils/withAuth";
import Select from "react-select";

function CategoriaEdit({ params }) {
  const router = useRouter();
  const { id } = params;
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [categoria, setCategoria] = useState({
    categoriaCodigo: "",
    CategoriaNombre: "",
    CategoriaEstado: "",
    Categoria_UniversidadFK: "",
    UsuarioRegistro: "admin",
  });

  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const catRes = await fetch(`${API}api/categoriadocente/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const univRes = await fetch(`${API}universidades`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!catRes.ok || !univRes.ok) throw new Error("Error al cargar los datos.");

        const catData = await catRes.json();
        const univData = await univRes.json();

        setCategoria(catData);
        setUniversidades(
          univData.map((u) => ({
            label: u.UniversidadNombre,
            value: u.UniversidadID,
          }))
        );
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

  const handleSelectChange = (selectedOption) => {
    setCategoria((prev) => ({
      ...prev,
      Categoria_UniversidadFK: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${API}api/categoriadocente/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
    } finally {
      setSubmitting(false);
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
              disabled
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
            <label>Universidad</label>
            <Select
              options={universidades}
              value={
                universidades.find((u) => u.value === categoria.Categoria_UniversidadFK) || null
              }
              onChange={handleSelectChange}
              placeholder="Seleccione una universidad"
              isClearable
            />
          </div>

          <div className={Styles.btn_group}>
            <button type="submit" className={Styles.btn} disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(CategoriaEdit);
