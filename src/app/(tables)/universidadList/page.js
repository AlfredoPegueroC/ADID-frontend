import { fetchUniversidades } from "@api/universidadService";
import UniversidadListClient from "./UniversidadListClient";

export default async function UniversidadList() {
  const { universidades, totalPages } = await fetchUniversidades(1, ""); // Default to page 1, no search

  return <UniversidadListClient initialData={{ universidades, totalPages }} />;
}