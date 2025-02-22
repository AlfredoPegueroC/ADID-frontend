// app/principalPage.js
import PrincipalListClient from "./asignacionListClient";
import {fetchAsignacionData} from "@api/asignacionService";

export default async function PrincipalPage({ params }) {
  const { periodo } = await params;
  const initialPage = 1;
  const searchQuery = "";
  
  const { asignaciones, totalPages } = await fetchAsignacionData(periodo, initialPage, searchQuery);
  return <PrincipalListClient initialData={asignaciones} totalPages={totalPages} periodo={periodo} />;
}
