export async function fetchHome(period = "", page = 1) {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const periodParam = period ? `&period=${encodeURIComponent(period)}` : "";

    const [asignacionResponse] = await Promise.all([
      fetch(`${API}/api/asignacion?page=${page}${periodParam}`),
    
    ]);

    if (!asignacionResponse.ok) throw new Error("Failed to fetch asignaciones")

    const asignacionData = await asignacionResponse.json();
 
    return {
      ...asignacionData,
      totalPages: Math.ceil(asignacionData.count / 30),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { results: [], totalPages: 1 };
  }
}
