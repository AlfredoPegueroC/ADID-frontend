"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Select from "react-select";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";
import { fetchUniversidades } from "@api/universidadService"; // Usa tu service para universidades

export default function CampusForm({ title }) {
  const router = useRouter();

  const [universidades, setUniversidades] = useState([]);
  const [loadingUniversidades, setLoadingUniversidades] = useState(false);

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
    Campus_UniversidadFK: null, // guardamos el objeto seleccionado
  });

  // Carga inicial universidades (puedes cambiar o dejar vacio para búsqueda dinámica)
  useEffect(() => {
    cargarUniversidades("");
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

  const handleUniversidadChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      Campus_UniversidadFK: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const payload = {
      ...formData,
      Campus_UniversidadFK: formData.Campus_UniversidadFK?.value || null,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}api/campus/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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
          Campus_UniversidadFK: null,
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
        <h1 className={Styles.title}>{title}</h1>

        <div className={Styles.name_group}>
          <label htmlFor="CampusCodigo">Código del Campus:</label>
          <input
            type="text"
            id="CampusCodigo"
            name="CampusCodigo"
            value={formData.CampusCodigo}
            onChange={handleChange}
            placeholder="Ingrese el código del campus"
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
            placeholder="Ingrese el nombre del campus"
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
            placeholder="Ingrese la dirección del campus"
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
            placeholder="Ingrese el país"
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
            placeholder="Ingrese la provincia"
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
            placeholder="Ingrese la ciudad"
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
            placeholder="Ingrese el teléfono"
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
            placeholder="Ingrese el correo electrónico"
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
            <option value="" disabled>
              -- Seleccione el estado --
            </option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label>Universidad:</label>
          <Select
            options={universidades}
            value={formData.Campus_UniversidadFK}
            onChange={handleUniversidadChange}
            onInputChange={handleInputChange}
            placeholder="Seleccione universidad..."
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
