import { fetchCampus } from "@api/campusService";
import CampusListClient from "./campusListClient"

export default async function CampusPage({searchParams}){
  const params = await searchParams;
  const searchQuery = params?.search || "";
  const page = params?.page ? parseInt(params.page) : 1;

  const {results, totalPages} = await fetchCampus(searchQuery, page);

  return <CampusListClient initialData={results} totalPages={totalPages}/>;
}