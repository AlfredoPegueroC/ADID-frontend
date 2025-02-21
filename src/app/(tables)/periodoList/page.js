import { fetchPeriodos } from "@api/periodoService";
import PeriodoListClient from "./periodoListClient";

export default async function PeriodoPage({ searchParams }) {
  const params = await searchParams;

  const searchQuery = params?.search || "";
  const page = params?.page ? parseInt(params.page) : 1;

  const { results, totalPages } = await fetchPeriodos(searchQuery, page);

  return <PeriodoListClient initialData={results} totalPages={totalPages} />;
}
