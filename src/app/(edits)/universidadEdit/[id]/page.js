"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "@styles/form.module.css";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";

function EditUniversidad({ params }) {
  const router = useRouter();

  const { id } = React.use(params);
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const [universidad, setUniversidad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/universidad/${id}/`)
      .then((response) => {
        if (!response.ok) {
          console.log("faild");
        }
        console.log("working");
        return response.json();
      })
      .then((data) => {
        setUniversidad(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching universidad details:", error);
        setError("Unable to fetch universidad details.");
        setLoading(false);
      });
  }, [router.isReady, id, API]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!universidad) return;

    try {
      const response = await fetch(`${API}/api/universidad/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(universidad),
      });

      if (response.ok) {
        alert("Universidad updated successfully!");
        router.push("/universidadList");
      } else {
        alert("Failed to update universidad.");
      }
    } catch (error) {
      console.error("Error updating universidad:", error);
      alert("An error occurred.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUniversidad({ ...universidad, [name]: value });
  };

  if (loading) {
    return (
      <div className="spinner-container ">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <FormLayout className={Styles.container}>
      <div className={Styles.container}>
        <form onSubmit={handleSubmit} className={Styles.form}>
          <h1 className={Styles.title}>Editar Universidad</h1>
          <div className={Styles.name_group}>
            <label htmlFor="nombre">Nombre de la Universidad</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={universidad?.nombre || ""}
              onChange={handleChange}
              placeholder="Nombre de la Universidad"
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={universidad?.estado || ""}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccione --</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <button type="submit" className={Styles.btn}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(EditUniversidad);
