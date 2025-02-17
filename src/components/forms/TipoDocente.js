"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Styles from "@styles/form.module.css";

import Notification from "../Notification";

export default function TipoDocenteForm() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const [formData, setFormData] = useState({
    tipoDocenteCodigo: "",
    nombre: "",
    estado: "",
    universidadCodigo: "",
  });

  const [universidades, setUniversidades] = useState([]);

  useEffect(() => {
    // Fetch universidades from API when component mounts
    const fetchUniversidades = async () => {
      try {
        const response = await fetch(`${API}/api/universidad`);
        const data = await response.json();
        setUniversidades(data.results);
      } catch (error) {
        console.error("Error fetching universidades:", error);
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

    const response = await fetch(
      `${API}/api/tipodocente/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipoDocenteCodigo: formData.tipoDocenteCodigo,
          nombre: formData.nombre,
          estado: formData.estado,
          UniversidadCodigo: formData.universidadCodigo,
        }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      Notification.alertSuccess("Tipo de Docente creado exitosamente");
      setFormData({
        tipoDocenteCodigo: "",
        nombre: "",
        estado: "",
        universidadCodigo: "",
      });
      router.push("/tipodocenteList"); // Redirigir después de 2 segundos
    } else {
      const errorData = await response.json();
      Notification.alertError(
        "Error al crear el Tipo de Docente ya existe."
      );
    }
  };

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Información del Tipo de Docente</h1>

        <div className={Styles.name_group}>
          <label htmlFor="nombre">Nombre del Tipo de Docente:</label>
          <input
            type="text"
            placeholder="Nombre del Tipo de Docente"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="universidadCodigo">Universidad:</label>
          <select
            id="universidadCodigo"
            name="universidadCodigo"
            value={formData.universidadCodigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Universidad --
            </option>
            {universidades.map((universidad) => (
              <option
                key={universidad.UniversidadCodigo}
                value={universidad.UniversidadCodigo}
              >
                {universidad.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="estado">Estado:</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
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

        <button type="submit" className={Styles.btn}>
          Enviar
        </button>
      </form>
    </div>
  );
}
