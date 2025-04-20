import { fetchPeriodos } from "@api/periodoService";
import HomeListClient from "./homeListClient";

export default async function AsignacionPage({ searchParams }) {
  const params = await searchParams;
  const period = params?.period || "";
  const page = params?.page ? parseInt(params.page) : 1;

  const { results, totalPages } = await fetchPeriodos(period, page); 

  return <HomeListClient initialData={results} totalPages={totalPages} />;
}