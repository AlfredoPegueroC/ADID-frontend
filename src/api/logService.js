export async function fetchLogs(page = 1, search = "", pageSize = 10, token) {
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  const response = await fetch(
    `${API}api/logs/?page=${page}${searchParam}&page_size=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    let errorText = "Error al obtener los logs";
    try {
      const errorData = await response.json();
      errorText = errorData?.detail || errorData?.error || errorText;
    } catch {}
    throw new Error(errorText);
  }

  const data = await response.json();

  return {
    results: data.results || [],
    totalPages: Math.ceil(data.count / pageSize), // <-- usar pageSize dinámico
  };
}

