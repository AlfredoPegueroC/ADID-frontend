"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Notification from "../Notification";
import Styles from "@styles/form.module.css";
import { toast, Bounce } from "react-toastify";

export default function Universidad({ title }) {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [formData, setFormData] = useState({
    UniversidadCodigo: "",
    UniversidadNombre: "",
    UniversidadDireccion: "",
    UniversidadTelefono: "",
    UniversidadEmail: "",
    UniversidadSitioWeb: "",
    UniversidadRector: "",
    UniversidadEstado: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleUniversidad = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}api/universidad/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        Notification.alertSuccess(`Universidad Creada: ${result.UniversidadNombre}`);
        router.push("/universidadList");
      } else {
        const error = await response.json();
        Notification.alertError("Error al crear la universidad. Ya existe en la DB.");
        console.log("Error", error);
      }
    } catch (error) {
      Notification.alertError("Hubo un error al conectar con la API: " + error.message);
    }
  };

  return (
    <div className={Styles.container}>
      <form
        id="universidadForm"
        onSubmit={handleUniversidad}
        className={Styles.form}
      >
        <h1 className={Styles.title}>{title}</h1>

        <div className={Styles.name_group}>
          <label htmlFor="UniversidadCodigo">Código de la Universidad</label>
          <input
            type="text"
            id="UniversidadCodigo"
            value={formData.UniversidadCodigo}
            onChange={handleChange}
            required
            placeholder="Ej: U1234"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="UniversidadNombre">Nombre de la Universidad</label>
          <input
            type="text"
            id="UniversidadNombre"
            value={formData.UniversidadNombre}
            onChange={handleChange}
            required
            placeholder="Nombre completo de la universidad"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="UniversidadDireccion">Dirección</label>
          <input
            type="text"
            id="UniversidadDireccion"
            value={formData.UniversidadDireccion}
            onChange={handleChange}
            required
            placeholder="Calle, número, barrio, ciudad"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="UniversidadTelefono">Teléfono</label>
          <input
            type="text"
            id="UniversidadTelefono"
            value={formData.UniversidadTelefono}
            onChange={handleChange}
            required
            placeholder="Ej: +1 809 123 4567"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="UniversidadEmail">Email</label>
          <input
            type="email"
            id="UniversidadEmail"
            value={formData.UniversidadEmail}
            onChange={handleChange}
            required
            placeholder="correo@universidad.edu"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="UniversidadSitioWeb">Sitio Web</label>
          <input
            type="text"
            id="UniversidadSitioWeb"
            value={formData.UniversidadSitioWeb}
            onChange={handleChange}
            required
            placeholder="https://www.universidad.edu"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="UniversidadRector">Rector</label>
          <input
            type="text"
            id="UniversidadRector"
            value={formData.UniversidadRector}
            onChange={handleChange}
            required
            placeholder="Nombre completo del rector"
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="UniversidadEstado">Estado</label>
          <select
            id="UniversidadEstado"
            value={formData.UniversidadEstado}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione el estado --
            </option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
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
