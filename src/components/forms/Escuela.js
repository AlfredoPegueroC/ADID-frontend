"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";

export default function EscuelaForm() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);

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
        const res = await fetch(`${API}api/universidad`);
        const data = await res.json();
        setUniversidades(data.results || data);
      } catch (error) {
        console.error("Error cargando universidades:", error);
      }
    };

    const fetchFacultades = async () => {
      try {
        const res = await fetch(`${API}api/facultad`);
        const data = await res.json();
        setFacultades(data.results || data);
      } catch (error) {
        console.error("Error cargando facultades:", error);
      }
    };

    fetchUniversidades();
    fetchFacultades();
  }, [API]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}api/escuela/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          <label htmlFor="EscuelaCodigo">Código:</label>
          <input
            type="text"
            id="EscuelaCodigo"
            name="EscuelaCodigo"
            value={formData.EscuelaCodigo}
            onChange={handleChange}
            placeholder="Ej. ESC001"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaNombre">Nombre:</label>
          <input
            type="text"
            id="EscuelaNombre"
            name="EscuelaNombre"
            value={formData.EscuelaNombre}
            onChange={handleChange}
            placeholder="Nombre de la escuela"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaDirectora">Directora:</label>
          <input
            type="text"
            id="EscuelaDirectora"
            name="EscuelaDirectora"
            value={formData.EscuelaDirectora}
            onChange={handleChange}
            placeholder="Nombre de la directora"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaTelefono">Teléfono:</label>
          <input
            type="text"
            id="EscuelaTelefono"
            name="EscuelaTelefono"
            value={formData.EscuelaTelefono}
            onChange={handleChange}
            placeholder="809-000-0000"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaCorreo">Correo:</label>
          <input
            type="email"
            id="EscuelaCorreo"
            name="EscuelaCorreo"
            value={formData.EscuelaCorreo}
            onChange={handleChange}
            placeholder="escuela@universidad.edu.do"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="EscuelaEstado">Estado:</label>
          <select
            id="EscuelaEstado"
            name="EscuelaEstado"
            value={formData.EscuelaEstado}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione el estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Escuela_UniversidadFK">Universidad:</label>
          <select
            id="Escuela_UniversidadFK"
            name="Escuela_UniversidadFK"
            value={formData.Escuela_UniversidadFK}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione una universidad --</option>
            {universidades.map((u) => (
              <option key={u.UniversidadID} value={u.UniversidadID}>
                {u.UniversidadNombre}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Escuela_facultadFK">Facultad:</label>
          <select
            id="Escuela_facultadFK"
            name="Escuela_facultadFK"
            value={formData.Escuela_facultadFK}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione una facultad --</option>
            {facultades.map((f) => (
              <option key={f.FacultadID} value={f.FacultadID}>
                {f.FacultadNombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={Styles.btn}>
          Enviar
        </button>
      </form>
    </div>
  );
}
