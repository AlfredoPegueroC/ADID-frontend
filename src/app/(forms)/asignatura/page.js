"use client";

import AsignaturaForm from "@components/forms/Asignatura";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";

function AsignaturaFormPage() {
  return (
    <FormLayout>
      <AsignaturaForm title="Crear Asignatura" />
    </FormLayout>
  );
}

export default withAuth(AsignaturaFormPage);
