"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

import Notification from "../Notification";
import Styles from "@styles/form.module.css";
import { fetchUniversidades } from "@api/universidadService";
import { fetchCampus } from "@api/campusService";

export default function FacultadForm({ title }) {
  const router = useRouter();
  const [universidades, setUniversidades] = useState([]);
  const [campus, setCampus] = useState([]);
  const [loadingCampus, setLoadingCampus] = useState(false);

  const [formData, setFormData] = useState({
    FacultadCodigo: "",
    FacultadNombre: "",
    FacultadDecano: "",
    FacultadDireccion: "",
    FacultadTelefono: "",
    FacultadEmail: "",
    FacultadEstado: "",
    Facultad_UniversidadFK: null,
    Facultad_CampusFK: null,
  });

  // Cargar universidades con búsqueda y paginación
  const cargarUniversidades = async (search = "", page = 1) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchUniversidades(page, search, 10, token);
      const opciones = results.map((u) => ({
        value: u.UniversidadID,
        label: u.UniversidadNombre,
      }));
      setUniversidades(opciones);
    } catch (error) {
      console.error("Error al cargar universidades:", error);
      Notification.alertError("No se pudieron cargar las universidades");
    }
  };

  // Cargar campus filtrado por universidad, búsqueda y paginación
  const cargarCampus = async (universidadId, search = "", page = 1) => {
    if (!universidadId) {
      setCampus([]);
      return;
    }
    setLoadingCampus(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      // Asumo que fetchCampus acepta universidadId, search, page y pageSize
      const { results } = await fetchCampus(page, search, 10, token, universidadId);
      const opciones = results.map((c) => ({
        value: c.CampusID,
        label: c.CampusNombre,
      }));
      setCampus(opciones);
    } catch (error) {
      console.error("Error al cargar campus:", error);
      Notification.alertError("No se pudieron cargar los campus");
    } finally {
      setLoadingCampus(false);
    }
  };

  // Carga inicial universidades sin filtro
  useEffect(() => {
    cargarUniversidades("", 1);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUniversidadChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      Facultad_UniversidadFK: selectedOption,
      Facultad_CampusFK: null,
    }));
    setCampus([]);
    if (selectedOption) {
      cargarCampus(selectedOption.value, "", 1);
    }
  };

  // Búsqueda dinámica campus, solo si universidad seleccionada
  const handleCampusInputChange = (inputValue) => {
    if (formData.Facultad_UniversidadFK) {
      cargarCampus(formData.Facultad_UniversidadFK.value, inputValue, 1);
    }
  };

  const handleCampusChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      Facultad_CampusFK: selectedOption,
    }));
  };

  const handleUniversidadInputChange = (inputValue) => {
    cargarUniversidades(inputValue, 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const payload = {
      ...formData,
      Facultad_UniversidadFK: formData.Facultad_UniversidadFK?.value || null,
      Facultad_CampusFK: formData.Facultad_CampusFK?.value || null,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}api/facultad/create`,
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
        Notification.alertSuccess(`Facultad creada: ${result.FacultadNombre}`);
        router.push("/facultadList");
        setFormData({
          FacultadCodigo: "",
          FacultadNombre: "",
          FacultadDecano: "",
          FacultadDireccion: "",
          FacultadTelefono: "",
          FacultadEmail: "",
          FacultadEstado: "",
          Facultad_UniversidadFK: null,
          Facultad_CampusFK: null,
        });
        setCampus([]);
      } else {
        const error = await response.json();
        Notification.alertError(
          "Error al crear la facultad. Ya existe o faltan datos."
        );
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
          <label htmlFor="FacultadCodigo">Código</label>
          <input
            type="text"
            id="FacultadCodigo"
            value={formData.FacultadCodigo}
            onChange={handleChange}
            placeholder="Ej. F001"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadNombre">Nombre</label>
          <input
            type="text"
            id="FacultadNombre"
            value={formData.FacultadNombre}
            onChange={handleChange}
            placeholder="Nombre de la facultad"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadDecano">Decano</label>
          <input
            type="text"
            id="FacultadDecano"
            value={formData.FacultadDecano}
            onChange={handleChange}
            placeholder="Nombre del decano"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadDireccion">Dirección</label>
          <input
            type="text"
            id="FacultadDireccion"
            value={formData.FacultadDireccion}
            onChange={handleChange}
            placeholder="Dirección de la facultad"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadTelefono">Teléfono</label>
          <input
            type="text"
            id="FacultadTelefono"
            value={formData.FacultadTelefono}
            onChange={handleChange}
            placeholder="809-000-0000"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadEmail">Email</label>
          <input
            type="email"
            id="FacultadEmail"
            value={formData.FacultadEmail}
            onChange={handleChange}
            placeholder="correo@facultad.edu.do"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="FacultadEstado">Estado</label>
          <select
            id="FacultadEstado"
            value={formData.FacultadEstado}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label>Universidad</label>
          <Select
            options={universidades}
            value={formData.Facultad_UniversidadFK}
            onChange={handleUniversidadChange}
            onInputChange={handleUniversidadInputChange}
            placeholder="Seleccione una universidad..."
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Campus</label>
          <Select
            options={campus}
            value={formData.Facultad_CampusFK}
            onChange={handleCampusChange}
            onInputChange={handleCampusInputChange}
            placeholder="Seleccione un campus..."
            isClearable
            isDisabled={!formData.Facultad_UniversidadFK}
            isLoading={loadingCampus}
            noOptionsMessage={() =>
              formData.Facultad_UniversidadFK
                ? "No hay campus disponibles"
                : "Seleccione primero una universidad"
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
