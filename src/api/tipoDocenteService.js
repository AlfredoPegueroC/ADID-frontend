export async function fetchTipoDocentes(searchQuery = "", page = 1) {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

    const [tipoResponse, universidadResponse] = await Promise.all([
      fetch(`${API}api/tipodocente?page=${page}${searchParam}`),
      fetch(`${API}api/universidad`),
    ]);

    if (!tipoResponse.ok || !universidadResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const [tipoData, universidadData] = await Promise.all([
      tipoResponse.json(),
      universidadResponse.json(),
    ]);

    const mergedData = tipoData.results.map((tipo) => {
      const universidad = universidadData.results.find(
        (uni) => uni.UniversidadCodigo === tipo.UniversidadCodigo
      );
      return {
        ...tipo,
        universidadNombre: universidad ? universidad.nombre : "Universidad no encontrada",
      };
    });

    return { results: mergedData, totalPages: Math.ceil(tipoData.count / 30) };
  } catch (error) {
    console.error("Error fetching tipo docentes:", error);
    return { results: [], totalPages: 1 };
  }
}
