import { fetchEscuelas } from "@api/escuelaService";
import EscuelaListClient from "./escuelaListClient";

export default async function EscuelaPage({ searchParams }) {
  const params = await searchParams;
  const searchQuery = params?.search || "";
  const page = params?.page ? parseInt(params.page) : 1;

  const { results, totalPages } = await fetchEscuelas(searchQuery, page);

  return <EscuelaListClient initialData={results} totalPages={totalPages} />;
}
