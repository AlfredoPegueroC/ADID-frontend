"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/test.module.css";
import Notification from "@components/Notification";

// ... (importaciones)

function EditEscuela({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const [escuela, setEscuela] = useState(null);
  const [facultades, setFacultades] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const escuelaResponse = await fetch(`${API}api/escuela/${id}/`);
        const facultadesResponse = await fetch(`${API}api/facultad`);
        const universidadesResponse = await fetch(`${API}api/universidad`);

        if (!escuelaResponse.ok || !facultadesResponse.ok || !universidadesResponse.ok)
          throw new Error("Error fetching data");

        setEscuela(await escuelaResponse.json());
        setFacultades((await facultadesResponse.json()).results);
        setUniversidades((await universidadesResponse.json()).results);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, API]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!escuela) return;

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEscuela({ ...escuela, [name]: value });
  };

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <FormLayout>
      <div className={Styles.container}>
        <form onSubmit={handleSubmit} className={Styles.form}>
          <h1 className={Styles.title}>Editar Escuela</h1>

          <div className={Styles.name_group}>
            <label htmlFor="EscuelaCodigo">Código</label>
            <input type="text" id="EscuelaCodigo" name="EscuelaCodigo" value={escuela?.EscuelaCodigo || ""} onChange={handleChange} required />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="EscuelaNombre">Nombre</label>
            <input type="text" id="EscuelaNombre" name="EscuelaNombre" value={escuela?.EscuelaNombre || ""} onChange={handleChange} required />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="EscuelaDirectora">Directora</label>
            <input type="text" id="EscuelaDirectora" name="EscuelaDirectora" value={escuela?.EscuelaDirectora || ""} onChange={handleChange} required />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="EscuelaTelefono">Teléfono</label>
            <input type="text" id="EscuelaTelefono" name="EscuelaTelefono" value={escuela?.EscuelaTelefono || ""} onChange={handleChange} required />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="EscuelaCorreo">Correo</label>
            <input type="email" id="EscuelaCorreo" name="EscuelaCorreo" value={escuela?.EscuelaCorreo || ""} onChange={handleChange} required />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="Escuela_UniversidadFK">Universidad</label>
            <select id="Escuela_UniversidadFK" name="Escuela_UniversidadFK" value={escuela?.Escuela_UniversidadFK || ""} onChange={handleChange} required>
              <option value="">Seleccione una universidad</option>
              {universidades.map((u) => (
                <option key={u.UniversidadID} value={u.UniversidadID}>{u.UniversidadNombre}</option>
              ))}
            </select>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="Escuela_facultadFK">Facultad</label>
            <select id="Escuela_facultadFK" name="Escuela_facultadFK" value={escuela?.Escuela_facultadFK || ""} onChange={handleChange} required>
              <option value="">Seleccione una facultad</option>
              {facultades.map((f) => (
                <option key={f.FacultadID} value={f.FacultadID}>{f.FacultadNombre}</option>
              ))}
            </select>
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="EscuelaEstado">Estado</label>
            <select id="EscuelaEstado" name="EscuelaEstado" value={escuela?.EscuelaEstado || ""} onChange={handleChange}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <button type="submit" className={Styles.btn}>Guardar Cambios</button>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(EditEscuela);
