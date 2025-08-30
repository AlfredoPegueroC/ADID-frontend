import { fetchAsignaturas } from "@api/asignaturaService";
import AsignaturaListClient from "./asignaturaListClient";

export default async function AsignaturaPage({ searchParams }) {
  const params = await searchParams;
  const searchQuery = params?.search || "";

  const page = params?.page ? parseInt(params.page) : 1;

  const { results, totalPages } = await fetchAsignaturas(page, searchQuery);

  return <AsignaturaListClient initialData={results} totalPages={totalPages} />;
}
