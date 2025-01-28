"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";

function EditFacultad({ params }) {
  const router = useRouter();
  const { id } = React.use(params); 

  const [facultad, setFacultad] = useState(null);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const facultadesResponse = await fetch(`http://localhost:8000/api/facultad/${id}/`);
        if (!facultadesResponse.ok) throw new Error("Failed to fetch facultades");
        const facultadesData = await facultadesResponse.json();
        setFacultad(facultadesData);

        const universidadesResponse = await fetch("http://localhost:8000/api/universidad");
        if (!universidadesResponse.ok) throw new Error("Failed to fetch universidades");
        const universidadesData = await universidadesResponse.json();
        setUniversidades(universidadesData.results); // results es donde esta el contenido del json
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!facultad) return;

    try {
      const response = await fetch(`http://localhost:8000/api/facultad/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(facultad),
      });

      if (response.ok) {
        alert("Facultad updated successfully!");
        router.push("/facultadList");
      } else {
        alert("Failed to update facultad.");
      }
    } catch (error) {
      console.error("Error updating facultad:", error);
      alert("An error occurred.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacultad({
      ...facultad,
      [name]: value,
    });
  };

  if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;

  return (
    <FormLayout>
      <h1>Edit Facultad</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={facultad?.nombre || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="UniversidadCodigo" className="form-label">Universidad</label>
          <select
            id="UniversidadCodigo"
            name="UniversidadCodigo"
            value={facultad?.UniversidadCodigo || ""}
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
        <div className="mb-3">
          <label htmlFor="estado" className="form-label">Estado</label>
          <select
            className="form-control"
            id="estado"
            name="estado"
            value={facultad?.estado || ""}
            onChange={handleChange}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
      </form>
    </FormLayout>
  );
}


export default withAuth(EditFacultad)