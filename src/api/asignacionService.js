export async function fetchData(periodo = "", page = 1) {
  const API = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const periodoParam = periodo ? `&period=${encodeURIComponent(periodo)}` : "";

    const [
      asignacionResponse,
      facultadResponse,
      escuelaResponse,
      docenteResponse
    ] = await Promise.all([
      fetch(`${API}/api/asignacion_frontend?page=${page}${periodoParam}`),
      fetch(`${API}/api/facultad`),
      fetch(`${API}/api/escuela`),
      fetch(`${API}/api/docente`)
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
      const facultad = facultadData.results.find(
        (fac) => fac.facultadCodigo === asignacion.facultadCodigo
      ) || { nombre: "Facultad no encontrada" };

      const escuela = escuelaData.results.find(
        (esc) => esc.escuelaCodigo === asignacion.escuelaCodigo
      ) || { nombre: "Escuela no encontrada" };

      const docente = docenteData.results.find(
        (doc) => doc.Docentecodigo === asignacion.DocenteCodigo
      ) || { nombre: "Docente no encontrado" };

      return {
        ...asignacion,
        facultadNombre: facultad.nombre,
        escuelaNombre: escuela.nombre,
        docenteNombre: `${docente.nombre || ""} ${docente.apellidos || ""}`.trim(),
      };
    });

    return { results: mergedData, totalPages: Math.ceil(asignacionData.count / 30) };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { results: [], totalPages: 1 };
  }
}
