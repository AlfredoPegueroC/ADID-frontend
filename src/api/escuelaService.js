export async function fetchEscuelas(searchQuery = "", page = 1) {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

    const [escuelaResponse, facultadResponse, universidadResponse] = await Promise.all([
      fetch(`${API}api/escuela?page=${page}${searchParam}`),
      fetch(`${API}facultades`),
      fetch(`${API}universidades`),
    ]);

    if (!escuelaResponse.ok) throw new Error("Failed to fetch escuelas");
    if (!facultadResponse.ok) throw new Error("Failed to fetch facultades");
    if (!universidadResponse.ok) throw new Error("Failed to fetch universidades");

    const escuelaData = await escuelaResponse.json();
    const facultadData = await facultadResponse.json();
    const universidadData = await universidadResponse.json();

    const mergedData = escuelaData.results.map((escuela) => {
      const facultad = facultadData.find(
        (fac) => fac.facultadCodigo === escuela.facultadCodigo
      ) || { nombre: "Facultad no encontrada" };

      const universidad = universidadData.find(
        (uni) => uni.UniversidadCodigo === escuela.UniversidadCodigo
      ) || { nombre: "Universidad no encontrada" };

      return {
        ...escuela,
        facultadNombre: facultad.nombre,
        universidadNombre: universidad.nombre,
      };
    });

    return { results: mergedData, totalPages: Math.ceil(escuelaData.count / 30) };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { results: [], totalPages: 1 };
  }
}
