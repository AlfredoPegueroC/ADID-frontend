// app/DocenteDetalle/page.js
import { Suspense } from 'react';
import ResumenDocenteContent from './ResumenDocenteContent';

export default function DocenteResumenPage() {
  return (
    <Suspense fallback={<div className="text-center mt-5">Cargando resumen...</div>}>
      <ResumenDocenteContent />
    </Suspense>
  );
}
