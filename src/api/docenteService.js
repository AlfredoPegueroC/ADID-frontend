export async function fetchDocentes(page = 1, searchQuery = "", pageSize = 10) {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const params = new URLSearchParams();
  params.append("page", page);
  params.append("page_size", pageSize);
  if (searchQuery) params.append("search", searchQuery);

  try {
    const response = await fetch(`${API}api/docente?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch docentes");

    const data = await response.json();

    return {
      results: data.results || [],
      totalPages: Math.ceil(data.count / pageSize),
    };
  } catch (error) {
    console.error("Error fetching docentes:", error);
    return { results: [], totalPages: 1 };
  }
}
