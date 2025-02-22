import { fetchDocentes } from "@api/docenteService";
import DocenteListClient from "./docenteListClient";

export default async function DocentePage({ searchParams }) {
  const params = await searchParams; // Await searchParams
  const searchQuery = params?.search || "";
  const page = params?.page ? parseInt(params.page) : 1;

  const { results, totalPages } = await fetchDocentes(searchQuery, page);

  return <DocenteListClient initialData={results} totalPages={totalPages} />;
}

