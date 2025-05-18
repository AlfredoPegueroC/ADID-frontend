export async function fetchAsignacionData(periodo = null, page = 1, searchQuery = "") {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";
    const periodParam = periodo ? `&periodo=${periodo}` : "";
    const response = await fetch(`${API}api/asignacion?page=${page}${periodParam}${searchParam}`)

    const [
      asignacionResponse,
      facultadResponse,
      escuelaResponse,
      docenteResponse,
    ] = await Promise.all([
      fetch(`${API}api/asignacion?page=${page}${periodParam}${searchParam}`),
      fetch(`${API}facultades`),
      fetch(`${API}escuelas`),
      fetch(`${API}docentes`),
    ]);

    if (!asignacionResponse.ok) throw new Error("Failed to fetch asignaciones");
    if (!facultadResponse.ok) throw new Error("Failed to fetch facultades");
    if (!escuelaResponse.ok) throw new Error("Failed to fetch escuelas");
    if (!docenteResponse.ok) throw new Error("Failed to fetch docentes");

    const asignacionData = await asignacionResponse.json();
    const facultadData = await facultadResponse.json();
    const escuelaData = await escuelaResponse.json();
    const docenteData = await docenteResponse.json();

    const mergedData = asignacionData.results.map((asignacion) => {
      const facultad = facultadData.find(
        (fac) => fac.facultadCodigo === asignacion.facultadCodigo
      ) || { nombre: "Facultad no encontrada" };

      const escuela = escuelaData.find(
        (esc) => esc.escuelaCodigo === asignacion.escuelaCodigo
      ) || { nombre: "Escuela no encontrada" };

      const docente = docenteData.find(
        (doc) => doc.Docentecodigo === asignacion.DocenteCodigo
      ) || { nombre: "Docente no encontrado" };

      return {
        ...asignacion,
        facultadNombre: facultad.nombre,
        escuelaNombre: escuela.nombre,
        docenteNombre: `${docente.nombre} ${docente.apellidos}`,
      };
    });

    return {
      asignaciones: mergedData,
      totalPages: Math.ceil(asignacionData.count / 30),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { asignaciones: [], totalPages: 1 };
  }
}
