export async function fetchAsignacionData(
  periodo = null,
  page = 1,
  searchQuery = "",
  pageSize = 10
) {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const params = new URLSearchParams();
  params.append("page", page);
  params.append("page_size", pageSize);
  if (periodo) params.append("periodo", periodo);
  if (searchQuery) params.append("search", searchQuery);

  try {
    const response = await fetch(`${API}api/asignacion?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });
    console.log("Fetching asignaciones with params:", params.toString());
    if (!response.ok) throw new Error("Failed to fetch asignaciones");

    const data = await response.json();
    console.log("Asignaciones fetched successfully:", data.results.length, "items found");
    return {
      asignaciones: data.results || [],
      totalPages: Math.ceil(data.count / pageSize),
    };
  } catch (error) {
    console.error("Error fetching asignacion data:", error);
    return { asignaciones: [], totalPages: 1 };
  }
}
