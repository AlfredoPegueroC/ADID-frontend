"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Select from "react-select";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";

export default function CampusForm({ title }) {
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
  const [universidadSeleccionada, setUniversidadSeleccionada] = useState(null);

  useEffect(() => {
    const fetchUniversidades = async () => {
      try {
        const response = await fetch(`${API}universidades`);
        const data = await response.json();
        const formatted = data.map((u) => ({
          value: u.UniversidadID,
          label: u.UniversidadNombre || u.nombre,
        }));
        setUniversidades(formatted);
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

  const handleUniversidadChange = (selectedOption) => {
    setUniversidadSeleccionada(selectedOption);
    setFormData({
      ...formData,
      Campus_UniversidadFK: selectedOption ? selectedOption.value : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    console.log("🔑 Token de acceso:", accessToken);
    try {
      const response = await fetch(`${API}api/campus/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
        setUniversidadSeleccionada(null);
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
            <option value="" disabled>-- Seleccione el estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label >Universidad:</label>
          <Select
            options={universidades}
            value={universidadSeleccionada}
            
            onChange={handleUniversidadChange}
            placeholder="Seleccione universidad..."
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
