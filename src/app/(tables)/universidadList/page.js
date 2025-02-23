import { fetchUniversidades } from "@api/universidadService";
import UniversidadListClient from "./UniversidadListClient";

export default async function UniversidadPage({ searchParams }) {
  const searchQuery = searchParams?.search || "";
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  const {results, totalPages } = await fetchUniversidades(page, searchQuery);
  
  return <UniversidadListClient initialData={{ results, totalPages }} />;
}