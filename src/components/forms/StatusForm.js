"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";
import Select from "react-select";
import { fetchUniversidades } from "@api/universidadService";

export default function StatusForm({ title }) {
  const router = useRouter();
  const [universidades, setUniversidades] = useState([]);
  const [loadingUniversidades, setLoadingUniversidades] = useState(false);

  const [formData, setFormData] = useState({
    StatusCodigo: "",
    StatusNombre: "",
    StatusEstado: "",
    Status_UniversidadFK: null,
  });

  useEffect(() => {
    cargarUniversidades("");
  }, []);

  const cargarUniversidades = async (search = "") => {
    setLoadingUniversidades(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results = [] } = await fetchUniversidades(1, search, 10, token);
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
    cargarUniversidades(inputValue || "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, Status_UniversidadFK: selectedOption }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      Status_UniversidadFK: formData.Status_UniversidadFK?.value || null,
    };
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}api/status/create`,
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
        Notification.alertSuccess("Status creado correctamente");
        router.push("/statusList");
        setFormData({
          StatusCodigo: "",
          StatusNombre: "",
          StatusEstado: "",
          Status_UniversidadFK: null,
        });
      } else {
        const error = await response.json();
        Notification.alertError(
          "Error al crear el Status. Ya existe o faltan datos."
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
          <label htmlFor="StatusCodigo">Código:</label>
          <input
            type="text"
            id="StatusCodigo"
            name="StatusCodigo"
            value={formData.StatusCodigo}
            onChange={handleChange}
            placeholder="Ej. ST001"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="StatusNombre">Nombre:</label>
          <input
            type="text"
            id="StatusNombre"
            name="StatusNombre"
            value={formData.StatusNombre}
            onChange={handleChange}
            placeholder="Ej. Contratado / Licencia / Jubilado"
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="StatusEstado">Estado:</label>
          <select
            id="StatusEstado"
            name="StatusEstado"
            value={formData.StatusEstado}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione el estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Status_UniversidadFK">Universidad:</label>
          <Select
            id="Status_UniversidadFK"
            name="Status_UniversidadFK"
            options={universidades}
            value={formData.Status_UniversidadFK}
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
