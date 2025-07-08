// services/dashboardService.js
export async function fetchDashboardData() {
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const url = `${API}/api/dashboard`;

  try {
    console.log("📡 Llamando a:", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Datos recibidos:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al cargar dashboard:", error);
    throw error;
  }
}
