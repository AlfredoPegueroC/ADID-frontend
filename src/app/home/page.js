"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Tables from "@components/Tables";

function Home() {
  const [asignacion, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    let allAsignaciones = [];
    let nextUrl = "http://localhost:8000/api/asignacion";

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok) throw new Error("Fallo al buscar los datos");

        const data = await response.json();
        allAsignaciones = allAsignaciones.concat(data.results)
        console.log(data.results)
        nextUrl = data.next;
      }

      const uniqueAsignaciones = Array.from(
        new Map(allAsignaciones.map(asig => [asig.period, asig])).values()
      );

      setAsignaciones(uniqueAsignaciones);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h3 className="text-black mt-5">Seleccion de Asignacion por Periodo</h3>
      <Tables>
        <thead>
          <tr>
            <th scope="col">Periodo</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {asignacion.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center">
                No se encontraron asignaciones.
              </td>
            </tr>
          ) : (
            asignacion.map((asig) => (
              <tr key={asig.period}>
                <td>{asig.period}</td>
                <td>
                  <Link href={`/universidadEdit`} className="btn btn-primary btn-sm">
                    ver
                  </Link>
                  <button className="btn btn-light btn-sm ms-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Tables>
    </div>
  );
}

export default Home;
