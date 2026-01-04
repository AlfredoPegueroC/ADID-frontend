"use client";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import Spinner from "@components/Spinner";

import {
  fetchDashboardProfesores,
  fetchDashboardSecciones,
  fetchDashboardAsignaturas,
} from "@api/dashboardService";

import { exportDashboardDataPdf } from "@utils/ExportPDF/exportpdf.js";
import { useRef } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const options = { maintainAspectRatio: false };

export default function ReportesDashboardPage() {
  const [profesores, setProfesores] = useState(null);
  const [secciones, setSecciones] = useState(null);
  const [asignaturas, setAsignaturas] = useState(null);
  const [loading, setLoading] = useState(true);
  const dashboardRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        const [p, s, a] = await Promise.all([
          fetchDashboardProfesores(),
          fetchDashboardSecciones(),
          fetchDashboardAsignaturas(),
        ]);
        setProfesores(p);
        setSecciones(s);
        setAsignaturas(a);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner />;
  return (
    <div ref={dashboardRef} className="container py-4">
      <h2 className="mb-4">📊 Reportes Académicos</h2>
      <button
        className="btn btn-danger mb-4"
        onClick={() =>
          exportDashboardDataPdf({
            profesores,
            secciones,
            asignaturas,
          })
        }
      >
       Exportar reportes a PDF
      </button>
      {/* PROFESORES */}
      <section className="mb-5">
        <h4 className="mb-3">👨‍🏫 Profesores</h4>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h6>Profesores por Modalidad</h6>
                <div style={{ height: 300 }}>
                  <Bar
                    data={profesores.profesoresPorModalidad}
                    options={options}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h6>Profesores por Asignatura (Top 10)</h6>
                <div style={{ height: 300 }}>
                  <Bar
                    data={{
                      labels: profesores.profesoresPorAsignatura.labels.slice(
                        0,
                        10
                      ),
                      datasets: profesores.profesoresPorAsignatura.datasets.map(
                        (ds) => ({
                          ...ds,
                          data: ds.data.slice(0, 10),
                        })
                      ),
                    }}
                    options={options}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIONES */}
      <section className="mb-5">
        <h4 className="mb-3">🏫 Secciones</h4>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h6>Secciones por Campus</h6>
                <div style={{ height: 300 }}>
                  <Bar data={secciones.seccionesPorCampus} options={options} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h6>Secciones por Modalidad</h6>
                <div style={{ height: 300 }}>
                  <Pie
                    data={secciones.seccionesPorModalidad}
                    options={options}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ASIGNATURAS */}
      <section className="mb-5">
        <h4 className="mb-3">📚 Asignaturas</h4>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h6>Asignaturas por Campus</h6>
                <div style={{ height: 300 }}>
                  <Bar
                    data={asignaturas.asignaturasPorCampus}
                    options={options}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h6>Asignaturas por Modalidad</h6>
                <div style={{ height: 300 }}>
                  <Pie
                    data={asignaturas.asignaturasPorModalidad}
                    options={options}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
