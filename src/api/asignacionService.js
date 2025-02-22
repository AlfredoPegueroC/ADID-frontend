
export async function fetchAsignacionData(periodo, page = 1, searchQuery = "") {
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";

  try {

    const asignacionResponse = await fetch(
      `${API}/api/asignacion?page=${page}&period=${periodo}${searchParam}`
    );
    if (!asignacionResponse.ok) {
      throw new Error("Failed to fetch asignaciones");
    }
    const asignacionData = await asignacionResponse.json();

    const [facultadResponse, escuelaResponse, docenteResponse] = await Promise.all([
      fetch(`${API}/api/facultad`),
      fetch(`${API}/api/escuela`),
      fetch(`${API}/api/docente`),
    ]);

    if (!facultadResponse.ok || !escuelaResponse.ok || !docenteResponse.ok) {
      throw new Error("Failed to fetch related data");
    }

    const facultadData = await facultadResponse.json();
    const escuelaData = await escuelaResponse.json();
    const docenteData = await docenteResponse.json();

    const mergedData = asignacionData.results.map((asignacion) => {
      const facultad = facultadData.results.find((fac) => fac.facultadCodigo === asignacion.facultadCodigo);
      const escuela = escuelaData.results.find((esc) => esc.escuelaCodigo === asignacion.escuelaCodigo);
      const docente = docenteData.results.find((doc) => doc.Docentecodigo === asignacion.DocenteCodigo);

      return {
        ...asignacion,
        facultadNombre: facultad ? facultad.nombre : "N/A",
        escuelaNombre: escuela ? escuela.nombre : "N/A",
        docenteNombre: docente ? `${docente.nombre} ${docente.apellidos}` : "N/A",
      };
    });
    console.log(mergedData)
    return { asignaciones: mergedData, totalPages: Math.ceil(asignacionData.count / 30) };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { asignaciones: [], totalPages: 1 };
  }
}