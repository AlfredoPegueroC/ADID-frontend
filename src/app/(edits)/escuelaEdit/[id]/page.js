"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Notification from "@components/Notification";
import Styles from "@styles/form.module.css"; // ✅ hoja de estilos estándar
import { use } from 'react';

function EditEscuela({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [escuela, setEscuela] = useState({
    EscuelaCodigo: "",
    EscuelaNombre: "",
    EscuelaDirectora: "",
    EscuelaTelefono: "",
    EscuelaCorreo: "",
    Escuela_UniversidadFK: "",
    Escuela_facultadFK: "",
    EscuelaEstado: "",
  });

  const [facultades, setFacultades] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const escuelaResponse = await fetch(`${API}api/escuela/${id}/`);
        const facultadesResponse = await fetch(`${API}facultades`);
        const universidadesResponse = await fetch(`${API}universidades`);

        if (!escuelaResponse.ok || !facultadesResponse.ok || !universidadesResponse.ok)
          throw new Error("Error fetching data");

        const escuelaData = await escuelaResponse.json();
        const facultadesData = await facultadesResponse.json();
        const universidadesData = await universidadesResponse.json();

        setEscuela(escuelaData);
        setFacultades(facultadesData);
        setUniversidades(universidadesData);
      } catch (error) {
        console.error("Error:", error);
        Notification.alertError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, API]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEscuela((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}api/escuela/edit/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(escuela),
      });

      if (response.ok) {
        Notification.alertSuccess("Escuela editada exitosamente.");
        router.push("/escuelaList");
      } else {
        Notification.alertError("Fallo al editar la escuela.");
      }
    } catch (error) {
      console.error("Error:", error);
      Notification.alertError("Fallo al editar la escuela.");
    }
  };

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Editar Escuela</h1>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaCodigo">Código</label>
          <input
            type="text"
            id="EscuelaCodigo"
            value={escuela.EscuelaCodigo}
            onChange={handleChange}
            required
            placeholder="Ej: ESC123"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaNombre">Nombre</label>
          <input
            type="text"
            id="EscuelaNombre"
            value={escuela.EscuelaNombre}
            onChange={handleChange}
            required
            placeholder="Nombre de la escuela"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaDirectora">Directora</label>
          <input
            type="text"
            id="EscuelaDirectora"
            value={escuela.EscuelaDirectora}
            onChange={handleChange}
            required
            placeholder="Nombre completo de la directora"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaTelefono">Teléfono</label>
          <input
            type="text"
            id="EscuelaTelefono"
            value={escuela.EscuelaTelefono}
            onChange={handleChange}
            required
            placeholder="Ej: +1 809 123 4567"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaCorreo">Correo</label>
          <input
            type="email"
            id="EscuelaCorreo"
            value={escuela.EscuelaCorreo}
            onChange={handleChange}
            required
            placeholder="correo@escuela.edu"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Escuela_UniversidadFK">Universidad</label>
          <select
            id="Escuela_UniversidadFK"
            value={escuela.Escuela_UniversidadFK}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una universidad</option>
            {universidades.map((u) => (
              <option key={u.UniversidadID} value={u.UniversidadID}>
                {u.UniversidadNombre}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Escuela_facultadFK">Facultad</label>
          <select
            id="Escuela_facultadFK"
            value={escuela.Escuela_facultadFK}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una facultad</option>
            {facultades.map((f) => (
              <option key={f.FacultadID} value={f.FacultadID}>
                {f.FacultadNombre}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaEstado">Estado</label>
          <select
            id="EscuelaEstado"
            value={escuela.EscuelaEstado}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione estado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.btn_group}>
          <button type="submit" className={Styles.btn}>
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(EditEscuela);
