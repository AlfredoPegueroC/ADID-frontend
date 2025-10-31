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
import { fetchAsignaturas } from "@api/asignaturaService";
export default function AsignacionForm({ title }) {
  const router = useRouter();

  // Estados de opciones
  const [docentes, setDocentes] = useState([]);
  const [campus, setCampus] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);

  // Estados loading
  const [loadingDocentes, setLoadingDocentes] = useState(false);
  const [loadingCampus, setLoadingCampus] = useState(false);
  const [loadingUniversidades, setLoadingUniversidades] = useState(false);
  const [loadingFacultades, setLoadingFacultades] = useState(false);
  const [loadingEscuelas, setLoadingEscuelas] = useState(false);
  const [loadingPeriodos, setLoadingPeriodos] = useState(false);
  const [loadingAsignaturas, setLoadingAsignaturas] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nrc: "N/A",
    clave: "",
    nombre: "",
    codigo: "",
    seccion: "",
    modalidad: "",
    cupo: "0",
    inscripto: "0",
    horario: "",
    dias: "",
    aula: "",
    creditos: "",
    tipo: "",
    accion: "Nuevo",
    modificacion: "Crear",
    usuario_registro: "",
    docenteFk: null,
    campusFk: null,
    universidadFk: null,
    facultadFk: null,
    escuelaFk: null,
    periodoFk: null,
    asignaturaFk: null,
  });

  // No son necesario los campos de universidad, facultad y escuela porque se obtienen de la asignatura seleccionada
  useEffect(() => {
    cargarDocentes();
    cargarCampus();
    // cargarUniversidades();
    // cargarFacultades();
    // cargarEscuelas();
    cargarPeriodos();
    cargarAsignaturas();
  }, []);

  const cargarDocentes = async (search = "") => {
    setLoadingDocentes(true);
    try {
      const { results } = await fetchDocentes(1, search, 10);
      setDocentes(
        results.map((d) => ({
          value: d.DocenteID,
          label: `${d.DocenteNombre} ${d.DocenteApellido}`,
          data: d,
        }))
      );
    } catch {
      Notification.alertError("Error al cargar docentes");
    } finally {
      setLoadingDocentes(false);
    }
  };

  const cargarCampus = async (search = "") => {
    setLoadingCampus(true);
    try {
      const { results } = await fetchCampus(1, search, 10);
      setCampus(
        results.map((c) => ({
          value: c.CampusID,
          label: c.CampusNombre,
        }))
      );
    } catch {
      Notification.alertError("Error al cargar campus");
    } finally {
      setLoadingCampus(false);
    }
  };

  const cargarUniversidades = async (search = "") => {
    setLoadingUniversidades(true);
    try {
      const { results } = await fetchUniversidades(1, search, 10);
      setUniversidades(
        results.map((u) => ({
          value: u.UniversidadID,
          label: u.UniversidadNombre,
        }))
      );
    } catch {
      Notification.alertError("Error al cargar universidades");
    } finally {
      setLoadingUniversidades(false);
    }
  };

  const cargarFacultades = async (search = "") => {
    setLoadingFacultades(true);
    try {
      const { results } = await fetchFacultades(1, search, 10);
      setFacultades(
        results.map((f) => ({
          value: f.FacultadID,
          label: f.FacultadNombre,
        }))
      );
    } catch {
      Notification.alertError("Error al cargar facultades");
    } finally {
      setLoadingFacultades(false);
    }
  };

  const cargarEscuelas = async (search = "") => {
    setLoadingEscuelas(true);
    try {
      const { results } = await fetchEscuelas(1, search, 10);
      setEscuelas(
        results.map((e) => ({
          value: e.EscuelaId,
          label: e.EscuelaNombre,
        }))
      );
    } catch {
      Notification.alertError("Error al cargar escuelas");
    } finally {
      setLoadingEscuelas(false);
    }
  };

  const cargarPeriodos = async (search = "") => {
    setLoadingPeriodos(true);
    try {
      const { results } = await fetchPeriodos(1, search, 10);
      setPeriodos(
        results.map((p) => ({
          value: p.PeriodoID,
          label: p.PeriodoNombre,
        }))
      );
    } catch {
      Notification.alertError("Error al cargar periodos académicos");
    } finally {
      setLoadingPeriodos(false);
    }
  };

  const cargarAsignaturas = async (search = "") => {
    setLoadingAsignaturas(true);
    try {
      const { results } = await fetchAsignaturas(1, search, 10);
      setAsignaturas(
        results.map((a) => ({
          value: a.AsignaturaCodigo,
          label: a.AsignaturaNombre,
          data: a,
        }))
      );
    } catch {
      Notification.alertError("Error al cargar asignaturas");
    } finally {
      setLoadingAsignaturas(false);
    }
  };

  // ------------------ HANDLERS ------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    if (name === "docenteFk" && selectedOption) {
      const d = selectedOption.data || {};

      setFormData((prev) => ({
        ...prev,
        docenteFk: selectedOption,
        codigo: d.DocenteCodigo || "",
      }));
      return;
    }
    // Caso especial: asignatura seleccionada
    if (name === "asignaturaFk" && selectedOption) {
      const asignatura = selectedOption.data;

      setFormData((prev) => ({
        ...prev,
        asignaturaFk: selectedOption,
        clave: asignatura.AsignaturaCodigo,
        nombre: asignatura.AsignaturaNombre,
        creditos: asignatura.AsignaturaCreditos,
        cupo: asignatura.AsignaturaHorasTeoricas,
        horario: asignatura.AsignaturaHorasPracticas,

        universidadFk: asignatura.Asignatura_UniversidadFK
          ? {
              value: asignatura.Asignatura_UniversidadFK,
              label: asignatura.universidadNombre,
            }
          : null,

        facultadFk: asignatura.Asignatura_FacultadFK
          ? {
              value: asignatura.Asignatura_FacultadFK,
              label: asignatura.facultadNombre,
            }
          : null,

        escuelaFk: asignatura.Asignatura_EscuelaFK
          ? {
              value: asignatura.Asignatura_EscuelaFK,
              label: asignatura.escuelaNombre,
            }
          : null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOption || null,
      }));
    }
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
      asignaturaFk: formData.asignaturaFk?.value || null,
    };
    console.log("Payload to submit:", payload);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}api/asignacion/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

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

  // ------------------ RENDER ------------------
  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>{title}</h1>

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

        {/* {[
          // "nrc",
          // "clave",
          // "nombre",
          "codigo", // hace referenncia al codigo del maestro
          "seccion",
          // "modalidad",
          // "cupo",
          // "inscripto",
          "horario",
          "dias",
          "aula",
          // "creditos",
          // "tipo",
        ].map((field) => (
          <div className={Styles.name_group} key={field}>
            <label htmlFor={field}>{field.toUpperCase()}:</label>
            <input
              type={
                ["cupo", "inscripto", "creditos"].includes(field)
                  ? "number"
                  : "text"
              }
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Ingrese ${field}`}
              disabled={field === "codigo"}
              required
            />
          </div>
        ))} */}

        <div className={Styles.name_group}>
          <label htmlFor="codigo">CÓDIGO:</label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            placeholder="Ingrese código"
            disabled // ← 🔹 deshabilitado
            required
          />
        </div>

        {/* Select de Asignatura */}
        <div className={Styles.name_group}>
          <label>Asignatura:</label>
          <Select
            name="asignaturaFk"
            options={asignaturas}
            value={formData.asignaturaFk}
            onChange={handleSelectChange}
            onInputChange={(inputValue) => {
              if (typeof inputValue === "string") {
                cargarAsignaturas(inputValue.replace(/\s/g, ""));
              }
            }}
            isLoading={loadingAsignaturas}
            placeholder="Seleccione asignatura"
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
          <label htmlFor="seccion">SECCIÓN:</label>
          <input
            type="text"
            id="seccion"
            name="seccion"
            value={formData.seccion}
            onChange={handleChange}
            placeholder="Ingrese sección"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="horario">HORARIO:</label>
          <input
            type="text"
            id="horario"
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            placeholder="Ingrese horario"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="dias">DÍAS:</label>
          <input
            type="text"
            id="dias"
            name="dias"
            value={formData.dias}
            onChange={handleChange}
            placeholder="Ingrese días"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="aula">AULA:</label>
          <input
            type="text"
            id="aula"
            name="aula"
            value={formData.aula}
            onChange={handleChange}
            placeholder="Ingrese aula"
            required
          />
        </div>
        {/* Campos de texto */}

        <div className={Styles.name_group}>
          <label htmlFor="modalidad">Modalidad:</label>
          <select
            id="modalidad"
            name="modalidad"
            className={Styles.input}
            value={formData.modalidad}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione modalidad</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Semipresencial">Semipresencial</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="tipo">Tipo:</label>
          <select
            id="tipo"
            name="tipo"
            className={Styles.input}
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione tipo</option>
            <option value="TEO">TEO</option>
            <option value="LAB">LAB</option>
          </select>
        </div>
        {/* Selects de relaciones */}

        

        {false && (
          <div className={Styles.name_group}>
            <label>Universidad:</label>
            <Select
              name="universidadFk"
              options={universidades}
              value={formData.universidadFk}
              onChange={handleSelectChange}
              isLoading={loadingUniversidades}
              placeholder="Seleccione universidad"
              isDisabled
              isClearable
            />
          </div>
        )}

        {false && (
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
              isDisabled
              isClearable
            />
          </div>
        )}

        {false && (
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
              isDisabled
              isClearable
            />
          </div>
        )}

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
