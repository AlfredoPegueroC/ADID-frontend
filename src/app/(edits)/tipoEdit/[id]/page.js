"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import Notification from "@components/Notification";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";
import { use } from 'react';
function TipoEdit({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [tipo, setTipo] = useState({
    TipoDocenteCodigo: "",
    TipoDocenteDescripcion: "",
    TipoDocenteEstado: "",
    TipoDocente_UniversidadFK: "",
  });

  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const tipoRes = await fetch(`${API}api/tipodocente/${id}/`);
        const tipoData = await tipoRes.json();
        setTipo(tipoData);

        const uniRes = await fetch(`${API}universidades`);
        const uniData = await uniRes.json();
        setUniversidades(
          (uniData.results || uniData).map((u) => ({
            label: u.UniversidadNombre,
            value: u.UniversidadID,
          }))
        );
      } catch (err) {
        console.error("Error:", err);
        Notification.alertError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, API]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setTipo((prev) => ({ ...prev, [id]: value }));
  };

  const handleUniversidadChange = (selectedOption) => {
    setTipo((prev) => ({
      ...prev,
      TipoDocente_UniversidadFK: selectedOption?.value || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}api/tipodocente/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tipo),
      });

      if (res.ok) {
        Notification.alertSuccess("Tipo Docente actualizado.");
        router.push("/tipodocenteList");
      } else {
        Notification.alertError("Error al actualizar.");
      }
    } catch (err) {
      console.error("Error:", err);
      Notification.alertError("Fallo al editar.");
    }
  };

  const selectedUniversidad = universidades.find(
    (u) => u.value === tipo.TipoDocente_UniversidadFK
  );

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Editar Tipo Docente</h1>

        <div className={Styles.name_group}>
          <label htmlFor="TipoDocenteCodigo">Código</label>
          <input
            type="text"
            id="TipoDocenteCodigo"
            value={tipo.TipoDocenteCodigo}
            onChange={handleChange}
            required
            placeholder="Ej: T001"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="TipoDocenteDescripcion">Descripción</label>
          <input
            type="text"
            id="TipoDocenteDescripcion"
            value={tipo.TipoDocenteDescripcion}
            onChange={handleChange}
            required
            placeholder="Ej: Docente a tiempo completo"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="TipoDocenteEstado">Estado</label>
          <select
            id="TipoDocenteEstado"
            value={tipo.TipoDocenteEstado}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione Estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="TipoDocente_UniversidadFK">Universidad</label>
          <Select
            id="TipoDocente_UniversidadFK"
            options={universidades}
            value={selectedUniversidad || null}
            onChange={handleUniversidadChange}
            placeholder="Seleccione una universidad..."
            isClearable
          />
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

export default withAuth(TipoEdit);
