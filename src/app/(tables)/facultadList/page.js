import { fetchFacultades } from "@api/facultadService";
import FacultadListClient from "./facultadListClient";

export default async function FacultadPage({ searchParams }) {
  const params = await searchParams;
  const searchQuery = params?.search || "";
  const page = params?.page ? parseInt(params.page) : 1;

  const { results, totalPages } = await fetchFacultades(searchQuery, page);

  return <FacultadListClient initialData={results} totalPages={totalPages} />;
}
