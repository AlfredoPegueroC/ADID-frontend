"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function EditUniversidad() {
  const router = useRouter();
  const { id } = router.query || {};  // Ensure that 'id' exists before using it

  const [universidad, setUniversidad] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // Don't run if the id is not available yet

    // Fetch the specific universidad data based on the 'id' from the URL
    fetch(`http://localhost:8000/api/universidad/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch universidad details");
        }
        return response.json();
      })
      .then((data) => {
        setUniversidad(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching universidad details:", error);
        setLoading(false);
      });
  }, [id]);  // Only re-run when 'id' changes

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!universidad) {
    return <p>Universidad not found.</p>;
  }

  return (
    <div>
      <h1>Edit Universidad</h1>
      <form>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={universidad.nombre}
            onChange={(e) =>
              setUniversidad({ ...universidad, nombre: e.target.value })
            }
          />
        </div>
        <div>
          <label>Estado:</label>
          <select
            value={universidad.estado}
            onChange={(e) =>
              setUniversidad({ ...universidad, estado: e.target.value })
            }
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
