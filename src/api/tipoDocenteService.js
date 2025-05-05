export async function fetchTipoDocentes(searchQuery = "", page = 1) {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const searchParam = searchQuery
      ? `&search=${encodeURIComponent(searchQuery)}`
      : "";

    const response = await fetch(
      `${API}api/tipodocente?page=${page}${searchParam}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();

    return { results: data.results, totalPages: Math.ceil(data.count / 30) };
  } catch (error) {
    console.error("Error fetching tipo docentes:", error);
    return { results: [], totalPages: 1 };
  }
}
