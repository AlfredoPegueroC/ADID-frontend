"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import Notification from "@components/Notification";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";
import { use } from "react";
function EditFacultad({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [facultad, setFacultad] = useState({
    FacultadCodigo: "",
    FacultadNombre: "",
    FacultadDecano: "",
    FacultadDireccion: "",
    FacultadTelefono: "",
    FacultadEmail: "",
    Facultad_UniversidadFK: "",
    Facultad_CampusFK: "",
    FacultadEstado: "",
  });

  const [universidades, setUniversidades] = useState([]);
  const [campusList, setCampusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  

  useEffect(() => {
    async function fetchData() {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const facultadRes = await fetch(`${API}api/facultad/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const facultadData = await facultadRes.json();
        setFacultad(facultadData);

        const univRes = await fetch(`${API}universidades`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const campusRes = await fetch(`${API}campus`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const universidadesData = await univRes.json();
        const campusData = await campusRes.json();

        setUniversidades(
          universidadesData.map((u) => ({
            label: u.UniversidadNombre,
            value: u.UniversidadID,
          }))
        );
        setCampusList(
          campusData.map((c) => ({
            label: c.CampusNombre,
            value: c.CampusID,
          }))
        );
      } catch (error) {
        Notification.alertError("Error al cargar datos.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFacultad((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setFacultad((prev) => ({
      ...prev,
      [field]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API}api/facultad/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(facultad),
      });

      if (response.ok) {
        Notification.alertSuccess("Facultad actualizada correctamente.");
        router.push("/facultadList");
      } else {
        Notification.alertError("Error al actualizar la facultad.");
      }
    } catch (err) {
      console.error("Update error:", err);
      Notification.alertError("Ocurrió un error inesperado.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Editar Facultad</h1>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadCodigo">Código</label>
          <input
            type="text"
            id="FacultadCodigo"
            value={facultad.FacultadCodigo}
            onChange={handleChange}
            required
            disabled
            placeholder="Ej: F001"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadNombre">Nombre</label>
          <input
            type="text"
            id="FacultadNombre"
            value={facultad.FacultadNombre}
            onChange={handleChange}
            required
            placeholder="Nombre de la facultad"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadDecano">Decano</label>
          <input
            type="text"
            id="FacultadDecano"
            value={facultad.FacultadDecano}
            onChange={handleChange}
            required
            placeholder="Nombre del decano"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadDireccion">Dirección</label>
          <input
            type="text"
            id="FacultadDireccion"
            value={facultad.FacultadDireccion}
            onChange={handleChange}
            required
            placeholder="Dirección completa"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadTelefono">Teléfono</label>
          <input
            type="text"
            id="FacultadTelefono"
            value={facultad.FacultadTelefono}
            onChange={handleChange}
            required
            placeholder="Ej: +1 809 123 4567"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadEmail">Email</label>
          <input
            type="email"
            id="FacultadEmail"
            value={facultad.FacultadEmail}
            onChange={handleChange}
            required
            placeholder="correo@facultad.edu"
          />
        </div>

        <div className={Styles.name_group}>
          <label>Universidad</label>
          <Select
            options={universidades}
            value={
              universidades.find(
                (u) => u.value === facultad.Facultad_UniversidadFK
              ) || null
            }
            onChange={handleSelectChange("Facultad_UniversidadFK")}
            placeholder="Seleccione una universidad"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Campus</label>
          <Select
            options={campusList}
            value={
              campusList.find((c) => c.value === facultad.Facultad_CampusFK) ||
              null
            }
            onChange={handleSelectChange("Facultad_CampusFK")}
            placeholder="Seleccione un campus"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadEstado">Estado</label>
          <select
            id="FacultadEstado"
            value={facultad.FacultadEstado}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione Estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.btn_group}>
          <button type="submit" className={Styles.btn} disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm" />{" "}
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(EditFacultad);
