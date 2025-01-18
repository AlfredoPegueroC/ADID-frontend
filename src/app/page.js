"use client"

import Link from "next/link"
import { useEffect, useState } from 'react';

export default function Home() {
  const [asignacionData, setAsignacionData] = useState([]);
  const [showDetails, setShowDetails] = useState(false); // Estado para mostrar/ocultar detalles
  
  useEffect(() => {
    // Fetch the asignacionDocente data from the Django API
    fetch('http://127.0.0.1:8000/api/asignacion')
      .then((response) => response.json())
      .then((data) => setAsignacionData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const toggleDetails = () => {
    setShowDetails(!showDetails); // Cambiar estado para mostrar/ocultar detalles
  };

  return (
    <div>
      <Link
  className="btn btn-primary mt-5"
  href="/import"
  style={{
    padding: "10px 20px",        // Ajusta el tamaño del botón
    fontSize: "16px",            // Tamaño de fuente
    borderRadius: "1rem",        // Bordes redondeados
    textDecoration: "none",     // Quitar subrayado del texto
    display: "inline-block",    // Alineación en línea
    marginRight: "1rem",
  }}
>
  Importar
</Link>

{asignacionData.length > 0 && (
  <Link
    className="btn btn-success mt-5 ms-2"
    href="http://127.0.0.1:8000/export/asignacionDocenteExport"
    style={{
      padding: "10px 20px",        // Ajusta el tamaño del botón
      fontSize: "16px",            // Tamaño de fuente
      borderRadius: "5px",        // Bordes redondeados
      textDecoration: "none",     // Quitar subrayado del texto
      display: "inline-block",    // Alineación en línea
    }}
  >
    Export
  </Link>
)}

      
      {/* Botón Show para mostrar/ocultar detalles */}
      <button
  className="btn btn-info mt-5 ms-2"
  onClick={toggleDetails}
  style={{
    padding: "8px 10px",        // Ajusta el tamaño del botón
    fontSize: "16px",            // Tamaño de la fuente
    borderRadius: "1rem",        // Bordes redondeados
    textDecoration: "none",     // Asegura que el texto no esté subrayado
    cursor: "pointer",          // Cambia el cursor al pasar por encima
    backgroundColor: "##66B2FF",
    
  }}
>
  {showDetails ? "Hide Details" : "Show Details"}
</button>


      <table id="asignacionTable" className="table table-bordered table-striped mt-4 my" style={{
                    backgroundColor:"rgba(19, 98, 209, 0.9)",
                    color: "blue",
                    fontSize: "16.5px",
                    border: "none",
                   
                    
              }}>
        <thead className="table-primary table-sm" >
          <tr>
            <th scope="col">NRC</th>
            <th scope="col">Clave</th>
            <th scope="col">Asignatura</th>
            <th scope="col">Profesor</th>
                <th scope="col">Modalidad</th>
                <th scope="col">Sección</th>
                <th scope="col">Campus</th>
                <th scope="col">Facultad</th>
                <th scope="col">Escuela</th>
            {showDetails && (
              <>
                
                <th scope="col">Tipo</th>
                <th scope="col">Cupo</th>
                <th scope="col">Inscripto</th>
                <th scope="col">Créditos</th>
              </>
            )}
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {asignacionData.length === 0 ? (
            <tr>
              <td colSpan="16" className="text-center">
                No records found.
              </td>
            </tr>
          ) : (
            asignacionData.map((asignacion, index) => (
              <tr key={index}>
                <td>{asignacion.nrc}</td>
                <td>{asignacion.clave}</td>
                <td>{asignacion.asignatura}</td>
                <td>{asignacion.DocenteCodigo}</td>
                <td>{asignacion.modalidad}</td>
                <td>{asignacion.seccion}</td>
                <td>{asignacion.campus}</td>
                <td>{asignacion.facultadCodigo}</td>
                <td>{asignacion.escuelaCodigo}</td>
                {showDetails && (
                  <>
                    
                    <td>{asignacion.tipo}</td>
                    <td>{asignacion.cupo}</td>
                    <td>{asignacion.inscripto}</td>
                    <td>{asignacion.creditos}</td>
                  </>
                )}
                <td className="d-flex">
                  <Link href='#' className="btn btn-primary btn-sm mx-1">Editar</Link>
                  <button className="btn btn-danger btn-sm mx-1">Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
