export async function fetchHome(period = "", page = 1, pageSize = 10) {
  const API = process.env.NEXT_PUBLIC_API_KEY;
  let allPeriodo = [];
  let nextUrl = `${API}api/asignacion`;

  try {
    // CAMBIAR AQUI PARA MEJORAR EL RENDIMIENTO 
    // Traer todos los períodos únicos de asignaciones
    while (nextUrl) {
      const response = await fetch(nextUrl, { cache: "no-store" });
      if (!response.ok) throw new Error("Fallo al buscar los datos");
      const data = await response.json();

      allPeriodo = allPeriodo.concat(data.results);

      nextUrl = data.next;
    }

 
    const uniquePeriodo = [
      ...new Set(allPeriodo.map((asig) => asig.period)),
    ].map((periodo) => ({ periodo }));

   
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("page_size", pageSize);
    if (period) params.append("period", period);

    // Traer asignaciones paginadas y filtradas por período
    const asignacionResponse = await fetch(
      `${API}api/asignacion?${params.toString()}`,
      { cache: "no-store" }
    );
    if (!asignacionResponse.ok)
      throw new Error("Failed to fetch asignaciones");

    const asignacionData = await asignacionResponse.json();

    return {
      results: uniquePeriodo,
      totalPages: Math.ceil(asignacionData.count / pageSize),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { results: [], totalPages: 1 };
  }
}
