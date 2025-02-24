export async function fetchHome(period = "", page = 1) {
  const API = process.env.NEXT_PUBLIC_API_KEY;
  let allPeriodo = [];
  let nextUrl = `${API}api/asignacion`;

  try {
    while (nextUrl) {
      const response = await fetch(nextUrl);
      if (!response.ok) throw new Error("Fallo al buscar los datos");
      const data = await response.json();

      allPeriodo = allPeriodo.concat(data.results);

      nextUrl = data.next;
    }

    const uniquePeriodo = [
      ...new Set(allPeriodo.map((asig) => asig.period)),
    ].map((periodo) => ({ periodo }));

    const periodParam = period ? `&period=${encodeURIComponent(period)}` : "";
    const asignacionResponse = await fetch(
      `${API}api/asignacion?page=${page}${periodParam}`
    );

    if (!asignacionResponse.ok) throw new Error("Failed to fetch asignaciones");

    const asignacionData = await asignacionResponse.json();

    return {
      results: uniquePeriodo,
      totalPages: Math.ceil(asignacionData.count / 30),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { results: [], totalPages: 1 };
  }
}
