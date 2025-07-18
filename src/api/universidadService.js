// lib/universidadService.js
export async function fetchUniversidades(page = 1, searchQuery = "", pageSize = 10, accessToken = "") {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const params = new URLSearchParams();
  params.append("page", page);
  params.append("page_size", pageSize);

  if (searchQuery) params.append("search", searchQuery);

  try {
    const response = await fetch(`${API}api/universidad?${params.toString()}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso
      },
    });

    if (!response.ok) throw new Error("Failed to fetch universidades");

    const data = await response.json();

    return {
      results: data.results || [],
      totalPages: Math.ceil(data.count / pageSize),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { results: [], totalPages: 1 };
  }
}
