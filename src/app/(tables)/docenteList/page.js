"use client"

import { useEffect, useState } from "react"
import Link from 'next/link'


export default function docenteList(){
  const [docentes, setDocentes] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetch("http://localhost:8000/api/docente")
      .then((response) => {
        if(!response.ok){
          throw new Error("failed")
        }
        return response.json()
      })
      .then(data => {
        setDocentes(data)
        setLoading(false)
      })
      .catch(error => {
        console.error("error docente", error)
        setLoading(false)
      })
  },[])

  const deleteDocente = (pk) => {
    const confirm = window.confirm("¿Estás seguro de querer eliminar?")
    if(confirm){
      fetch(`http://localhost:8000/api/docente/delete/${pk}/`, {method: "DELETE"})
      .then((response) => {
        if(response.ok){
          setDocentes(docentes.filter(doc =>doc.Docentecodigo !== pk))
          alert("facultad fue eliminado exitosamente") // need to customize in a modal component
        }else{
          alert("Failed to delete categoria")
        }
      })
      .catch((error) => {
        console.error("Error deleting categoria", error)
      })
    }
  }

  if(loading){
    return <p>Cargando...</p>
  }


  return(
    <div>
       <Link className="btn btn-primary mt-5" href="/docente">Nuevo</Link>
       {docentes.length > 0 && (
        <Link className="btn btn-success mt-5 ms-2" href="http://127.0.0.1:8000/export/docente">Exportar</Link>
       )}

<table className="table mt-5 table-primary "style={{
        borderRadius: "12px",
        fontSize: "17px",
        borderCollapse: "separate",
        overflow: "hidden",
        backgroundColor: "#e0f3ff",

      }}>
        <thead>
        <tr className="table" style={{
            fontSize: "18px",
            padding: "12px 15px",
            textAlign: "center",
            fontWeight: "bold",
            opacity: "revert-layer",
          }}>
            <th>#</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Sexo</th>
            <th>Estado Civil</th>
            <th>Fecha Nacimiento</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Universidad</th>
            <th>Facultad</th>
            <th>Escuela</th>
            <th>Tipo D.</th>
            <th>Categoría</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {docentes.length === 0 && (
            <tr>
              <td colSpan="15" className="text-center">No se encontraron docentes.</td>
            </tr>
          )}
          {docentes.length > 0 &&
            docentes.map((docente, index) => (
              <tr key={docente.Docentecodigo}>
                <th>{index + 1}</th>
                <td>{docente.nombre}</td>
                <td>{docente.apellidos}</td>
                <td>{docente.sexo}</td>
                <td>{docente.estado_civil}</td>
                <td>{docente.fecha_nacimiento}</td>
                <td>{docente.telefono}</td>
                <td>{docente.direccion}</td>
                <td>{docente.estado}</td>
                <td>{docente.UniversidadCodigo}</td>
                <td>{docente.facultadCodigo}</td>
                <td>{docente.escuelaCodigo}</td>
                <td>{docente.tipoDocenteCodigo}</td>
                <td>{docente.categoriaCodigo}</td>
                <td className="d-flex justify-content-between">
                  <Link className="btn btn-primary btn-sm" href={`/docenteEdit/${docente.Docentecodigo}`}>Editar</Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteDocente(docente.Docentecodigo)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

    </div>
  )


}