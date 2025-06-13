"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/test.module.css";
import Notification from "@components/Notification";

function EditCampus({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [campus, setCampus] = useState(null);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const campusRes = await fetch(`${API}api/campus/${id}/`);
        if (!campusRes.ok) throw new Error("Error cargando campus");
        const campusData = await campusRes.json();
        setCampus(campusData);
        
        const univRes = await fetch(`${API}api/universidad`);
        const universidadesData = await univRes.json();
        setUniversidades(universidadesData.results);
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, API]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!campus) return;

    try {
      const response = await fetch(`${API}api/campus/edit/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campus),
      });

      if (response.ok) {
        Notification.alertSuccess("Campus actualizado");
        router.push("/campusList");
      } else {
        Notification.alertError("Error al actualizar campus.");
      }
    } catch (err) {
      console.error("Update error:", err);
      Notification.alertError("Ocurrió un error.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampus({ ...campus, [name]: value });
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
          <h1 className={Styles.title}>Editar Campus</h1>

          <div className={Styles.name_group}>
            <label htmlFor="CampusCodigo">Código</label>
            <input
              type="text"
              id="CampusCodigo"
              name="CampusCodigo"
              value={campus?.CampusCodigo || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="CampusNombre">Nombre</label>
            <input
              type="text"
              id="CampusNombre"
              name="CampusNombre"
              value={campus?.CampusNombre || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="CampusDireccion">Dirección</label>
            <input
              type="text"
              id="CampusDireccion"
              name="CampusDireccion"
              value={campus?.CampusDireccion || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="CampusCiudad">Ciudad</label>
            <input
              type="text"
              id="CampusCiudad"
              name="CampusCiudad"
              value={campus?.CampusCiudad || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="CampusProvincia">Provincia</label>
            <input
              type="text"
              id="CampusProvincia"
              name="CampusProvincia"
              value={campus?.CampusProvincia || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="CampusPais">País</label>
            <input
              type="text"
              id="CampusPais"
              name="CampusPais"
              value={campus?.CampusPais || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="CampusTelefono">Teléfono</label>
            <input
              type="text"
              id="CampusTelefono"
              name="CampusTelefono"
              value={campus?.CampusTelefono || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="CampusCorreoContacto">Correo de Contacto</label>
            <input
              type="email"
              id="CampusCorreoContacto"
              name="CampusCorreoContacto"
              value={campus?.CampusCorreoContacto || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="Campus_UniversidadFK">Universidad</label>
            <select
              id="Campus_UniversidadFK"
              name="Campus_UniversidadFK"
              value={campus?.Campus_UniversidadFK || ""}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccione una Universidad --</option>
              {universidades.map((u) => (
                <option key={u.UniversidadID} value={u.UniversidadID}>
                  {u.UniversidadNombre}
                </option>
              ))}
            </select>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="CampusEstado">Estado</label>
            <select
              id="CampusEstado"
              name="CampusEstado"
              value={campus?.CampusEstado || ""}
              onChange={handleChange}
              required
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

export default withAuth(EditCampus);
