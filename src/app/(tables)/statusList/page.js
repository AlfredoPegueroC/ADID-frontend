import { fetchStatus } from "@api/statusService";
import StatusListClient from "./StatusListCliente";

export default async function StatusPage({ searchParams }) {
  const params = await searchParams;
  const searchQuery = params?.search || "";
  const page = params?.page ? parseInt(params.page) : 1;
  const { results, totalPages } = await fetchStatus(searchQuery, page);
  return <StatusListClient initialData={results} totalPages={totalPages} />;
}
