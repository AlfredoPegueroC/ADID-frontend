"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";
import { fetchUniversidades } from "@api/universidadService";
import { fetchFacultades } from "@api/facultadService";

export default function EscuelaForm() {
  const router = useRouter();

  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [selectedUniversidad, setSelectedUniversidad] = useState(null);
  const [selectedFacultad, setSelectedFacultad] = useState(null);

  const [formData, setFormData] = useState({
    EscuelaCodigo: "",
    EscuelaNombre: "",
    EscuelaDirectora: "",
    EscuelaTelefono: "",
    EscuelaCorreo: "",
    EscuelaEstado: "",
    Escuela_UniversidadFK: "",
    Escuela_facultadFK: "",
  });

  useEffect(() => {
    const cargarUniversidades = async () => {
      try {
        const token = localStorage.getItem("accessToken") || "";
        const { results } = await fetchUniversidades(1, "", 100, token);
        const opciones = results.map((u) => ({
          value: u.UniversidadID,
          label: u.UniversidadNombre,
        }));
        setUniversidades(opciones);
      } catch (error) {
        console.error("Error cargando universidades:", error);
        Notification.alertError("No se pudieron cargar las universidades");
      }
    };

    cargarUniversidades();
  }, []);

  const cargarFacultades = async (universidadId) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchFacultades(1, "", 100, token, universidadId);
      const opciones = results.map((f) => ({
        value: f.FacultadID,
        label: f.FacultadNombre,
      }));
      setFacultades(opciones);
    } catch (error) {
      console.error("Error cargando facultades:", error);
      Notification.alertError("No se pudieron cargar las facultades");
    }
  };

  const handleUniversidadChange = (selected) => {
    setSelectedUniversidad(selected);
    setSelectedFacultad(null);
    setFacultades([]);
    setFormData((prev) => ({
      ...prev,
      Escuela_UniversidadFK: selected ? selected.value : "",
      Escuela_facultadFK: "",
    }));
    if (selected) cargarFacultades(selected.value);
  };

  const handleFacultadChange = (selected) => {
    setSelectedFacultad(selected);
    setFormData((prev) => ({
      ...prev,
      Escuela_facultadFK: selected ? selected.value : "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}api/escuela/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await response.json();
        Notification.alertSuccess("Escuela creada exitosamente");
        router.push("/escuelaList");
        setFormData({
          EscuelaCodigo: "",
          EscuelaNombre: "",
          EscuelaDirectora: "",
          EscuelaTelefono: "",
          EscuelaCorreo: "",
          EscuelaEstado: "",
          Escuela_UniversidadFK: "",
          Escuela_facultadFK: "",
        });
        setSelectedUniversidad(null);
        setSelectedFacultad(null);
        setFacultades([]);
      } else {
        const error = await response.json();
        Notification.alertError("Error al crear la escuela. Ya existe o faltan datos");
        console.error("Error:", error);
      }
    } catch (error) {
      Notification.alertError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Registrar Escuela</h1>

        <div className={Styles.name_group}>
          <label>Código:</label>
          <input
            type="text"
            name="EscuelaCodigo"
            value={formData.EscuelaCodigo}
            onChange={handleInputChange}
            placeholder="Ej. ESC001"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label>Nombre:</label>
          <input
            type="text"
            name="EscuelaNombre"
            value={formData.EscuelaNombre}
            onChange={handleInputChange}
            placeholder="Nombre de la escuela"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label>Directora:</label>
          <input
            type="text"
            name="EscuelaDirectora"
            value={formData.EscuelaDirectora}
            onChange={handleInputChange}
            placeholder="Nombre de la directora"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label>Teléfono:</label>
          <input
            type="text"
            name="EscuelaTelefono"
            value={formData.EscuelaTelefono}
            onChange={handleInputChange}
            placeholder="809-000-0000"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label>Correo:</label>
          <input
            type="email"
            name="EscuelaCorreo"
            value={formData.EscuelaCorreo}
            onChange={handleInputChange}
            placeholder="escuela@universidad.edu.do"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label>Estado:</label>
          <select
            name="EscuelaEstado"
            value={formData.EscuelaEstado}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Seleccione el estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label>Universidad:</label>
          <Select
            options={universidades}
            value={selectedUniversidad}
            onChange={handleUniversidadChange}
            placeholder="Seleccione una universidad"
            isClearable
          />
        </div>

        <div className={Styles.name_group}>
          <label>Facultad:</label>
          <Select
            options={facultades}
            value={selectedFacultad}
            onChange={handleFacultadChange}
            placeholder="Seleccione una facultad"
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
