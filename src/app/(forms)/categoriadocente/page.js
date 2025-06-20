"use client"

import CategoriaDocenteForm from "@components/forms/CategoriaDocente";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@/src/utils/withAuth";


function CategoriaDocenteFormPage(){
  return (
    <FormLayout>
      <CategoriaDocenteForm title="Definir Categoria de Docente" />
    </FormLayout>
  )
}

export default withAuth(CategoriaDocenteFormPage);