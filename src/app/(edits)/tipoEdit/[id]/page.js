"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Styles from "@styles/test.module.css";
import Notification from "@components/Notification";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";

function TipoEdit({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const [tipo, setTipo] = useState(null);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const tipoResponse = await fetch(`${API}api/tipodocente/${id}/`);
        if (!tipoResponse.ok) throw new Error("Failed to fetch tipo");
        const tipoData = await tipoResponse.json();
        setTipo(tipoData);

        const universidadesResponse = await fetch(`${API}api/universidad`);
        if (!universidadesResponse.ok)
          throw new Error("Failed to fetch universidades");
        const universidadesData = await universidadesResponse.json();
        setUniversidades(universidadesData.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, API]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipo) return;

    try {
      const response = await fetch(`${API}api/tipodocente/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tipo),
      });

      if (response.ok) {
        Notification.alertSuccess("Tipo Docente Editado.");
        router.push("/tipodocenteList");
      } else {
        Notification.alertError("Fallo al Editar.");
      }
    } catch (error) {
      console.error("Error updating tipo:", error);
      Notification.alertError("Fallo al Editar.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTipo({ ...tipo, [name]: value });
  };

  if (loading) {
    return (
      <div className="spinner-container ">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <FormLayout>
      <div className={Styles.container}>
        <form onSubmit={handleSubmit} className={Styles.form}>
          <h1 className={Styles.title}>Editar Tipo Docente</h1>

          <div className={Styles.name_group}>
            <label htmlFor="TipoDocenteCodigo">Código</label>
            <input
              type="text"
              id="TipoDocenteCodigo"
              name="TipoDocenteCodigo"
              value={tipo.TipoDocenteCodigo || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="TipoDocenteDescripcion">Descripción</label>
            <input
              type="text"
              id="TipoDocenteDescripcion"
              name="TipoDocenteDescripcion"
              value={tipo.TipoDocenteDescripcion || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="TipoDocenteEstado">Estado</label>
            <select
              id="TipoDocenteEstado"
              name="TipoDocenteEstado"
              value={tipo?.TipoDocenteEstado || ""}
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
            <select
              id="TipoDocente_UniversidadFK"
              name="TipoDocente_UniversidadFK"
              value={tipo?.TipoDocente_UniversidadFK || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                -- Seleccione una Universidad --
              </option>
              {universidades.map((u) => (
                <option
                  key={u.UniversidadID}
                  value={u.UniversidadID}
                >
                  {u.UniversidadNombre}
                </option>
              ))}
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

export default withAuth(TipoEdit);
