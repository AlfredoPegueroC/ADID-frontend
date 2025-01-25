"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "@/src/utils/withAuth";

function EditEscuela({ params }) {
  const router = useRouter();
  const { id } = React.use(params);  

  const [escuela, setEscuela] = useState(null);
  const [facultades, setFacultades] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const escuelaResponse = await fetch(`http://localhost:8000/api/escuela/${id}/`);
        if (!escuelaResponse.ok) throw new Error("Failed to fetch escuela");
        const escuelaData = await escuelaResponse.json();
        setEscuela(escuelaData);

        const facultadesResponse = await fetch("http://localhost:8000/api/facultad");
        if (!facultadesResponse.ok) throw new Error("Failed to fetch facultades");
        const facultadesData = await facultadesResponse.json();
        setFacultades(facultadesData);

        const universidadesResponse = await fetch("http://localhost:8000/api/universidad");
        if (!universidadesResponse.ok) throw new Error("Failed to fetch universidades");
        const universidadesData = await universidadesResponse.json();
        setUniversidades(universidadesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!escuela) return;

    try {
      const response = await fetch(`http://localhost:8000/api/escuela/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(escuela),
      });

      if (response.ok) {
        alert("Escuela updated successfully!");
        router.push("/escuelaList");
      } else {
        alert("Failed to update escuela.");
      }
    } catch (error) {
      console.error("Error updating escuela:", error);
      alert("An error occurred.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEscuela({
      ...escuela,
      [name]: value,
    });
  };

  if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h1>Edit Escuela</h1>
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
            value={escuela.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="facultadCodigo" className="form-label">
            Facultad
          </label>
          <select
            className="form-select"
            id="facultadCodigo"
            name="facultadCodigo"
            value={escuela.facultadCodigo}
            onChange={handleChange}
          >
            <option value="">Select a facultad</option>
            {facultades.map((facultad) => (
              <option key={facultad.facultadCodigo} value={facultad.facultadCodigo}>
                {facultad.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="UniversidadCodigo" className="form-label">Universidad</label>
          <select
            id="UniversidadCodigo"
            name="UniversidadCodigo"
            value={escuela?.UniversidadCodigo || ""}
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
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

    </div>



  )
}


export default withAuth(EditEscuela);