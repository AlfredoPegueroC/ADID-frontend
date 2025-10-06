export async function fetchAsignaturas(
  page = 1,
  searchQuery = "",
  pageSize = 10
) {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const params = new URLSearchParams();
  params.append("page", page);
  // params.append("pageSize", pageSize);
  params.append("page_size", pageSize);
  if (searchQuery) {
    params.append("search", searchQuery);
  }

  try {
    const response = await fetch(`${API}api/asignatura?${params.toString()}`, {
      cache: "no-store",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las asignaturas");
    }

    const data = await response.json();

    return {
      results: data.results || [],
      totalPages: Math.ceil(data.count / pageSize),
    };
  } catch (error) {
    console.error("Error en fetchAsignaturas:", error);
    throw error;
  }
}
