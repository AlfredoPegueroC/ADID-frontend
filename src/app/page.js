// app/principalPage.js
import PrincipalListClient from "./Client";
import { fetchAsignacionData } from "@api/asignacionService";

export default async function PrincipalPage() {
  const initialPage = 1;
  const searchQuery = "";

  const { asignaciones, totalPages } = await fetchAsignacionData(null, initialPage, searchQuery);

  return (
    <PrincipalListClient
      initialData={asignaciones}
      totalPages={totalPages}
    />
  );
}
