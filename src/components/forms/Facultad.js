"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

import Notification from "../Notification";
import Styles from "@styles/form.module.css";

export default function Facultad({ title }) {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [universidades, setUniversidades] = useState([]);
  const [campus, setCampus] = useState([]);
  const [selectedUniversidad, setSelectedUniversidad] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState(null);

  const [formData, setFormData] = useState({
    FacultadCodigo: "",
    FacultadNombre: "",
    FacultadDecano: "",
    FacultadDireccion: "",
    FacultadTelefono: "",
    FacultadEmail: "",
    FacultadEstado: "",
    Facultad_UniversidadFK: "",
    Facultad_CampusFK: "",
  });

  useEffect(() => {
    const fetchUniversidades = async () => {
      try {
        const res = await fetch(`${API}universidades`);
        const data = await res.json();
        const formatted = (data.results || data).map((u) => ({
          value: u.UniversidadID,
          label: u.UniversidadNombre,
        }));
        setUniversidades(formatted);
      } catch (error) {
        console.error("Error cargando universidades:", error);
      }
    };

    fetchUniversidades();
  }, [API]);

  const fetchCampusByUniversidad = async (universidadId) => {
    try {
      const res = await fetch(`${API}campus?universidad_id=${universidadId}`);
      const data = await res.json();
      const formatted = (data.results || data).map((c) => ({
        value: c.CampusID,
        label: c.CampusNombre,
      }));
      setCampus(formatted);
    } catch (error) {
      console.error("Error cargando campus:", error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleUniversidadChange = (selectedOption) => {
    setSelectedUniversidad(selectedOption);
    setFormData((prev) => ({
      ...prev,
      Facultad_UniversidadFK: selectedOption ? selectedOption.value : "",
      Facultad_CampusFK: "", // Limpia el campus anterior
    }));
    setSelectedCampus(null);
    if (selectedOption) {
      fetchCampusByUniversidad(selectedOption.value);
    } else {
      setCampus([]); // Limpia campus si no hay universidad
    }
  };

  const handleCampusChange = (selectedOption) => {
    setSelectedCampus(selectedOption);
    setFormData((prev) => ({
      ...prev,
      Facultad_CampusFK: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API}api/facultad/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        Notification.alertSuccess(`Facultad creada: ${result.FacultadNombre}`);
        router.push("/facultadList");
      } else {
        const error = await response.json();
        Notification.alertError("Error al crear la facultad. Ya existe o faltan datos.");
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
            value={selectedUniversidad}
            onChange={handleUniversidadChange}
            placeholder="Seleccione una universidad..."
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Campus</label>
          <Select
            options={campus}
            value={selectedCampus}
            onChange={handleCampusChange}
            placeholder="Seleccione un campus..."
            isClearable
            isDisabled={!selectedUniversidad}
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

