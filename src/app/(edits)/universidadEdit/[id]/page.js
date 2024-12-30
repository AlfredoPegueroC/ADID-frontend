// pages/universidad/[id].js
"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const UniversidadDetail = () => {
  const router = useRouter();
  const { id } = router.query;  // Capture 'id' from the dynamic route

  const [universidad, setUniversidad] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;  // Don't fetch if 'id' is not available yet

    fetch(`http://localhost:8000/api/universidad/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setUniversidad(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching universidad:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!universidad) {
    return <p>Universidad not found.</p>;
  }

  return (
    <div>
      <h1>{universidad.nombre}</h1>
      <p><strong>Estado:</strong> {universidad.estado}</p>
      <p><strong>Facultad:</strong> {universidad.facultad}</p>
      {/* Display other fields here */}
    </div>
  );
};

export default UniversidadDetail;
