"use client"

import React, {useState, useEffect} from "react"
import { useRouter } from "next/navigation"

export default function TipoEdit({params}){
  const router = useRouter()
  const { id } = React.use(params);

  const [tipo, setTipo] = useState(null)
  const [universidades, setUniversidades] = useState([])
  const [loading, setLoading] = useState(true)  


  useEffect(() => {
    async function fetchData() {
      try {
        const tipoResponse = await fetch(`http://localhost:8000/api/tipodocente/${id}/`)
        if (!tipoResponse.ok) throw new Error("Failed to fetch tipo")
        const tipoData = await tipoResponse.json()
        setTipo(tipoData)

        const universidadesResponse = await fetch("http://localhost:8000/api/universidad")
        if (!universidadesResponse.ok) throw new Error("Failed to fetch universidades")
        const universidadesData = await universidadesResponse.json()
        setUniversidades(universidadesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!tipo) return

    try {
      const response = await fetch(`http://localhost:8000/api/tipodocente/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tipo)
      })

      if (response.ok) {
        alert("Tipo updated successfully!")
        router.push("/tipodocenteList")
      } else {
        alert("Failed to update tipo.")
      }
    } catch (error) {
      console.error("Error updating tipo:", error)
      alert("An error occurred.")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setTipo({...tipo, [name]: value})
  };

  if(loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Edit Tipo</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={tipo.nombre}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="universidadCodigo">Universidad</label>
            <select
              id="universidadCodigo"
              name="universidadCodigo"
              value={tipo.universidadCodigo}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              {universidades.map((universidad) => (
                <option key={universidad.UniversidadCodigo} value={universidad.UniversidadCodigo}>
                  {universidad.nombre}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
        </form>
      )}
    </div>
  )

}