'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResumenDocentePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docenteID = searchParams.get('docente');
  const periodoParam = searchParams.get('periodo');

  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState(periodoParam || '');

  const API = process.env.NEXT_PUBLIC_API_KEY;

  // Obtener todos los periodos
  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        const res = await fetch(`${API}api/periodoacademico`);
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

  // Cargar resumen del docente según el periodo
  useEffect(() => {
    const fetchData = async () => {
      if (!docenteID || !selectedPeriodo) return;
      setLoading(true);
      try {
        const res = await fetch(`${API}api/resumen/docente/?docente=${docenteID}&periodo=${selectedPeriodo}`);
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
      <div className="mb-3">
        <label className="form-label"><strong>Seleccionar período:</strong></label>
        <select className="form-select w-auto" value={selectedPeriodo} onChange={handlePeriodoChange}>
          {periodos.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Cargando resumen...</p>
      ) : !datos || !datos.asignaturas || datos.asignaturas.length === 0 ? (
        <div className="alert alert-info">
          No hay asignaturas registradas para este docente en el período <strong>{selectedPeriodo}</strong>.
        </div>
      ) : (
        <>
          <p><strong>Nombre:</strong> {datos.docente}</p>
          <p><strong>Período:</strong> {datos.periodo}</p>
          <p><strong>Total de Créditos:</strong> {datos.total_creditos}</p>
          <p><strong>Total de Materias:</strong> {datos.total_materias}</p>

          <h4 className="mt-4">Asignaturas:</h4>
          <ul>
            {datos.asignaturas.map((asig, index) => (
              <li key={index}>{asig}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
