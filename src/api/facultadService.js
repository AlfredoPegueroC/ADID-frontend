export async function fetchFacultades(searchQuery = "", page = 1) {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

    const [facultadesResponse, universidadesResponse] = await Promise.all([
      fetch(`${API}/api/facultad?page=${page}${searchParam}`),
      fetch(`${API}/api/universidad`),
    ]);

    if (!facultadesResponse.ok || !universidadesResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const [facultadesData, universidadesData] = await Promise.all([
      facultadesResponse.json(),
      universidadesResponse.json(),
    ]);

    const mergedData = facultadesData.results.map((facultad) => {
      const universidad = universidadesData.results.find(
        (uni) => uni.UniversidadCodigo === facultad.UniversidadCodigo
      );
      return {
        ...facultad,
        universidadNombre: universidad ? universidad.nombre : "Universidad no encontrada",
      };
    });

    return { results: mergedData, totalPages: Math.ceil(facultadesData.count / 30) };
  } catch (error) {
    console.error("Error fetching facultades:", error);
    return { results: [], totalPages: 1 };
  }
}
