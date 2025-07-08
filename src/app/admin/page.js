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
import { fetchDashboardData } from "@api/dashboardService"; // importa el servicio

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

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchDashboardData();
        setData(result);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    getData();
  }, []);

  if (!data)
    return (
      <div className="container mt-4">Cargando datos del dashboard...</div>
    );

  return (
    <div className="container py-4">
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
          link="/tipoDocenteList"
        />
        <DashboardCard
          icon="bi-building"
          title="Total Categorías"
          value={data.totalCategorias}
          link="/categoriaList"
        />
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Asignaciones por Facultad</h5>
              <Bar data={data.asignacionesPorFacultad} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Docentes por Categoría</h5>
              <div style={{ height: 300, width: 380 }}>
                <Pie data={data.docentesPorCategoria} options={options} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
