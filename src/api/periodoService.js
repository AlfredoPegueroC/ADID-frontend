export async function fetchPeriodos(searchQuery = "", page = 1) {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

    const [periodoResponse, universidadResponse] = await Promise.all([
      fetch(`${API}api/periodoacademico?page=${page}${searchParam}`),
      fetch(`${API}api/universidad`),
    ]);

    if (!periodoResponse.ok || !universidadResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const [periodoData, universidadData] = await Promise.all([
      periodoResponse.json(),
      universidadResponse.json(),
    ]);

    const mergedData = periodoData.results.map((periodo) => {
      const universidad = universidadData.results.find(
        (uni) => uni.UniversidadCodigo === periodo.UniversidadCodigo
      );
      return {
        ...periodo,
        universidadNombre: universidad ? universidad.nombre : "Universidad no encontrada",
      };
    });

    return { results: mergedData, totalPages: Math.ceil(periodoData.count / 30) };
  } catch (error) {
    console.error("Error fetching periodos:", error);
    return { results: [], totalPages: 1 };
  }
}

