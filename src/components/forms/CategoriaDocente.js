"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";

export default function CategoriaDocenteForm() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [universidades, setUniversidades] = useState([]);
  const [formData, setFormData] = useState({
    categoriaCodigo: "",
    CategoriaNombre: "",
    CategoriaEstado: "",
    Categoria_UniversidadFK: "",
  });

  useEffect(() => {
    const fetchUniversidades = async () => {
      try {
        const res = await fetch(`${API}api/universidad`);
        const data = await res.json();
        setUniversidades(data.results || data);
        console.log(data)
      } catch (error) {
        console.error("Error al cargar universidades:", error);
      }
    };

    fetchUniversidades();
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
      const response = await fetch(`${API}api/categoriadocente/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await response.json();
        Notification.alertSuccess("Categoría de Docente creada correctamente");
        router.push("/categoriadocenteList");

        setFormData({
          categoriaCodigo: "",
          CategoriaNombre: "",
          CategoriaEstado: "",
          Categoria_UniversidadFK: "",
        });
      } else {
        const error = await response.json();
        Notification.alertError("Error al crear la categoría. Puede que ya exista.");
        console.error("Error:", error);
      }
    } catch (error) {
      Notification.alertError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Registrar Categoría de Docente</h1>

        <div className={Styles.name_group}>
          <label htmlFor="categoriaCodigo">Código:</label>
          <input
            type="text"
            id="categoriaCodigo"
            name="categoriaCodigo"
            value={formData.categoriaCodigo}
            onChange={handleChange}
            placeholder="Ej. CAT001"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CategoriaNombre">Nombre:</label>
          <input
            type="text"
            id="CategoriaNombre"
            name="CategoriaNombre"
            value={formData.CategoriaNombre}
            onChange={handleChange}
            placeholder="Ej. Titular, Asociado, etc."
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="CategoriaEstado">Estado:</label>
          <select
            id="CategoriaEstado"
            name="CategoriaEstado"
            value={formData.CategoriaEstado}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione el estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Categoria_UniversidadFK">Universidad:</label>
          <select
            id="Categoria_UniversidadFK"
            name="Categoria_UniversidadFK"
            value={formData.Categoria_UniversidadFK}
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

        <div className={Styles.btn_group}>
          <button type="submit" className={Styles.btn}>
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
