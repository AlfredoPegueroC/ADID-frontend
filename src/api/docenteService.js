export async function fetchDocentes(searchQuery = "", page = 1) {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

    const [docenteResponse, universidadResponse, facultadResponse, escuelaResponse, tipoResponse, categoriaResponse] = await Promise.all([
      fetch(`${API}api/docente?page=${page}${searchParam}`),
      fetch(`${API}universidades`),
      fetch(`${API}facultades`),
      fetch(`${API}escuelas`),
      fetch(`${API}tipodocentes`),
      fetch(`${API}categoriadocentes`),
    ]);

    if (!docenteResponse.ok) throw new Error("Failed to fetch docentes");
    if (!universidadResponse.ok) throw new Error("Failed to fetch universidades");
    if (!facultadResponse.ok) throw new Error("Failed to fetch facultades");
    if (!escuelaResponse.ok) throw new Error("Failed to fetch escuelas");
    if (!tipoResponse.ok) throw new Error("Failed to fetch tipos de docente");
    if (!categoriaResponse.ok) throw new Error("Failed to fetch categorías de docente");

    const docenteData = await docenteResponse.json();
    const universidadData = await universidadResponse.json();
    const facultadData = await facultadResponse.json();
    const escuelaData = await escuelaResponse.json();
    const tipoData = await tipoResponse.json();
    const categoriaData = await categoriaResponse.json();

    const mergedData = docenteData.results.map((docente) => {
      const universidad = universidadData.find(
        (uni) => uni.UniversidadCodigo === docente.UniversidadCodigo
      ) || { nombre: "Universidad no encontrada" };

      const facultad = facultadData.find(
        (fac) => fac.facultadCodigo === docente.facultadCodigo
      ) || { nombre: "Facultad no encontrada" };

      const escuela = escuelaData.find(
        (esc) => esc.escuelaCodigo === docente.escuelaCodigo
      ) || { nombre: "Escuela no encontrada" };

      const tipo = tipoData.find(
        (tip) => tip.tipoDocenteCodigo === docente.tipoDocenteCodigo
      ) || { nombre: "Tipo no encontrado" };

      const categoria = categoriaData.find(
        (cat) => cat.categoriaCodigo === docente.categoriaCodigo
      ) || { nombre: "Categoría no encontrada" };

      return {
        ...docente,
        universidadNombre: universidad.nombre,
        facultadNombre: facultad.nombre,
        escuelaNombre: escuela.nombre,
        tipoNombre: tipo.nombre,
        categoriaNombre: categoria.nombre,
      };
    });

    return { results: mergedData, totalPages: Math.ceil(docenteData.count / 30) };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { results: [], totalPages: 1 };
  }
}
