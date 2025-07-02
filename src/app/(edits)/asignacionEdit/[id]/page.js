"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css"; // Usé el mismo CSS que el primero
import Notification from "@components/Notification";
import Select from "react-select";

function AsignacionEdit({ params }) {
  const router = useRouter();
  const { id } = params;
  const searchParams = useSearchParams();
  const period = searchParams.get("period");

  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [asignacion, setAsignacion] = useState(null);
  const [docentes, setDocentes] = useState([]);
  const [campus, setCampus] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [
          asignacionRes,
          docenteRes,
          campusRes,
          uniRes,
          facRes,
          escRes,
          perRes,
        ] = await Promise.all([
          fetch(`${API}api/asignacion/${id}/`),
          fetch(`${API}docentes`),
          fetch(`${API}campus`),
          fetch(`${API}universidades`),
          fetch(`${API}facultades`),
          fetch(`${API}escuelas`),
          fetch(`${API}periodos`),
        ]);

        if (
          !asignacionRes.ok ||
          !docenteRes.ok ||
          !campusRes.ok ||
          !uniRes.ok ||
          !facRes.ok ||
          !escRes.ok ||
          !perRes.ok
        ) {
          throw new Error("Error en la carga de datos");
        }

        const [
          asignacionData,
          docentesData,
          campusData,
          universidadesData,
          facultadesData,
          escuelasData,
          periodosData,
        ] = await Promise.all([
          asignacionRes.json(),
          docenteRes.json(),
          campusRes.json(),
          uniRes.json(),
          facRes.json(),
          escRes.json(),
          perRes.json(),
        ]);

        setAsignacion(asignacionData);

        setDocentes((docentesData.results || docentesData).map((d) => ({
          value: d.DocenteID,
          label: `${d.DocenteNombre} ${d.DocenteApellido}`,
        })));
        setCampus((campusData.results || campusData).map((c) => ({
          value: c.CampusID,
          label: c.CampusNombre,
        })));
        setUniversidades((universidadesData.results || universidadesData).map((u) => ({
          value: u.UniversidadID,
          label: u.UniversidadNombre,
        })));
        setFacultades((facultadesData.results || facultadesData).map((f) => ({
          value: f.FacultadID,
          label: f.FacultadNombre,
        })));
        setEscuelas((escuelasData.results || escuelasData).map((e) => ({
          value: e.EscuelaId,
          label: e.EscuelaNombre,
        })));
        setPeriodos((periodosData.results || periodosData).map((p) => ({
          value: p.PeriodoID,
          label: p.PeriodoNombre,
        })));
      } catch (error) {
        Notification.alertError("Error al cargar los datos. Ya existe o faltan datos.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, API]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsignacion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selected, { name }) => {
    setAsignacion((prev) => ({
      ...prev,
      [name]: selected ? selected.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}api/asignacion/edit/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asignacion),
      });

      if (response.ok) {
        Notification.alertSuccess("Asignación actualizada con éxito");

        router.push(`/`);
      } else {
        Notification.alertError("Error al actualizar la asignación");
      }
    } catch (error) {
      Notification.alertError("Error en la conexión con la API");
      console.error(error);
    }
  };

  if (isLoading) return <div>Cargando datos...</div>;
  if (!asignacion) return <div>No se encontró la asignación</div>;

  // Lista de inputs normales para mapear
  const inputFields = [
    "nrc",
    "clave",
    "nombre",
    "codigo",
    "seccion",
    "modalidad",
    "cupo",
    "inscripto",
    "horario",
    "dias",
    "aula",
    "creditos",
    "tipo",
    "accion",
    "usuario_registro",
  ];

  return (
    <FormLayout>
      <div className={Styles.container}>
        <form onSubmit={handleSubmit} className={Styles.form}>
          <h1 className={Styles.title}>Editar Asignación</h1>

          {/* Inputs normales */}
          {inputFields.map((field) => (
            <div className={Styles.name_group} key={field}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>

              {/* Acción debe ser select */}
              {field === "accion" ? (
                <select name="accion" value={asignacion.accion || "nuevo"} onChange={handleChange}>
                  <option value="nuevo">Nuevo</option>
                  <option value="modificado">Modificado</option>
                </select>
              ) : (
                <input
                  type={["cupo", "inscripto", "creditos"].includes(field) ? "number" : "text"}
                  id={field}
                  name={field}
                  value={asignacion[field] || ""}
                  onChange={handleChange}
                  placeholder={`Ingrese ${field}`}
                  disabled={field === "nrc"} // Bloqueamos NRC igual que antes
                />
              )}
            </div>
          ))}

          {/* Selects con react-select */}
          <div className={Styles.name_group}>
            <label>Docente:</label>
            <Select
              name="docenteFk"
              options={docentes}
              value={docentes.find((d) => d.value === asignacion.docenteFk) || null}
              onChange={handleSelectChange}
              placeholder="Seleccione un docente"
              isClearable
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label>Campus:</label>
            <Select
              name="campusFk"
              options={campus}
              value={campus.find((c) => c.value === asignacion.campusFk) || null}
              onChange={handleSelectChange}
              placeholder="Seleccione un campus"
              isClearable
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label>Universidad:</label>
            <Select
              name="universidadFk"
              options={universidades}
              value={universidades.find((u) => u.value === asignacion.universidadFk) || null}
              onChange={handleSelectChange}
              placeholder="Seleccione una universidad"
              isClearable
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label>Facultad:</label>
            <Select
              name="facultadFk"
              options={facultades}
              value={facultades.find((f) => f.value === asignacion.facultadFk) || null}
              onChange={handleSelectChange}
              placeholder="Seleccione una facultad"
              isClearable
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label>Escuela:</label>
            <Select
              name="escuelaFk"
              options={escuelas}
              value={escuelas.find((e) => e.value === asignacion.escuelaFk) || null}
              onChange={handleSelectChange}
              placeholder="Seleccione una escuela"
              isClearable
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label>Periodo Académico:</label>
            <Select
              name="periodoFk"
              options={periodos}
              value={periodos.find((p) => p.value === asignacion.periodoFk) || null}
              onChange={handleSelectChange}
              placeholder="Seleccione un periodo"
              isClearable
              required
            />
          </div>

          <div className={Styles.btn_group}>
            <button type="submit" className={Styles.btn}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(AsignacionEdit);
