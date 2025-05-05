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
  const [campusList, setCampusList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const facultadRes = await fetch(`${API}api/facultad/${id}/`);
        if (!facultadRes.ok) throw new Error("Error cargando facultad");
        const facultadData = await facultadRes.json();
        setFacultad(facultadData);

        const univRes = await fetch(`${API}api/universidad`);
        const campusRes = await fetch(`${API}api/campus`);
        const universidadesData = await univRes.json();
        const campusData = await campusRes.json();

        setUniversidades(universidadesData.results);
        setCampusList(campusData.results);
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
    if (!facultad) return;

    try {
      const response = await fetch(`${API}api/facultad/edit/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(facultad),
      });

      if (response.ok) {
        Notification.alertSuccess("Facultad actualizada");
        router.push("/facultadList");
      } else {
        Notification.alertError("Error al actualizar facultad.");
      }
    } catch (err) {
      console.error("Update error:", err);
      Notification.alertError("Ocurrió un error.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacultad({ ...facultad, [name]: value });
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
          <h1 className={Styles.title}>Editar Facultad</h1>

          <div className={Styles.name_group}>
            <label htmlFor="FacultadCodigo">Código</label>
            <input
              type="text"
              id="FacultadCodigo"
              name="FacultadCodigo"
              value={facultad?.FacultadCodigo || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="FacultadNombre">Nombre</label>
            <input
              type="text"
              id="FacultadNombre"
              name="FacultadNombre"
              value={facultad?.FacultadNombre || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="FacultadDecano">Decano</label>
            <input
              type="text"
              id="FacultadDecano"
              name="FacultadDecano"
              value={facultad?.FacultadDecano || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="FacultadDireccion">Dirección</label>
            <input
              type="text"
              id="FacultadDireccion"
              name="FacultadDireccion"
              value={facultad?.FacultadDireccion || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="FacultadTelefono">Teléfono</label>
            <input
              type="text"
              id="FacultadTelefono"
              name="FacultadTelefono"
              value={facultad?.FacultadTelefono || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="FacultadEmail">Email</label>
            <input
              type="email"
              id="FacultadEmail"
              name="FacultadEmail"
              value={facultad?.FacultadEmail || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="Facultad_UniversidadFK">Universidad</label>
            <select
              id="Facultad_UniversidadFK"
              name="Facultad_UniversidadFK"
              value={facultad?.Facultad_UniversidadFK || ""}
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
            <label htmlFor="Facultad_CampusFK">Campus</label>
            <select
              id="Facultad_CampusFK"
              name="Facultad_CampusFK"
              value={facultad?.Facultad_CampusFK || ""}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccione un Campus --</option>
              {campusList.map((c) => (
                <option key={c.CampusID} value={c.CampusID}>
                  {c.CampusNombre}
                </option>
              ))}
            </select>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="FacultadEstado">Estado</label>
            <select
              id="FacultadEstado"
              name="FacultadEstado"
              value={facultad?.FacultadEstado || ""}
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

export default withAuth(EditFacultad);
