"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";
import Select from "react-select";

export default function CategoriaDocenteForm({ title }) {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [universidades, setUniversidades] = useState([]);
  const [formData, setFormData] = useState({
    categoriaCodigo: "",
    CategoriaNombre: "",
    CategoriaEstado: "",
    Categoria_UniversidadFK: null, // ahora será objeto react-select
  });

  useEffect(() => {
    const fetchUniversidades = async () => {
      try {
        const res = await fetch(`${API}universidades`);
        const data = await res.json();
        const lista = data.results || data;

        // Mapeamos para react-select: { value, label }
        const opciones = lista.map((u) => ({
          value: u.UniversidadID,
          label: u.UniversidadNombre,
        }));

        setUniversidades(opciones);
      } catch (error) {
        console.error("Error al cargar universidades:", error);
      }
    };

    fetchUniversidades();
  }, [API]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cambio para react-select
  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      Categoria_UniversidadFK: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    // Al enviar, enviamos solo el id de la universidad seleccionada
    const payload = {
      ...formData,
      Categoria_UniversidadFK: formData.Categoria_UniversidadFK?.value || null,
    };

    try {
      const response = await fetch(`${API}api/categoriadocente/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await response.json();
        Notification.alertSuccess("Categoría de Docente creada correctamente");
        router.push("/categoriadocenteList");

        setFormData({
          categoriaCodigo: "",
          CategoriaNombre: "",
          CategoriaEstado: "",
          Categoria_UniversidadFK: null,
        });
      } else {
        const error = await response.json();
        Notification.alertError("Error al crear la categoría. Puede que ya exista o faltan datos.");
        console.error("Error:", error);
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
          <Select
            id="Categoria_UniversidadFK"
            name="Categoria_UniversidadFK"
            options={universidades}
            value={formData.Categoria_UniversidadFK}
            onChange={handleSelectChange}
            placeholder="Seleccione una universidad"
            isClearable
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
