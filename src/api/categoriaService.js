export async function fetchCategorias(searchQuery = "", page = 1) {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

    const [categoriaResponse, universidadResponse] = await Promise.all([
      fetch(`${API}api/categoriaDocente?page=${page}${searchParam}`),
      fetch(`${API}api/universidad`), // Fetching universities to associate with categories
    ]);

    if (!categoriaResponse.ok) throw new Error("Failed to fetch categorias");
    if (!universidadResponse.ok) throw new Error("Failed to fetch universidades");

    const categoriaData = await categoriaResponse.json();
    const universidadData = await universidadResponse.json();

    const mergedData = categoriaData.results.map((categoria) => {
      const universidad = universidadData.results.find(
        (uni) => uni.UniversidadCodigo === categoria.UniversidadCodigo
      ) || { nombre: "Universidad no encontrada" };

      return {
        ...categoria,
        universidadNombre: universidad.nombre,
      };
    });

    return { results: mergedData, totalPages: Math.ceil(categoriaData.count / 30) };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { results: [], totalPages: 1 };
  }
}
