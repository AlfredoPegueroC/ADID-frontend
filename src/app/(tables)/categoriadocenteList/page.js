import { fetchCategorias } from "@api/categoriaService";
import CategoriaListClient from "./categoriaListClient";

export default async function CategoriaPage({ searchParams }) {
  const params = await searchParams;
  const searchQuery = params?.search || "";
  const page = params?.page ? parseInt(params.page) : 1;

  const { results, totalPages } = await fetchCategorias(searchQuery, page);

  return <CategoriaListClient initialData={results} totalPages={totalPages} />;
}
