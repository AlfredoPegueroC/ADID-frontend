"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";

export default function CampusForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    CampusCodigo: "",
    CampusNombre: "",
    CampusDireccion: "",
    CampusPais: "",
    CampusProvincia: "",
    CampusCiudad: "",
    CampusTelefono: "",
    CampusCorreoContacto: "",
    CampusEstado: "",
    Campus_UniversidadFK: "",
  });

  const API = process.env.NEXT_PUBLIC_API_KEY;
  const [universidades, setUniversidades] = useState([]);

  useEffect(() => {
    const fetchUniversidades = async () => {
      try {
        const response = await fetch(`${API}api/universidad`);
        const data = await response.json();
        setUniversidades(data.results || data); // por si no tiene paginación
      } catch (error) {
        console.error("Error al cargar universidades:", error);
      }
    };

    fetchUniversidades();
  }, []);

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
      const response = await fetch(`${API}api/campus/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await response.json();
        Notification.alertSuccess("Campus creado correctamente");
        router.push("/campusList");

        setFormData({
          CampusCodigo: "",
          CampusNombre: "",
          CampusDireccion: "",
          CampusPais: "",
          CampusProvincia: "",
          CampusCiudad: "",
          CampusTelefono: "",
          CampusCorreoContacto: "",
          CampusEstado: "",
          Campus_UniversidadFK: "",
        });
      } else {
        const error = await response.json();
        Notification.alertError("Error al crear el campus. Ya existe o está incompleto.");
        console.error("Error:", error);
      }
    } catch (error) {
      Notification.alertError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Registrar Campus</h1>

        <div className={Styles.name_group}>
          <label htmlFor="CampusCodigo">Código del Campus:</label>
          <input
            type="text"
            id="CampusCodigo"
            name="CampusCodigo"
            value={formData.CampusCodigo}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusNombre">Nombre del Campus:</label>
          <input
            type="text"
            id="CampusNombre"
            name="CampusNombre"
            value={formData.CampusNombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusDireccion">Dirección:</label>
          <input
            type="text"
            id="CampusDireccion"
            name="CampusDireccion"
            value={formData.CampusDireccion}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusPais">País:</label>
          <input
            type="text"
            id="CampusPais"
            name="CampusPais"
            value={formData.CampusPais}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusProvincia">Provincia:</label>
          <input
            type="text"
            id="CampusProvincia"
            name="CampusProvincia"
            value={formData.CampusProvincia}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusCiudad">Ciudad:</label>
          <input
            type="text"
            id="CampusCiudad"
            name="CampusCiudad"
            value={formData.CampusCiudad}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusTelefono">Teléfono:</label>
          <input
            type="text"
            id="CampusTelefono"
            name="CampusTelefono"
            value={formData.CampusTelefono}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusCorreoContacto">Correo de contacto:</label>
          <input
            type="email"
            id="CampusCorreoContacto"
            name="CampusCorreoContacto"
            value={formData.CampusCorreoContacto}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CampusEstado">Estado:</label>
          <select
            id="CampusEstado"
            name="CampusEstado"
            value={formData.CampusEstado}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Seleccione el estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Campus_UniversidadFK">Universidad:</label>
          <select
            id="Campus_UniversidadFK"
            name="Campus_UniversidadFK"
            value={formData.Campus_UniversidadFK}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Seleccione una Universidad --</option>
            {universidades.map((u) => (
              <option key={u.UniversidadID || u.UniversidadCodigo} value={u.UniversidadID}>
                {u.UniversidadNombre || u.nombre}
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
