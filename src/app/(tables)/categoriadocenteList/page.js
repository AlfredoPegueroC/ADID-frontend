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

  if(loading){
    return <p>Loading...</p>
  }

  return (
    <div>
       <Link className="btn btn-primary mt-5" href="/facultad">Nuevo</Link>

       <table className="table mt-5">
        <thead>
          <tr>
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
