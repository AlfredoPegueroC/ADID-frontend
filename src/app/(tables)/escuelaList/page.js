"use client"

import React, {useState, useEffect} from "react"
import Link from 'next/link'

export default function escuelaList(){
  const [escuelas, setEscuelas] = useState([])
  const [loading, setLoading] = useState(true)


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
      .catch((error) => {
        console.error("error escuela", error)
        setLoading(false)
      })
  }, [])

  const deleteEscuela = (pk) => {
    const confirm = window.confirm("¿Estás seguro de querer eliminar?");
    if (confirm) {
      fetch(`http://localhost:8000/api/escuela/delete/${pk}/`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setEscuela(escuela.filter((esc) => esc.escuelaCodigo !== pk));
          } else {
            alert("Failed to delete facultad.");
          }
        })
        .catch((error) => {
          console.error("Error deleting facultad:", error);
        });
    }
  };


  if(loading){
    return <p>Cargando...</p>
  }


  return(
    <div>
       <Link className="btn btn-primary mt-5" href="/escuela">Nuevo</Link>
      {escuelas.length > 0 && (
        <Link className="btn btn-success mt-5 ms-2" href="http://127.0.0.1:8000/export/escuela">Exportar</Link>
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
                No escuela found.
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
                <td>{escuela.facultadCodigo}</td>
                <td>
                  <Link className="btn btn-primary btn-sm" href={`/escuelaEdit/${escuela.escuelaCodigo}`}>Editar</Link>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() =>
                      deleteEscuela(escuela.escuelaCodigo)
                    }
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