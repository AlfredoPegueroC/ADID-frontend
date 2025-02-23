// lib/universidadService.js
export async function fetchUniversidades(page, searchQuery) {
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";
  
  try {
    const response = await fetch(`${API}api/universidad?page=${page}${searchParam}`, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch universidades");

    const data = await response.json();
    return {
      results: data.results || [],
      totalPages: Math.ceil(data.count / 30),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { universidades: [], totalPages: 1 };
  }
}
