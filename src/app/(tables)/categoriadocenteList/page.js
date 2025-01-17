"use client"

import React, {useEffect, useState} from "react";
import Link from 'next/link';

export default function FacultadList(){
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetch("http://localhost:8000/api/categoriaDocente")
      .then((response) =>{
        if(!response.ok){
          throw new Error("Failed to fetch data")
        }
        return response.json()
      })
      .then((data) => {
        setCategorias(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("error facultades", error)
        setLoading(false)
      })
  },[])

  const deleteCategoria = (pk) => {
    const confirm = window.confirm("¿Estás seguro de querer eliminar?")
    if(confirm){
      fetch(`http://localhost:8000/api/categoriadocente/delete/${pk}/`, {method: "DELETE"})
      .then((response) => {
        if(response.ok){
          setCategorias(categorias.filter((cat) => cat.categoriaCodigo !== pk))
          alert("facultad fue eliminado exitosamente") // need to customize in a modal component
        } else{
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

  return (
    <div>
       <Link className="btn btn-primary mt-5" href="/categoriadocente">Nuevo</Link>

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
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No universities found.
              </td>
            </tr>
          )}
          {categorias.length > 0 &&
            categorias.map((categoria, index) => (
              <tr key={categoria.categoriaCodigo}>
                <th scope="row">{index + 1}</th>
                <td>{categoria.nombre}</td>
                <td>{categoria.estado}</td>
                <td>{categoria.UniversidadCodigo}</td>
                <td>
                  <button className="btn btn-primary btn-sm">Editar</button>
                  <button
                    className="btn btn-danger btn-sm mx-2"
                    onClick={() =>
                      deleteCategoria(categoria.categoriaCodigo)
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
