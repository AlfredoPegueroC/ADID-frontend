"use client"

import CategoriaDocenteForm from "@components/forms/CategoriaDocente";
import FormLayout from "@components/layouts/FormLayout";
// import "./globals.css";
import withAuth from "@/src/utils/withAuth";


function CategoriaDocenteFormPage(){
  return (
    <FormLayout>
      <CategoriaDocenteForm/>
    </FormLayout>
  )
}

export default withAuth(CategoriaDocenteFormPage);