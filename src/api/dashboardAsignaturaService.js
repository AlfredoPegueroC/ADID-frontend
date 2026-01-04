export async function fetchDashboardAsignaturas() {
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const url = `${API}api/dashboard/asignaturas`;

  const accessToken = localStorage.getItem('accessToken');
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    }); 

    if(!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }
    const data = await response.json();

    return data;

  } catch(error){
    console.error("Error al cargar dashboard:", error);
    throw error;
  }
}