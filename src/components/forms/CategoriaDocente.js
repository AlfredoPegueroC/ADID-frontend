"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";
import Select from "react-select";
import { fetchUniversidades } from "@api/universidadService";

export default function CategoriaDocenteForm({ title }) {
  const router = useRouter();
  const [universidades, setUniversidades] = useState([]);
  const [loadingUniversidades, setLoadingUniversidades] = useState(false);

  const [formData, setFormData] = useState({
    categoriaCodigo: "",
    CategoriaNombre: "",
    CategoriaEstado: "",
    Categoria_UniversidadFK: null,
  });

  useEffect(() => {
    cargarUniversidades(""); // Carga inicial sin filtro
  }, []);

  const cargarUniversidades = async (search = "") => {
    setLoadingUniversidades(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchUniversidades(1, search, 10, token);
      const opciones = results.map((u) => ({
        value: u.UniversidadID,
        label: u.UniversidadNombre,
      }));
      setUniversidades(opciones);
    } catch (error) {
      console.error("Error al cargar universidades:", error);
      Notification.alertError("No se pudieron cargar las universidades");
    } finally {
      setLoadingUniversidades(false);
    }
  };

  const handleInputChange = (inputValue) => {
    cargarUniversidades(inputValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      Categoria_UniversidadFK: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      Categoria_UniversidadFK:
        formData.Categoria_UniversidadFK?.value || null,
    };

    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}api/categoriadocente/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

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
        Notification.alertError(
          "Error al crear la categoría. Ya existe o faltan datos."
        );
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
            onInputChange={handleInputChange}
            placeholder="Seleccione una universidad"
            isClearable
            isLoading={loadingUniversidades}
            noOptionsMessage={() => "No se encontraron universidades"}
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
