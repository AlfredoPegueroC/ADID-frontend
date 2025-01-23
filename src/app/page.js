"use client"

import Link from "next/link"
// import styles from "./page.module.css";


import { useEffect, useState } from 'react';
import Pagination from '@components/Pagination';
import Tables from "@components/Tables";

export default function Home() {
  const [asignacionData, setAsignacionData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    // Fetch the asignacionDocente data from the Django API
    fetch('http://127.0.0.1:8000/api/asignacion')
      .then((response) => response.json())
      .then((data) => {
        setAsignacionData(data.results)
        setTotalPages(Math.ceil(data.count / 10))
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [page]);

  return (
    <div>
       <Link className="btn btn-primary mt-5" href="/import">Import</Link>

       {asignacionData.length > 0 && (
        <Link className="btn btn-success mt-5 ms-2" href="http://127.0.0.1:8000/export/asignacionDocenteExport">Export</Link>
       )}
       

      {/* <h3 className="mt-5">Asignacion Docente</h3> */}
      <Tables>
        <thead>
          <tr>
            <th scope="col">NRC</th>
            <th scope="col">Clave</th>
            <th scope="col">Asignatura</th>
            <th scope="col">Codigo</th>
            <th scope="col">Profesor</th>
            <th scope="col">Seccion</th>
            <th scope="col">Modalidad</th>
            <th scope="col">Campus</th>
            <th scope="col">Facultad</th>
            <th scope="col">Escuela</th>
            <th scope="col">Tipo</th>
            <th scope="col">Cupo</th>
            <th scope="col">Inscripto</th>
            <th scope="col">Horario</th>
            <th scope="col">Dias</th>
            <th scope="col">Credito</th>
            <th scope='col'>Accion</th>
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
                <td>{asignacion.codigo}</td>
                <td>{asignacion.DocenteCodigo}</td>
                <td>{asignacion.seccion}</td>
                <td>{asignacion.modalidad}</td>
                <td>{asignacion.campus}</td>
                <td>{asignacion.facultadCodigo}</td>
                <td>{asignacion.escuelaCodigo}</td>
                <td>{asignacion.tipo}</td>
                <td>{asignacion.cupo}</td>
                <td>{asignacion.inscripto}</td>
                <td>{asignacion.horario}</td>
                <td>{asignacion.dias}</td>
                <td>{asignacion.creditos}</td>
                <td>
                <Link
                  href='#'
                  className="btn btn-primary btn-sm"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger btn-sm mx-2"          
                >
                  Delete
                </button>
              </td>
              </tr>
            ))
          )}
        </tbody>
      </Tables>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      
    </div>
  );
}

