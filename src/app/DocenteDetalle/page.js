// app/DocenteDetalle/page.js
import { Suspense } from 'react';
import ResumenDocenteContent from './ResumenDocenteContent';

export default function Page({ searchParams }) {
  const docente = searchParams.docente;
  const periodo = searchParams.periodo;

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResumenDocenteContent docenteID={docente} periodoParam={periodo} />
    </Suspense>
  );
}