"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Notification from "../Notification";
import Select from "react-select";
import Styles from "@styles/form.module.css";

export default function AsignacionForm({ title }) {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [docentes, setDocentes] = useState([]);
  const [campus, setCampus] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    nrc: "",
    clave: "",
    nombre: "",
    codigo: "",
    seccion: "",
    modalidad: "",
    cupo: "",
    inscripto: "",
    horario: "",
    dias: "",
    aula: "",
    creditos: "",
    tipo: "",
    accion: "",
    usuario_registro: "",
    docenteFk: "",
    campusFk: "",
    universidadFk: "",
    facultadFk: "",
    escuelaFk: "",
    periodoFk: "",
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [docenteRes, campusRes, uniRes, facRes, escRes, perRes] = await Promise.all([
          fetch(`${API}docentes`),
          fetch(`${API}campus`),
          fetch(`${API}universidades`),
          fetch(`${API}facultades`),
          fetch(`${API}escuelas`),
          fetch(`${API}periodos`),
        ]);

        if (!docenteRes.ok || !campusRes.ok || !uniRes.ok || !facRes.ok || !escRes.ok || !perRes.ok) {
          throw new Error("Error en la carga de datos");
        }

        const [docentesData, campusData, universidadesData, facultadesData, escuelasData, periodosData] = await Promise.all([
          docenteRes.json(),
          campusRes.json(),
          uniRes.json(),
          facRes.json(),
          escRes.json(),
          perRes.json(),
        ]);

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
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selected, { name }) => {
    setFormData((prev) => ({ ...prev, [name]: selected ? selected.value : "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API}api/asignacion/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Notification.alertSuccess("Asignación creada con éxito");

        setFormData({
          nrc: "",
          clave: "",
          nombre: "",
          codigo: "",
          seccion: "",
          modalidad: "",
          cupo: "",
          inscripto: "",
          horario: "",
          dias: "",
          aula: "",
          creditos: "",
          tipo: "",
          accion: "",
          usuario_registro: "",
          docenteFk: "",
          campusFk: "",
          universidadFk: "",
          facultadFk: "",
          escuelaFk: "",
          periodoFk: "",
        });
      } else {
        Notification.alertError("Error al registrar la asignación");
      }
    } catch (error) {
      Notification.alertError("Error en la conexión con la API");
    }
  };

  if (isLoading) return <div>Cargando datos...</div>;

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>{title}</h1>

        {/* Inputs normales */}
        {[
          "nrc", "clave", "nombre", "codigo", "seccion", "modalidad",
          "cupo", "inscripto", "horario", "dias", "aula",
          "creditos", "tipo", "accion", "usuario_registro"
        ].map((field) => (
          <div className={Styles.name_group} key={field}>
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={["cupo", "inscripto", "creditos"].includes(field) ? "number" : "text"}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Ingrese ${field}`}
            />
          </div>
        ))}

        {/* Selects con react-select */}
        <div className={Styles.name_group}>
          <label>Docente:</label>
          <Select
            name="docenteFk"
            options={docentes}
            value={docentes.find((d) => d.value === formData.docenteFk) || null}
            onChange={handleSelectChange}
            placeholder="Seleccione un docente"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Campus:</label>
          <Select
            name="campusFk"
            options={campus}
            value={campus.find((c) => c.value === formData.campusFk) || null}
            onChange={handleSelectChange}
            placeholder="Seleccione un campus"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Universidad:</label>
          <Select
            name="universidadFk"
            options={universidades}
            value={universidades.find((u) => u.value === formData.universidadFk) || null}
            onChange={handleSelectChange}
            placeholder="Seleccione una universidad"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Facultad:</label>
          <Select
            name="facultadFk"
            options={facultades}
            value={facultades.find((f) => f.value === formData.facultadFk) || null}
            onChange={handleSelectChange}
            placeholder="Seleccione una facultad"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Escuela:</label>
          <Select
            name="escuelaFk"
            options={escuelas}
            value={escuelas.find((e) => e.value === formData.escuelaFk) || null}
            onChange={handleSelectChange}
            placeholder="Seleccione una escuela"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Periodo Académico:</label>
          <Select
            name="periodoFk"
            options={periodos}
            value={periodos.find((p) => p.value === formData.periodoFk) || null}
            onChange={handleSelectChange}
            placeholder="Seleccione un periodo"
            isClearable
          />
        </div>

        <div className={Styles.btn_group}>
          <button type="submit" className={Styles.btn}>
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
