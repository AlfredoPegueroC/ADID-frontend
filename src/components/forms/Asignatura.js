"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

import Notification from "../Notification";
import Styles from "@styles/form.module.css";

import { fetchUniversidades } from "@api/universidadService";

export default function AsignaturaForm({ title }) {
  const router = useRouter();

  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);

  const [loadingFacultades, setLoadingFacultades] = useState(false);
  const [loadingEscuelas, setLoadingEscuelas] = useState(false);

  const [formData, setFormData] = useState({
    AsignaturaCodigo: "",
    AsignaturaNombre: "",
    AsignaturaCreditos: 0,
    AsignaturaHorasTeoricas: 0,
    AsignaturaHorasPracticas: 0,
    AsignaturaEstado: "Activo",
    Asignatura_UniversidadFK: null,
    Asignatura_FacultadFK: null,
    Asignatura_EscuelaFK: null,
  });

  // 🔹 Cargar universidades
  const cargarUniversidades = async () => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchUniversidades(1, "", 10, token);
      const opciones = results.map((u) => ({
        value: u.UniversidadID,
        label: u.UniversidadNombre,
      }));
      setUniversidades(opciones);
    } catch (error) {
      Notification.alertError("No se pudieron cargar las universidades");
    }
  };

  // 🔹 Cargar facultades filtradas por universidad
  const cargarFacultades = async (universidadId) => {
    if (!universidadId) return setFacultades([]);
    setLoadingFacultades(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}facultades?Facultad_UniversidadFK=${universidadId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      const opciones = data.map((f) => ({
        value: f.FacultadID,
        label: f.FacultadNombre,
      }));
      setFacultades(opciones);
    } catch (error) {
      Notification.alertError("No se pudieron cargar las facultades");
    } finally {
      setLoadingFacultades(false);
    }
  };

  // 🔹 Cargar escuelas filtradas por facultad
  const cargarEscuelas = async (facultadId) => {
    if (!facultadId) return setEscuelas([]);
    setLoadingEscuelas(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}escuelas?Escuela_facultadFK=${facultadId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      const opciones = data.map((e) => ({
        value: e.EscuelaId,
        label: e.EscuelaNombre,
      }));
      setEscuelas(opciones);
    } catch (error) {
      Notification.alertError("No se pudieron cargar las escuelas");
    } finally {
      setLoadingEscuelas(false);
    }
  };

  useEffect(() => {
    cargarUniversidades();
  }, []);

  // Inputs normales
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Selects dependientes
  const handleUniversidadChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      Asignatura_UniversidadFK: selectedOption,
      Asignatura_FacultadFK: null,
      Asignatura_EscuelaFK: null,
    }));
    setFacultades([]);
    setEscuelas([]);
    if (selectedOption) cargarFacultades(selectedOption.value);
  };

  const handleFacultadChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      Asignatura_FacultadFK: selectedOption,
      Asignatura_EscuelaFK: null,
    }));
    setEscuelas([]);
    if (selectedOption) cargarEscuelas(selectedOption.value);
  };

  const handleEscuelaChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      Asignatura_EscuelaFK: selectedOption,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const payload = {
      ...formData,
      Asignatura_UniversidadFK: formData.Asignatura_UniversidadFK?.value || null,
      Asignatura_FacultadFK: formData.Asignatura_FacultadFK?.value || null,
      Asignatura_EscuelaFK: formData.Asignatura_EscuelaFK?.value || null,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}api/asignatura/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const result = await response.json();
        Notification.alertSuccess(`Asignatura creada: ${result.AsignaturaNombre}`);
        router.push("/asignaturaList");
      } else {
        const error = await response.json();
        Notification.alertError("Error al crear la asignatura.");
        console.log("Error:", error);
      }
    } catch (error) {
      Notification.alertError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>{title}</h1>

        <div className={Styles.name_group}>
          <label htmlFor="AsignaturaCodigo">Código</label>
          <input
            type="text"
            id="AsignaturaCodigo"
            value={formData.AsignaturaCodigo}
            onChange={handleChange}
            placeholder="Ej. MAT101"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="AsignaturaNombre">Nombre</label>
          <input
            type="text"
            id="AsignaturaNombre"
            value={formData.AsignaturaNombre}
            onChange={handleChange}
            placeholder="Nombre de la asignatura"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="AsignaturaCreditos">Créditos</label>
          <input
            type="number"
            id="AsignaturaCreditos"
            value={formData.AsignaturaCreditos}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="AsignaturaHorasTeoricas">Horas Teóricas</label>
          <input
            type="number"
            id="AsignaturaHorasTeoricas"
            value={formData.AsignaturaHorasTeoricas}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="AsignaturaHorasPracticas">Horas Prácticas</label>
          <input
            type="number"
            id="AsignaturaHorasPracticas"
            value={formData.AsignaturaHorasPracticas}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="AsignaturaEstado">Estado</label>
          <select
            id="AsignaturaEstado"
            value={formData.AsignaturaEstado}
            onChange={handleChange}
            required
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label>Universidad</label>
          <Select
            options={universidades}
            value={formData.Asignatura_UniversidadFK}
            onChange={handleUniversidadChange}
            placeholder="Seleccione una universidad..."
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Facultad</label>
          <Select
            options={facultades}
            value={formData.Asignatura_FacultadFK}
            onChange={handleFacultadChange}
            placeholder="Seleccione una facultad..."
            isClearable
            isDisabled={!formData.Asignatura_UniversidadFK}
            isLoading={loadingFacultades}
            noOptionsMessage={() =>
              formData.Asignatura_UniversidadFK
                ? "No hay facultades disponibles"
                : "Seleccione primero una universidad"
            }
          />
        </div>

        <div className={Styles.name_group}>
          <label>Escuela</label>
          <Select
            options={escuelas}
            value={formData.Asignatura_EscuelaFK}
            onChange={handleEscuelaChange}
            placeholder="Seleccione una escuela..."
            isClearable
            isDisabled={!formData.Asignatura_FacultadFK}
            isLoading={loadingEscuelas}
            noOptionsMessage={() =>
              formData.Asignatura_FacultadFK
                ? "No hay escuelas disponibles"
                : "Seleccione primero una facultad"
            }
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
