export async function fetchAsignacionData(periodo = null, page = 1, searchQuery = "") {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";
    const periodParam = periodo ? `&period=${periodo}` : "";
    const response = await fetch(`${API}api/asignacion?page=${page}${periodParam}${searchParam}`)

    if(!response.ok) throw new Error("Failed to fetch docentes");
    const data = await response.json()
   
    return {
      asignaciones: data.results,
      totalPages: Math.ceil(data.count / 30),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { asignaciones: [], totalPages: 1 };
  }
}
