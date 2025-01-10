"use client"

import React, {useState, useEffect} from "react"
import { useRouter } from "next/navigation"

export default function DocenteEdit({params}){
  const router = useRouter()
  const { id } = React.use(params)


  const [docente, setDocente] = useState(null)
  const [universidades, setUniversidades] = useState([])
  const [facultades, setFacultades] = useState([])
  const [escuelas, setEscuelas] = useState([])  
  const [tipos, setTipos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true) 

  useEffect(() => {
    async function fetchData() {
      try{
        const docenteResponse = await fetch(`http://localhost:8000/api/docente/${id}/`)
        if(!docenteResponse.ok) throw new Error("Failed to fetch docente")
        const docenteData = await docenteResponse.json()
        setDocente(docenteData)

        const universidadesResponse = await fetch("http://localhost:8000/api/universidad")
        if(!universidadesResponse.ok) throw new Error("Failed to fetch universidades")
        const universidadesData = await universidadesResponse.json()
        setUniversidades(universidadesData)

        const facultadesResponse = await fetch("http://localhost:8000/api/facultad")
        if(!facultadesResponse.ok) throw new Error("Failed to fetch facultades")
        const facultadesData = await facultadesResponse.json()
        setFacultades(facultadesData)

        const escuelasResponse = await fetch("http://localhost:8000/api/escuela")
        if(!escuelasResponse.ok) throw new Error("Failed to fetch escuelas")
        const escuelasData = await escuelasResponse.json()
        setEscuelas(escuelasData)

        const tiposResponse = await fetch("http://localhost:8000/api/tipodocente")
        if(!tiposResponse.ok) throw new Error("Failed to fetch tipos")
        const tiposData = await tiposResponse.json()
        setTipos(tiposData)

        const categoriasResponse = await fetch("http://localhost:8000/api/categoriaDocente")
        if(!categoriasResponse.ok) throw new Error("Failed to fetch categorias")
        const categoriasData = await categoriasResponse.json()
        setCategorias(categoriasData)

      } catch(error){
        console.error("Error fetching data:", error)
      } finally { 
        setLoading(false) 
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!docente) return

    try {
      const response = await fetch(`http://localhost:8000/api/docente/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(docente)
      })

      if(response.ok){
        alert("Docente updated successfully!")
        router.push("/docenteList")
      } else {
        alert("Failed to update docente.")
        console.log(response.json())
      }
    } catch (error) {
      console.error("Error updating docente:", error)
      alert("An error occurred.")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setDocente({...docente, [name]: value})
  }

  if(loading) return <p>Loading...</p>

  return(
    <div className="container mt-5"> 
      <h1>Edit Docente</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre</label>
          <input type="text" className="form-control" name="nombre" value={docente.nombre} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Apellido</label>
          <input type="text" className="form-control" name="apellidos" value={docente.apellidos} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Sexo</label>
          <input type="text" className="form-control" name="sexo" value={docente.sexo}onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Estado civil</label>
          <input type="text" className="form-control" name="estado_civil" value={docente.estado_civil} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Fecha nacimiento</label>
          <input type="text" className="form-control" name="fecha_nacimiento" value={docente.fecha_nacimiento} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Telefono</label>
          <input type="text" className="form-control" name="telefono" value={docente.telefono} onChange={handleChange} />
        </div>
        
        <div className="mb-3">
          <label>Direccion</label>
          <input type="text" className="form-control" name="direccion" value={docente.fecha_nacimiento} onChange={handleChange} />
        </div>
        
        <div className="mb-3">
          <label htmlFor="estado" className="form-label">Estado</label>
          <select
            className="form-control"
            id="estado"
            name="estado"
            value={docente?.estado || ""}
            onChange={handleChange}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="UniversidadCodigo" className="form-label">Universidad</label>
          <select
            id="UniversidadCodigo"
            name="UniversidadCodigo"
            value={docente?.UniversidadCodigo || ""}
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
          <label htmlFor="facultadCodigo" className="form-label">Facultad</label>
          <select
            id="facultadadCodigo"
            name="UniversidadCodigo"
            value={docente?.facultadCodigo || ""}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Facultad --
            </option>
            {facultades.map((facultad) => (
              <option
                key={facultad.facultadCodigo}
                value={facultad.facultadCodigo}
              >
                {facultad.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="escuelaCodigo" className="form-label">Escuela</label>
          <select
            id="UniversidadCodigo"
            name="UniversidadCodigo"
            value={docente?.escuelaCodigo || ""}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Escuela --
            </option>
            {escuelas.map((escuela) => (
              <option
                key={escuela.escuelaCodigo}
                value={escuela.escuelaCodigo}
              >
                {escuela.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="UniversidadCodigo" className="form-label">Tipo docente</label>
          <select
            id="UniversidadCodigo"
            name="UniversidadCodigo"
            value={docente?.tipoDocenteCodigo || ""}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una tipo docente --
            </option>
            {tipos.map((tipo) => (
              <option
                key={tipo.tipoDocenteCodigo}
                value={tipo.tipoDocenteCodigo}
              >
                {tipo.nombre}
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