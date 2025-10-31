import { fetchAcciones } from "@api/accionesService";
import AccionListClient from "./AccionListCliente";

export default async function AccionPage({ searchParams }) {
  const params = await searchParams;
  const searchQuery = params?.search || "";
  const page = params?.page ? parseInt(params.page) : 1;
  const { results, totalPages } = await fetchAcciones(searchQuery, page);

  return <AccionListClient initialData={results} totalPages={totalPages} />;
}
