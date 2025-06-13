"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "@styles/test.module.css";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Notification from "@components/Notification";

function EditUniversidad({ params }) {
  const router = useRouter();
  const { id } = React.use(params); // ⚠️ <-- Esto está mal. Usa: const { id } = params;

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const [universidad, setUniversidad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}api/universidad/${id}/`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch");
        return response.json();
      })
      .then((data) => {
        setUniversidad(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching universidad details:", error);
        setError("No se pudo cargar la universidad.");
        setLoading(false);
      });
  }, [id, API]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!universidad) return;

    try {
      const response = await fetch(`${API}api/universidad/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(universidad),
      });

      if (response.ok) {
        Notification.alertSuccess("Universidad Editada.");
        router.push("/universidadList");
      } else {
        Notification.alertError("Fallo al editar.");
      }
    } catch (error) {
      console.error("Error updating universidad:", error);
      Notification.alertError("Ocurrió un error.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUniversidad({ ...universidad, [name]: value });
  };

  if (loading || !universidad) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <FormLayout className={Styles.container}>
      <div className={Styles.container}>
        <form onSubmit={handleSubmit} className={Styles.form}>
          <h1 className={Styles.title}>Editar Universidad</h1>

          <div className={Styles.name_group}>
            <label htmlFor="UniversidadCodigo">Código</label>
            <input
              type="text"
              id="UniversidadCodigo"
              name="UniversidadCodigo"
              value={universidad.UniversidadCodigo}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="UniversidadNombre">Nombre</label>
            <input
              type="text"
              id="UniversidadNombre"
              name="UniversidadNombre"
              value={universidad.UniversidadNombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="UniversidadDireccion">Dirección</label>
            <input
              type="text"
              id="UniversidadDireccion"
              name="UniversidadDireccion"
              value={universidad.UniversidadDireccion}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="UniversidadTelefono">Teléfono</label>
            <input
              type="text"
              id="UniversidadTelefono"
              name="UniversidadTelefono"
              value={universidad.UniversidadTelefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="UniversidadEmail">Correo</label>
            <input
              type="email"
              id="UniversidadEmail"
              name="UniversidadEmail"
              value={universidad.UniversidadEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="UniversidadSitioWeb">Sitio Web</label>
            <input
              type="text"
              id="UniversidadSitioWeb"
              name="UniversidadSitioWeb"
              value={universidad.UniversidadSitioWeb}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="UniversidadRector">Rector</label>
            <input
              type="text"
              id="UniversidadRector"
              name="UniversidadRector"
              value={universidad.UniversidadRector}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="UniversidadEstado">Estado</label>
            <select
              id="UniversidadEstado"
              name="UniversidadEstado"
              value={universidad.UniversidadEstado}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccione --</option>
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

export default withAuth(EditUniversidad);
