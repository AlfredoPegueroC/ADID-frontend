"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditUniversidad({params}) {
  const router = useRouter();

  const { id } = React.use(params);

  const [universidad, setUniversidad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  
    fetch(`http://localhost:8000/api/universidad/${id}/`)
      .then((response) => {
        if (!response.ok) {
          console.log("faild")

        }
        console.log("working")
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
  }, [router.isReady, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!universidad) return;

    try {
      const response = await fetch(`http://localhost:8000/api/universidad/edit/${id}/`, {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h1>Edit Universidad</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={universidad?.nombre || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="estado" className="form-label">Estado</label>
          <select
            className="form-control"
            id="estado"
            name="estado"
            value={universidad?.estado || ""}
            onChange={handleChange}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}

