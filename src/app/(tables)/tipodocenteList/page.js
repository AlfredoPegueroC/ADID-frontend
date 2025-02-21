import { fetchTipoDocentes } from "@api/tipoDocenteService";
import TipodocenteListClient from "./TipodocenteListCliente";

export default async function TipodocentePage({ searchParams }) {
  const params = await searchParams;

  const searchQuery = params?.search || "";
  const page = params?.page ? parseInt(params.page) : 1;

  const { results, totalPages } = await fetchTipoDocentes(searchQuery, page);

  return (
    <TipodocenteListClient initialData={results} totalPages={totalPages} />
  );
}
