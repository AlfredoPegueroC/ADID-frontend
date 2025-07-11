"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "@utils/withAuth";
import Notification from "@components/Notification";
import Styles from "@styles/form.module.css";
import Select from "react-select";
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
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    async function fetchData() {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const escuelaResponse = await fetch(`${API}api/escuela/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const facultadesResponse = await fetch(`${API}facultades`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const universidadesResponse = await fetch(`${API}universidades`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!escuelaResponse.ok || !facultadesResponse.ok || !universidadesResponse.ok)
          throw new Error("Error fetching data");

        const escuelaData = await escuelaResponse.json();
        const facultadesData = await facultadesResponse.json();
        const universidadesData = await universidadesResponse.json();

        setEscuela(escuelaData);

        setFacultades(
          facultadesData.map((f) => ({ label: f.FacultadNombre, value: f.FacultadID }))
        );

        setUniversidades(
          universidadesData.map((u) => ({ label: u.UniversidadNombre, value: u.UniversidadID }))
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
    setEscuela((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setEscuela((prev) => ({
      ...prev,
      [field]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API}api/escuela/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
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
    } finally {
      setSubmitting(false);
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
            disabled
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
          <label>Universidad</label>
          <Select
            options={universidades}
            value={universidades.find((u) => u.value === escuela.Escuela_UniversidadFK) || null}
            onChange={handleSelectChange("Escuela_UniversidadFK")}
            placeholder="Seleccione una universidad"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Facultad</label>
          <Select
            options={facultades}
            value={facultades.find((f) => f.value === escuela.Escuela_facultadFK) || null}
            onChange={handleSelectChange("Escuela_facultadFK")}
            placeholder="Seleccione una facultad"
            isClearable
          />
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
          <button type="submit" className={Styles.btn} disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(EditEscuela);
