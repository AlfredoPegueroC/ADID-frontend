import { fetchUniversidades } from "@api/universidadService";
import UniversidadListClient from "./UniversidadListClient";

export default async function UniversidadPage({ searchParams }) {
  const params = await searchParams
  const searchQuery = params?.search || "";
  const page = params?.page ? parseInt(params.page) : 1;

  const {results, totalPages } = await fetchUniversidades(page, searchQuery);
  
  return <UniversidadListClient initialData={{ results, totalPages }} />;
}