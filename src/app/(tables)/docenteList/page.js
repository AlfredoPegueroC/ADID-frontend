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
    return <p>Loading...</p>
  }


  return(
    <div>
       <Link className="btn btn-primary mt-5" href="/docente">Nuevo</Link>
       {docentes.length > 0 && (
        <Link className="btn btn-success mt-5 ms-2" href="http://127.0.0.1:8000/export/docente">Exportar</Link>
       )}

       <table className="table mt-5 w-100">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Apellidos</th>
            <th scope="col">Sexo</th>
            <th scope="col">Estado Civil</th>
            <th scope="col">Fecha</th>
            <th scope="col">Telefono</th>
            <th scope="col">Dirrecion</th>
            <th scope="col">Estado</th>
            <th scope="col">Universidad</th>
            <th scope="col">Facultad</th>
            <th scope="col">Escuela</th>
            <th scope="col">Tipo D.</th>
            <th scope="col">Categoria</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {docentes.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No universities found.
              </td>
            </tr>
          )}
          {docentes.length > 0 &&
            docentes.map((docente, index) => (
              <tr key={docente.Docentecodigo}>
                <th scope="row">{index + 1}</th>
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
                <td>
                  <Link className="btn btn-primary btn-sm" href={`/docenteEdit/${docente.Docentecodigo}`}>Edit</Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() =>
                      deleteDocente(docente.Docentecodigo)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

    </div>
  )


}