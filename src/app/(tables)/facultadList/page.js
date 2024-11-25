"use client"

import React, {useEffect, useState} from "react";
import Link from 'next/link';

export default function FacultadList(){
  const [facultades, setFacultades] = useState([])
  const [loading, setLoading] = useState([])


  useEffect(() => {
    fetch("http://localhost:8000/api/facultad")
      .then((response) =>{
        if(!response.ok){
          throw new Error("Failed to fetch data")
        }
        return response.json()
      })
      .then((data) => {
        setFacultades(data)
        setLoading(false)
      })
      .then((error) => {
        console.error("error facultades", error)
        setLoading(false)
      })
  },[])

  const deleteUniversidad = (pk) => {
    // Send DELETE request to the API
    fetch(`http://localhost:8000/api/facultad/delete/${pk}/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // If successful, filter out the deleted university from the state
          setFacultades(
            facultades.filter((uni) => uni.facultadCodigo !== pk)
          );
        } else {
          alert("Failed to delete universidad.");
        }
      })
      .catch((error) => {
        console.error("Error deleting universidad:", error);
      });
  };

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
          {facultades.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No universities found.
              </td>
            </tr>
          )}
          {facultades.length > 0 &&
            facultades.map((facultad, index) => (
              <tr key={facultad.UniversidadCodigo}>
                <th scope="row">{index + 1}</th>
                <td>{facultad.nombre}</td>
                <td>{facultad.estado}</td>
                <td>{facultad.UniversidadCodigo}</td>
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
