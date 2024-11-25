"use client"

import React, {useState, useEffect} from "react"
import Link from 'next/link'

export default function escuelaList(){
  const [escuelas, setEscuelas] = useState([])
  const [loading, setLoading] = useState([])


  useEffect(() => {
    fetch("http://localhost:8000/api/escuela")
      .then((response) => {
          if(!response.ok){
            throw new Error("failed")
          }
          return response.json()
      })
      .then((data) => {
        setEscuelas(data)
        setLoading(false)
      })
      .then((error) => {
        console.error("error escuela", error)
        setLoading(false)
      })
  }, [])


  if(loading){
    return <p>Loading...</p>
  }


  return(
    <div>
       <Link className="btn btn-primary mt-5" href="/facultad">Nuevo</Link>

       <table className="table mt-5">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Estado</th>
            <th scope="col">Universidad</th>
            <th scope="col">Facultad</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {escuelas.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No universities found.
              </td>
            </tr>
          )}
          {escuelas.length > 0 &&
            escuelas.map((escuela, index) => (
              <tr key={escuela.escuelaCodigo}>
                <th scope="row">{index + 1}</th>
                <td>{escuela.nombre}</td>
                <td>{escuela.estado}</td>
                <td>{escuela.UniversidadCodigo}</td>
                <td>{escuela.FacultadCodigo}</td>
                <td>
                  <button className="btn btn-primary btn-sm">Edit</button>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    // onClick={() =>
                    //   deleteUniversidad(universidad.UniversidadCodigo)
                    // }
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