"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Select from "react-select";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";

// Servicios importados
import { fetchDocentes } from "@api/docenteService";
import { fetchCampus } from "@api/campusService";
import { fetchUniversidades } from "@api/universidadService";
import { fetchFacultades } from "@api/facultadService";
import { fetchEscuelas } from "@api/escuelaService";
import { fetchPeriodos } from "@api/periodoService";

export default function AsignacionForm({ title }) {
  const router = useRouter();

  // Estados de opciones
  const [docentes, setDocentes] = useState([]);
  const [campus, setCampus] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  // Estados loading
  const [loadingDocentes, setLoadingDocentes] = useState(false);
  const [loadingCampus, setLoadingCampus] = useState(false);
  const [loadingUniversidades, setLoadingUniversidades] = useState(false);
  const [loadingFacultades, setLoadingFacultades] = useState(false);
  const [loadingEscuelas, setLoadingEscuelas] = useState(false);
  const [loadingPeriodos, setLoadingPeriodos] = useState(false);

  // Estado del formulario
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
    docenteFk: null,
    campusFk: null,
    universidadFk: null,
    facultadFk: null,
    escuelaFk: null,
    periodoFk: null,
  });

  // Carga inicial
  useEffect(() => {
    cargarDocentes();
    cargarCampus();
    cargarUniversidades();
    cargarFacultades();
    cargarEscuelas();
    cargarPeriodos();
  }, []);

  const cargarDocentes = async (search = "") => {
    setLoadingDocentes(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchDocentes(1, search, 10, token);
      setDocentes(results.map((d) => ({
        value: d.DocenteID,
        label: `${d.DocenteNombre} ${d.DocenteApellido}`,
      })));
    } catch (error) {
      Notification.alertError("Error al cargar docentes");
    } finally {
      setLoadingDocentes(false);
    }
  };

  const cargarCampus = async (search = "") => {
    setLoadingCampus(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchCampus(1, search, 10, token);
      setCampus(results.map((c) => ({
        value: c.CampusID,
        label: c.CampusNombre,
      })));
    } catch (error) {
      Notification.alertError("Error al cargar campus");
    } finally {
      setLoadingCampus(false);
    }
  };

  const cargarUniversidades = async (search = "") => {
    setLoadingUniversidades(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchUniversidades(1, search, 10, token);
      setUniversidades(results.map((u) => ({
        value: u.UniversidadID,
        label: u.UniversidadNombre,
      })));
    } catch (error) {
      Notification.alertError("Error al cargar universidades");
    } finally {
      setLoadingUniversidades(false);
    }
  };

  const cargarFacultades = async (search = "") => {
    setLoadingFacultades(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchFacultades(1, search, 10, token);
      setFacultades(results.map((f) => ({
        value: f.FacultadID,
        label: f.FacultadNombre,
      })));
    } catch (error) {
      Notification.alertError("Error al cargar facultades");
    } finally {
      setLoadingFacultades(false);
    }
  };

  const cargarEscuelas = async (search = "") => {
    setLoadingEscuelas(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchEscuelas(1, search, 10, token);
      setEscuelas(results.map((e) => ({
        value: e.EscuelaId,
        label: e.EscuelaNombre,
      })));
    } catch (error) {
      Notification.alertError("Error al cargar escuelas");
    } finally {
      setLoadingEscuelas(false);
    }
  };

  const cargarPeriodos = async (search = "") => {
    setLoadingPeriodos(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchPeriodos(1, search, 10, token);
      setPeriodos(results.map((p) => ({
        value: p.PeriodoID,
        label: p.PeriodoNombre,
      })));
    } catch (error) {
      Notification.alertError("Error al cargar periodos académicos");
    } finally {
      setLoadingPeriodos(false);
    }
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken") || "";

    const payload = {
      ...formData,
      docenteFk: formData.docenteFk?.value || null,
      campusFk: formData.campusFk?.value || null,
      universidadFk: formData.universidadFk?.value || null,
      facultadFk: formData.facultadFk?.value || null,
      escuelaFk: formData.escuelaFk?.value || null,
      periodoFk: formData.periodoFk?.value || null,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}api/asignacion/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Notification.alertSuccess("Asignación registrada con éxito");
        router.push("/");
      } else {
        Notification.alertError("Error al registrar asignación");
      }
    } catch (err) {
      Notification.alertError("Error de conexión: " + err.message);
    }
  };

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>{title}</h1>

        {[
          "nrc", "clave", "nombre", "codigo", "seccion", "modalidad",
          "cupo", "inscripto", "horario", "dias", "aula",
          "creditos", "tipo"
        ].map((field) => (
          <div className={Styles.name_group} key={field}>
            <label htmlFor={field}>{field.toUpperCase()}:</label>
            <input
              type={["cupo", "inscripto", "creditos"].includes(field) ? "number" : "text"}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Ingrese ${field}`}
              required
            />
          </div>
        ))}

        {/* Selects */}
        <div className={Styles.name_group}>
          <label>Docente:</label>
          <Select
            name="docenteFk"
            options={docentes}
            value={formData.docenteFk}
            onChange={handleSelectChange}
            onInputChange={(inputValue) => {
              if (typeof inputValue === "string") {
                cargarDocentes(inputValue.replace(/\s/g, ""));
              }
            }}
            isLoading={loadingDocentes}
            placeholder="Seleccione docente"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Campus:</label>
          <Select
            name="campusFk"
            options={campus}
            value={formData.campusFk}
            onChange={handleSelectChange}
            onInputChange={(inputValue) => {
              if (typeof inputValue === "string") {
                cargarCampus(inputValue.replace(/\s/g, ""));
              }
            }}
            isLoading={loadingCampus}
            placeholder="Seleccione campus"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Universidad:</label>
          <Select
            name="universidadFk"
            options={universidades}
            value={formData.universidadFk}
            onChange={handleSelectChange}
            onInputChange={(inputValue) => {
              if (typeof inputValue === "string") {
                cargarUniversidades(inputValue.replace(/\s/g, ""));
              }
            }}
            isLoading={loadingUniversidades}
            placeholder="Seleccione universidad"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Facultad:</label>
          <Select
            name="facultadFk"
            options={facultades}
            value={formData.facultadFk}
            onChange={handleSelectChange}
            onInputChange={(inputValue) => {
              if (typeof inputValue === "string") {
                cargarFacultades(inputValue.replace(/\s/g, ""));
              }
            }}
            isLoading={loadingFacultades}
            placeholder="Seleccione facultad"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Escuela:</label>
          <Select
            name="escuelaFk"
            options={escuelas}
            value={formData.escuelaFk}
            onChange={handleSelectChange}
            onInputChange={(inputValue) => {
              if (typeof inputValue === "string") {
                cargarEscuelas(inputValue.replace(/\s/g, ""));
              }
            }}
            isLoading={loadingEscuelas}
            placeholder="Seleccione escuela"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Periodo Académico:</label>
          <Select
            name="periodoFk"
            options={periodos}
            value={formData.periodoFk}
            onChange={handleSelectChange}
            onInputChange={(inputValue) => {
              if (typeof inputValue === "string") {
                cargarPeriodos(inputValue.replace(/\s/g, ""));
              }
            }}
            isLoading={loadingPeriodos}
            placeholder="Seleccione periodo"
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
