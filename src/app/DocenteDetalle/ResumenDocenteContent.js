'use client';

import Spinner from '@components/Spinner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResumenDocenteContent({ docenteID, periodoParam }) {
  const router = useRouter();
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState(periodoParam || '');

  const API = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        const res = await fetch(`${API}api/periodoacademico`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const data = await res.json();
        const nombres = data.results.map(p => p.PeriodoNombre);
        const ordenados = nombres.sort((a, b) => b.localeCompare(a));
        setPeriodos(ordenados);
        if (!selectedPeriodo && ordenados.length > 0) {
          setSelectedPeriodo(ordenados[0]);
        }
      } catch (error) {
        console.error("Error cargando periodos:", error);
      }
    };
    fetchPeriodos();
  }, [API]);

  useEffect(() => {
    const fetchData = async () => {
      if (!docenteID || !selectedPeriodo) return;
      setLoading(true);
      try {
        const res = await fetch(`${API}api/resumen/docente/?docente=${docenteID}&periodo=${selectedPeriodo}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (!res.ok) {
          setDatos(null);
          return;
        }
        const data = await res.json();
        setDatos(data);
      } catch (error) {
        console.error('Error:', error);
        setDatos(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [docenteID, selectedPeriodo, API]);

  const handlePeriodoChange = (e) => {
    const nuevoPeriodo = e.target.value;
    setSelectedPeriodo(nuevoPeriodo);
    router.push(`/DocenteDetalle/?docente=${docenteID}&periodo=${nuevoPeriodo}`);
  };

  return (
    <div className="container mt-4 text-black">
      <h2>Resumen del Docente</h2>

      {loading ? (
       <Spinner />
      ) : !datos || !datos.asignaturas || datos.asignaturas.length === 0 ? (
        <div className="alert alert-info">
          No hay asignaturas registradas para este docente en el período <strong>{selectedPeriodo}</strong>.
        </div>
      ) : (
        <>
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 mt-5">
            <div>
              <h3 className="mb-1">{datos.docente}</h3>
              <span className="badge bg-primary me-2">{datos.facultad}</span>
              <span className="badge bg-secondary">{datos.escuela}</span>
            </div>
            <div className="d-flex align-items-center mt-2 mt-md-0">
              <label className="me-2 mb-0"><strong>Período:</strong></label>
              <select className="form-select w-auto" value={selectedPeriodo} onChange={handlePeriodoChange}>
                {periodos.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <p><strong>Total de Créditos:</strong> {datos.total_creditos}</p>
          <p><strong>Total de Materias:</strong> {datos.total_materias}</p>

          <h5 className="mt-4">Asignaturas:</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-hover mt-2">
              <thead className="table-light">
                <tr>
                  <th>NRC</th>
                  <th>Clave</th>
                  <th>Código</th>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {datos.asignaturas.map((asig, index) => (
                  <tr key={index}>
                    <td>{asig.nrc}</td>
                    <td>{asig.clave}</td>
                    <td>{asig.codigo}</td>
                    <td>{asig.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
