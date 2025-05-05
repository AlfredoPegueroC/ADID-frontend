export async function fetchFacultades(searchQuery = "", page = 1) {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

    const response = await fetch(`${API}api/facultad?page=${page}${searchParam}`);

    if (!response.ok) {
      throw new Error("Failed to fetch facultades");
    }

    const data = await response.json();

    return {
      results: data.results, // ya incluyen universidadNombre correctamente
      totalPages: Math.ceil(data.count / 30),
    };
  } catch (error) {
    console.error("Error fetching facultades:", error);
    return { results: [], totalPages: 1 };
  }
}

