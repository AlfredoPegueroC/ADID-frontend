"use client"

import DocenteForm from "@components/forms/Docente";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@/src/utils/withAuth";


function DocenteFormPage(){
  return (
    <FormLayout>
      <DocenteForm/>
    </FormLayout>
  )
}

export default withAuth(DocenteFormPage);