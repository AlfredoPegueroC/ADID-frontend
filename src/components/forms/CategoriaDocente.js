"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";

export default function CategoriaDocenteForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    categoriaCodigo: "",
    nombre: "",
    estado: "",
    universidadCodigo: "",
  });
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [universidades, setUniversidades] = useState([]);

  // Fetch universidades when component mounts
  useEffect(() => {
    const fetchUniversidades = async () => {
      try {
        const response = await fetch(`${API}api/universidad`);
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
      `${API}api/categoriadocente/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoriaCodigo: formData.categoriaCodigo,
          nombre: formData.nombre,
          estado: formData.estado,
          UniversidadCodigo: formData.universidadCodigo,
        }),
      }
    );

    if (response.ok) {
      const result = await response.json();

      setFormData({
        categoriaCodigo: "",
        nombre: "",
        estado: "",
        universidadCodigo: "",
      });
      router.push("/categoriadocenteList"); 
      Notification.alertSuccess("Categoría de Docente creada exitosamente");
    } else {
      const errorData = await response.json();
      Notification.alertError(
        "Error al crear la Categoría de Docente ya existe DB" 
      );
    }
  };

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Registrar Categoría de Docente</h1>

          <div className={Styles.name_group}>
            <label htmlFor="nombre">Nombre de la Categoría:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre de la Categoría"
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
