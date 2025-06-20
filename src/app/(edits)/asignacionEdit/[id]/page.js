"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/test.module.css";
import Notification from "@components/Notification";
import { use } from 'react';

function AsignacionEdit({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const searchParams = useSearchParams();
  const period = searchParams.get("period");

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [asignacion, setAsignacion] = useState(null);
  const [docentes, setDocentes] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [campus, setCampus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const asignacionRes = await fetch(`${API}api/asignacion/${id}/`);
        if (!asignacionRes.ok) throw new Error("Error cargando asignación");
        const asignacionData = await asignacionRes.json();
        setAsignacion(asignacionData);

        const [docRes, facRes, escRes, campusRes] = await Promise.all([
          fetch(`${API}api/docente`),
          fetch(`${API}api/facultad`),
          fetch(`${API}api/escuela`),
          fetch(`${API}api/campus`),
        ]);

        if (!docRes.ok || !facRes.ok || !escRes.ok || !campusRes.ok) {
          throw new Error("Error cargando catálogos");
        }

        const docentesData = await docRes.json();
        const facultadesData = await facRes.json();
        const escuelasData = await escRes.json();
        const campusData = await campusRes.json();

        setDocentes(docentesData.results);
        setFacultades(facultadesData.results);
        setEscuelas(escuelasData.results);
        setCampus(campusData.results);
      } catch (error) {
        console.error(error);
        Notification.alertError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsignacion({ ...asignacion, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}api/asignacion/edit/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asignacion),
      });

      if (!res.ok) throw new Error("Fallo al actualizar");
      Notification.alertSuccess("Asignación actualizada correctamente");
      router.push(`/`);
    } catch (error) {
      console.error(error);
      Notification.alertError("Error al actualizar");
    }
  };

  if (loading || !asignacion) {
    return (
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <FormLayout>
      <div className={Styles.container}>
        <form className={Styles.form} onSubmit={handleSubmit}>
          <h1 className={Styles.title}>Editar Asignación</h1>

          <div className={Styles.names}>
            <div className={Styles.name_group}>
              <label>NRC</label>
              <input type="text" name="nrc" value={asignacion.nrc || ""} disabled />
            </div>

            <div className={Styles.name_group}>
              <label>Clave</label>
              <input type="text" name="clave" value={asignacion.clave || ""} onChange={handleChange} required />
            </div>

            <div className={Styles.name_group}>
              <label>Nombre (Asignatura)</label>
              <input type="text" name="nombre" value={asignacion.nombre || ""} onChange={handleChange} required />
            </div>

            <div className={Styles.name_group}>
              <label>Código</label>
              <input type="text" name="codigo" value={asignacion.codigo || ""} onChange={handleChange} />
            </div>

            <div className={Styles.name_group}>
              <label>Sección</label>
              <input type="text" name="seccion" value={asignacion.seccion || ""} onChange={handleChange} />
            </div>

            <div className={Styles.name_group}>
              <label>Modalidad</label>
              <input type="text" name="modalidad" value={asignacion.modalidad || ""} onChange={handleChange} />
            </div>

            <div className={Styles.name_group}>
              <label>Cupo</label>
              <input type="number" name="cupo" value={asignacion.cupo || ""} onChange={handleChange} />
            </div>

            <div className={Styles.name_group}>
              <label>Inscripto</label>
              <input type="number" name="inscripto" value={asignacion.inscripto || ""} onChange={handleChange} />
            </div>

            <div className={Styles.name_group}>
              <label>Horario</label>
              <input type="text" name="horario" value={asignacion.horario || ""} onChange={handleChange} />
            </div>

            <div className={Styles.name_group}>
              <label>Días</label>
              <input type="text" name="dias" value={asignacion.dias || ""} onChange={handleChange} />
            </div>

            <div className={Styles.name_group}>
              <label>Aula</label>
              <input type="text" name="aula" value={asignacion.aula || ""} onChange={handleChange} />
            </div>

            <div className={Styles.name_group}>
              <label>Créditos</label>
              <input type="number" name="creditos" value={asignacion.creditos || ""} onChange={handleChange} step="0.01" />
            </div>

            <div className={Styles.name_group}>
              <label>Tipo</label>
              <input type="text" name="tipo" value={asignacion.tipo || ""} onChange={handleChange} />
            </div>

            <div className={Styles.name_group}>
              <label>Acción</label>
              <select name="accion" value={asignacion.accion || "nuevo"} onChange={handleChange}>
                <option value="nuevo">Nuevo</option>
                <option value="modificado">Modificado</option>
              </select>
            </div>

            <div className={Styles.name_group}>
              <label>Docente</label>
              <select name="docenteFk" value={asignacion.docenteFk || ""} onChange={handleChange} required>
                <option value="">-- Seleccione un docente --</option>
                {docentes.map((d) => (
                  <option key={d.DocenteID} value={d.DocenteID}>
                    {d.DocenteNombre} {d.DocenteApellido}
                  </option>
                ))}
              </select>
            </div>

            <div className={Styles.name_group}>
              <label>Campus</label>
              <select name="campusFk" value={asignacion.campusFk || ""} onChange={handleChange} required>
                <option value="">-- Seleccione un campus --</option>
                {campus.map((c) => (
                  <option key={c.CampusID} value={c.CampusID}>
                    {c.CampusNombre}
                  </option>
                ))}
              </select>
            </div>

            <div className={Styles.name_group}>
              <label>Facultad</label>
              <select name="facultadFk" value={asignacion.facultadFk || ""} onChange={handleChange} required>
                <option value="">-- Seleccione una facultad --</option>
                {facultades.map((f) => (
                  <option key={f.FacultadID} value={f.FacultadID}>
                    {f.FacultadNombre}
                  </option>
                ))}
              </select>
            </div>

            <div className={Styles.name_group}>
              <label>Escuela</label>
              <select name="escuelaFk" value={asignacion.escuelaFk || ""} onChange={handleChange} required>
                <option value="">-- Seleccione una escuela --</option>
                {escuelas.map((e) => (
                  <option key={e.EscuelaId} value={e.EscuelaId}>
                    {e.EscuelaNombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className={Styles.btn}>Guardar</button>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(AsignacionEdit);

