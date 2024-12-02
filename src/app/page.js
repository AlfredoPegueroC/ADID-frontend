"use client"

import Link from "next/link"
// import styles from "./page.module.css";


export default function Home() {
  return (
    <div>
       <Link className="btn btn-primary mt-5" href="/facultad">Import</Link>
       <Link className="btn btn-success mt-5 ms-2" href="/facultad">Export</Link>

       <table className="table mt-5">
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
            <th scope="col">Acción</th>
            <th scope="col">Modificaciones</th>
          </tr>
        </thead>
        <tbody>
          {/* {categorias.length === 0 && (
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
            ))} */}
        </tbody>
      </table>

    </div>
  );
}
