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
import DashboardCard from "@components/DashboardCard";
import { fetchDashboardData } from "@api/dashboardService";
import { fetchPeriodos } from "@api/periodoService"; // tu fetch de periodos
import Spinner from "@components/Spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const options = { maintainAspectRatio: false };

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [periodos, setPeriodos] = useState([]);
  const [selectedPeriodo, setSelectedPeriodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingPeriodos, setLoadingPeriodos] = useState(true);

  // Cargar periodos y restaurar selección
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingPeriodos(true);
        const raw = await fetchPeriodos();
        const list = Array.isArray(raw?.results)
          ? raw.results
          : Array.isArray(raw)
          ? raw
          : [];

        // Extraer nombre del periodo (ajusta si tu API usa otro campo)
        const nombres = list
          .map((p) => p?.PeriodoNombre ?? p?.nombre ?? p)
          .filter(Boolean);

        if (!mounted) return;
        setPeriodos(nombres);

        const saved = localStorage.getItem("dashboard.periodo");
        if (saved && nombres.includes(saved)) {
          setSelectedPeriodo(saved);
        } else {
          setSelectedPeriodo(""); // Automático (deja que el backend elija)
        }
      } catch (e) {
        console.error("Error cargando periodos:", e);
        setPeriodos([]);
        setSelectedPeriodo("");
      } finally {
        if (mounted) setLoadingPeriodos(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Cargar datos del dashboard cuando cambie el periodo
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const result = await fetchDashboardData(selectedPeriodo || undefined);
        if (!mounted) return;
        setData(result);

        if (selectedPeriodo) {
          localStorage.setItem("dashboard.periodo", selectedPeriodo);
        } else {
          localStorage.removeItem("dashboard.periodo");
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        if (mounted) setData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedPeriodo]);

  // Derivados SIN useMemo (para no cambiar el orden de hooks)
  const profesoresPorCampus = Array.isArray(data?.profesoresPorCampus)
    ? data.profesoresPorCampus
    : [];

  const todosPCS = Array.isArray(data?.profesoresPorCampusYSemestre)
    ? data.profesoresPorCampusYSemestre
    : [];

  const profesoresPCSFiltrado = selectedPeriodo
    ? todosPCS.filter((r) => r.periodo === selectedPeriodo)
    : todosPCS;

  if (loading || loadingPeriodos || !data) return <Spinner />;

  return (
    <div className="container py-4">
      {/* Selector de período */}
      <div className="row g-3 align-items-end mb-3">
        <div className="col-md-4">
          <label className="form-label">Período</label>
          <select
            className="form-select"
            value={selectedPeriodo}
            onChange={(e) => setSelectedPeriodo(e.target.value)}
          >
            <option value={data.periodoActual}>Periodo Actual</option>
            {periodos.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <small className="text-muted">
            {selectedPeriodo
              ? "Filtrando con el período seleccionado (enviado al backend)."
              : "Usando el período por defecto del backend."}
          </small>
        </div>
      </div>

      {/* Cards principales */}
      <div className="row g-3 mb-4">
        <DashboardCard
          icon="bi-check-circle-fill"
          title="Asignaciones cargadas"
          value={data.totalAsignaciones}
          link="/"
        />
        <DashboardCard
          icon="bi-person-fill"
          title="Docentes asignados"
          value={data.totalDocentes}
          link="/docenteList"
        />
        <DashboardCard
          icon="bi-calendar-event"
          title="Período actual"
          value={data.periodoActual}
          link="/periodoList"
        />
        <DashboardCard
          icon="bi-building"
          title="Total Facultades"
          value={data.totalFacultades}
          link="/facultadList"
        />
        <DashboardCard
          icon="bi-building"
          title="Total Campus"
          value={data.totalCampus}
          link="/campusList"
        />
        <DashboardCard
          icon="bi-building"
          title="Total Tipos de Docente"
          value={data.totalTiposDocente}
          link="/tipodocenteList"
        />
        <DashboardCard
          icon="bi-building"
          title="Total Categorías"
          value={data.totalCategorias}
          link="/categoriadocenteList"
        />
      </div>

      {/* Gráficos existentes */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Asignaciones por Facultad</h5>
              <div style={{ height: 360 }}>
                <Bar data={data.asignacionesPorFacultad} options={options} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Docentes por Categoría</h5>
              <div style={{ height: 300, width: 380 }}>
                <Pie data={data.docentesPorCategoria} options={options} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <h3>comparativa de profesores por semestre </h3>
      {/* NUEVAS MÉTRICAS (números) */}
      <div className="row g-4 mb-4 align-items-stretch">
  {/* Profesores por Campus (lista -> tabla) */}
  <div className="col-md-6">
    <div className="card h-100 d-flex flex-column">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="card-title mb-0">Profesores por Campus</h5>
          <span className="badge bg-primary">
            Período Actual: {(selectedPeriodo || data.periodoActual) ?? "—"}
          </span>
        </div>

        {profesoresPorCampus.length === 0 ? (
          <p className="text-muted m-0">Sin datos</p>
        ) : (
          <div className="table-responsive grow">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th style={{ width: "60%" }}>Campus</th>
                  <th style={{ width: "40%" }} className="text-end">
                    Profesores
                  </th>
                </tr>
              </thead>
              <tbody>
                {profesoresPorCampus.map(({ campus, total }) => (
                  <tr key={campus}>
                    <td>{campus}</td>
                    <td className="text-end">
                      <span className="badge bg-success rounded-pill">{total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Profesores por Campus y Semestre (tabla filtrada por período) */}
  <div className="col-md-6">
    <div className="card h-100 d-flex flex-column">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="card-title mb-0">Profesores por Campus y Semestre</h5>
          <span className="badge bg-primary">
            Período: {(selectedPeriodo || data.periodoActual) ?? "—"}
          </span>
        </div>

        {profesoresPCSFiltrado.length === 0 ? (
          <p className="text-muted m-0">Sin datos</p>
        ) : (
          <div className="table-responsive grow">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th style={{ width: "60%" }}>Campus</th>
                  <th style={{ width: "40%" }} className="text-end">
                    Profesores
                  </th>
                </tr>
              </thead>
              <tbody>
                {profesoresPCSFiltrado.map((r, idx) => (
                  <tr key={`${r.periodo}-${r.campus}-${idx}`}>
                    <td>{r.campus}</td>
                    <td className="text-end">
                      <span className="badge bg-secondary">{r.total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!selectedPeriodo && (
          <div className="text-muted small mt-2">
            Sugerencia: selecciona un período para filtrar esta tabla.
          </div>
        )}
      </div>
    </div>
  </div>
</div>


      {/* “Asignaturas por Semestre” fue removido */}
    </div>
  );
}
