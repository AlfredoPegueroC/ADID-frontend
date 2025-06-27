"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";

export default function EscuelaForm() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_KEY;

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
    const fetchUniversidades = async () => {
      try {
        const res = await fetch(`${API}universidades`);
        const data = await res.json();
        const options = (data.results || data).map((u) => ({
          value: u.UniversidadID,
          label: u.UniversidadNombre,
        }));
        setUniversidades(options);
      } catch (error) {
        console.error("Error cargando universidades:", error);
      }
    };

    fetchUniversidades();
  }, [API]);

  const fetchFacultadesByUniversidad = async (universidadId) => {
    try {
      const res = await fetch(`${API}facultades?universidad_id=${universidadId}`);
      const data = await res.json();
      const options = (data.results || data).map((f) => ({
        value: f.FacultadID,
        label: f.FacultadNombre,
      }));
      setFacultades(options);
    } catch (error) {
      console.error("Error cargando facultades:", error);
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
    if (selected) {
      fetchFacultadesByUniversidad(selected.value);
    }
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

    try {
      const response = await fetch(`${API}api/escuela/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        Notification.alertError("Error al crear la escuela.");
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
