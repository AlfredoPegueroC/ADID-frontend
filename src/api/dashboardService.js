export async function fetchDashboardData() {
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const url = `${API}api/dashboard`;
  
  // Obtén el token guardado en localStorage o donde lo tengas
  const accessToken = localStorage.getItem('accessToken');
  console.log("🔑 Token de acceso:", accessToken);
  try {
    console.log("📡 Llamando a:", url);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,  // <== Aquí va el token
        'Content-Type': 'application/json',
      }
    });

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
