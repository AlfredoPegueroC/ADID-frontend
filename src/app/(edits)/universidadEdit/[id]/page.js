"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Notification from "@components/Notification";
import Styles from "@styles/form.module.css"; // Usa el mismo estilo del formulario de creación
import withAuth from "@utils/withAuth";
import { use } from 'react';

function EditUniversidad({ params }) {
  const router = useRouter();
  const { id } = use(params);

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversidad = async () => {
      try {
        const res = await fetch(`${API}api/universidad/${id}/`);
        if (!res.ok) throw new Error("No se pudo cargar la universidad.");
        const data = await res.json();
        setFormData(data);
        setLoading(false);
      } catch (err) {
        Notification.alertError("Error al cargar universidad.");
        console.error(err);
      }
    };

    fetchUniversidad();
  }, [API, id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}api/universidad/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        Notification.alertSuccess("Universidad actualizada correctamente.");
        router.push("/universidadList");
      } else {
        Notification.alertError("Error al editar la universidad.");
      }
    } catch (err) {
      Notification.alertError("Error de red.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={Styles.container}>
      <form
        id="universidadForm"
        onSubmit={handleSubmit}
        className={Styles.form}
      >
        <h1 className={Styles.title}>Editar Universidad</h1>

        <div className={Styles.name_group}>
          <label htmlFor="UniversidadCodigo">Código de la Universidad</label>
          <input
            type="text"
            id="UniversidadCodigo"
            value={formData.UniversidadCodigo}
            onChange={handleChange}
            required
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
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(EditUniversidad);
