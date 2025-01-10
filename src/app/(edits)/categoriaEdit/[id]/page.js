"use client"

import React, {useState, useEffect} from "react"
import {useRouter} from "next/navigation" 

export default function categoriaEdit({params}){
  const router = useRouter()
  const {id} = React.use(params)

  const [categoria, setCategoria] = useState(null)
  const [universidades, setUniversidades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriasResponse = await fetch(`http://localhost:8000/api/categoria/${id}/`);
        if (!categoriasResponse.ok) throw new Error("Failed to fetch categorias");
        const categoriasData = await categoriasResponse.json();
        setCategoria(categoriasData);

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
    if (!categoria) return;

    try {
      const response = await fetch(`http://localhost:8000/api/categoria/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria),
      });

      if (response.ok) {
        alert("Categoria updated successfully!");
        router.push("/categoriaList");
      } else {
        alert("Failed to update categoria.");
      }
    } catch (error) {
      console.error("Error updating categoria:", error);
      alert("An error occurred.");
    }
  };

  const handleChange = (e) => { 
    const { name, value } = e.target;
    setCategoria({
      ...categoria,
      [name]: value,
    });
  }

  if(loading){
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>Editar Categoria</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input type="text" className="form-control" id="nombre" name="nombre" value={categoria.nombre} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripcion</label>
          <input type="text" className="form-control" id="descripcion" name="descripcion" value={categoria.descripcion} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="universidad" className="form-label">Universidad</label>
          <select className="form-select" id="universidad" name="universidad" value={categoria.universidad} onChange={handleChange}>
            {universidades.map((universidad) => (
              <option key={universidad.UniversidadCodigo} value={universidad.UniversidadCodigo}>
                {universidad.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  )

}