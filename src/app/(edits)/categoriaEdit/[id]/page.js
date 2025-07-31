"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";
import Notification from "@components/Notification";
import AsyncSelect from "react-select/async";

import { fetchUniversidades } from "@api/universidadService";

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

  const [selectedUniversidad, setSelectedUniversidad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCategoria() {
      setLoading(true);
      const token = localStorage.getItem("accessToken") || "";
      try {
        const res = await fetch(`${API}api/categoriadocente/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar categoría");
        const data = await res.json();

        // Obtener código universidad (puede venir como objeto o string)
        const universidadCodigo =
          typeof data.universidadCodigo === "object"
            ? data.universidadCodigo
            : data.universidadCodigo;

        setCategoria({ ...data, universidadCodigo });

        if (universidadCodigo) {
          // Obtener nombre universidad con fetch para mostrar label en select
          const resUni = await fetch(`${API}api/universidad/${universidadCodigo}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!resUni.ok) throw new Error("Universidad no encontrada");
          const dataUni = await resUni.json();

          setSelectedUniversidad({
            value: dataUni.UniversidadID,
            label: dataUni.UniversidadNombre || "Sin nombre",
          });
        } else {
          setSelectedUniversidad(null);
        }
      } catch (error) {
        console.error(error);
        Notification.alertError("Error al cargar datos de categoría.");
      } finally {
        setLoading(false);
      }
    }
    fetchCategoria();
  }, [id, API]);

  const loadUniversidades = useCallback(
    async (inputValue) => {
      const token = localStorage.getItem("accessToken") || "";
      try {
        const { results } = await fetchUniversidades(1, inputValue, 10, token);
        return results.map((u) => ({
          value: u.UniversidadID,
          label: u.UniversidadNombre,
        }));
      } catch (error) {
        console.error("Error al cargar universidades:", error);
        Notification.alertError("No se pudieron cargar las universidades");
        return [];
      }
    },
    []
  );

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCategoria((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setCategoria((prev) => ({
      ...prev,
      Categoria_UniversidadFK: selectedOption ? selectedOption.value : "",
    }));
    setSelectedUniversidad(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("accessToken") || "";

    try {
      const res = await fetch(`${API}api/categoriadocente/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoria),
      });

      if (res.ok) {
        Notification.alertSuccess("Categoría Docente actualizada.");
        router.push("/categoriadocenteList");
      } else {
        Notification.alertError("Error al actualizar la categoría.");
      }
    } catch (error) {
      console.error(error);
      Notification.alertError("Error inesperado.");
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
        <form onSubmit={handleSubmit} className={Styles.form}>
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
              placeholder="Código categoría"
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
              placeholder="Nombre de la categoría"
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
              <option value="">-- Seleccione Estado --</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className={Styles.name_group}>
            <label>Universidad</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadUniversidades}
              value={selectedUniversidad}
              onChange={handleSelectChange}
              placeholder="Seleccione una universidad"
              isClearable
              noOptionsMessage={() => "Escribe para buscar universidades"}
              menuPlacement="auto"
              inputId="Categoria_UniversidadFK"
              name="Categoria_UniversidadFK"
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
