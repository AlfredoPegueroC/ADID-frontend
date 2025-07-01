"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Notification from "../Notification";
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
          fetch(`${API}api/docente`),
          fetch(`${API}api/campus`),
          fetch(`${API}api/universidad`),
          fetch(`${API}api/facultad`),
          fetch(`${API}api/escuela`),
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
        setDocentes(docentesData.results);
        setCampus(campusData.results);
        setUniversidades(universidadesData.results);
        setFacultades(facultadesData.results);
        setEscuelas(escuelasData.results);
        setPeriodos(periodosData);
        console.log("Datos cargados correctamente", periodosData);
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}api/asignacion/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log("Response:", formData);
      if (response.ok) {
        Notification.alertSuccess("Asignación creada con éxito");
        // router.push("/asignacionDocenteList"); cambiar a la lista de asignaciones
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

        <div className={Styles.name_group}>
          <label htmlFor="nrc">NRC:</label>
          <input
            type="text"
            id="nrc"
            name="nrc"
            value={formData.nrc}
            onChange={handleChange}
            required
            placeholder="Ej: 12345"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="clave">Clave:</label>
          <input
            type="text"
            id="clave"
            name="clave"
            value={formData.clave}
            onChange={handleChange}
            required
            placeholder="Ej: ASG-101"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre de la asignatura"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="codigo">Código:</label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            placeholder="Código interno"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="seccion">Sección:</label>
          <input
            type="text"
            id="seccion"
            name="seccion"
            value={formData.seccion}
            onChange={handleChange}
            placeholder="Ej: A"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="modalidad">Modalidad:</label>
          <input
            type="text"
            id="modalidad"
            name="modalidad"
            value={formData.modalidad}
            onChange={handleChange}
            placeholder="Presencial / Virtual"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="cupo">Cupo:</label>
          <input
            type="number"
            id="cupo"
            name="cupo"
            value={formData.cupo}
            onChange={handleChange}
            placeholder="Número máximo de estudiantes"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="inscripto">Inscripto:</label>
          <input
            type="number"
            id="inscripto"
            name="inscripto"
            value={formData.inscripto}
            onChange={handleChange}
            placeholder="Estudiantes inscritos"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="horario">Horario:</label>
          <input
            type="text"
            id="horario"
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            placeholder="Ej: 08:00 - 10:00 AM"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="dias">Días:</label>
          <input
            type="text"
            id="dias"
            name="dias"
            value={formData.dias}
            onChange={handleChange}
            placeholder="Ej: Lunes, Miércoles, Viernes"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="aula">Aula:</label>
          <input
            type="text"
            id="aula"
            name="aula"
            value={formData.aula}
            onChange={handleChange}
            placeholder="Número o nombre del aula"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="creditos">Créditos:</label>
          <input
            type="number"
            step="1"
            id="creditos"
            name="creditos"
            value={formData.creditos}
            onChange={handleChange}
            placeholder="Cantidad de créditos"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="tipo">Tipo:</label>
          <input
            type="text"
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            placeholder="Teórica / Práctica"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="accion">Acción:</label>
          <input
            type="text"
            id="accion"
            name="accion"
            value={formData.accion}
            onChange={handleChange}
            placeholder="Ej: Crear / Actualizar"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="usuario_registro">Usuario Registro:</label>
          <input
            type="text"
            id="usuario_registro"
            name="usuario_registro"
            value={formData.usuario_registro}
            onChange={handleChange}
            placeholder="Nombre usuario"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="docenteFk">Docente:</label>
          <select
            id="docenteFk"
            name="docenteFk"
            value={formData.docenteFk}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione un Docente --
            </option>
            {docentes.map((d) => (
              <option key={d.DocenteID} value={d.DocenteID}>
                {d.DocenteNombre} {d.DocenteApellido}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="campusFk">Campus:</label>
          <select
            id="campusFk"
            name="campusFk"
            value={formData.campusFk}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione un Campus --
            </option>
            {campus.map((c) => (
              <option key={c.CampusID} value={c.CampusID}>
                {c.CampusNombre}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="universidadFk">Universidad:</label>
          <select
            id="universidadFk"
            name="universidadFk"
            value={formData.universidadFk}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Universidad --
            </option>
            {universidades.map((u) => (
              <option key={u.UniversidadID} value={u.UniversidadID}>
                {u.UniversidadNombre}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="facultadFk">Facultad:</label>
          <select
            id="facultadFk"
            name="facultadFk"
            value={formData.facultadFk}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Facultad --
            </option>
            {facultades.map((f) => (
              <option key={f.FacultadID} value={f.FacultadID}>
                {f.FacultadNombre}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="escuelaFk">Escuela:</label>
          <select
            id="escuelaFk"
            name="escuelaFk"
            value={formData.escuelaFk}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Escuela --
            </option>
            {escuelas.map((e) => (
              <option key={e.EscuelaId} value={e.EscuelaId}>
                {e.EscuelaNombre}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="periodoFk">Periodo Académico:</label>
          <select
            id="periodoFk"
            name="periodoFk"
            value={formData.periodoFk}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione un Periodo --
            </option>
            {periodos.map((p) => (
              <option key={p.PeriodoID} value={p.PeriodoID}>
                {p.PeriodoNombre}
              </option>
            ))}
          </select>
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
