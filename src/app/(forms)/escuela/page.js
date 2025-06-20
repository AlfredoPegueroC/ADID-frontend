"use client"

import Escuela from '@components/forms/Escuela'
import FormLayout from '@components/layouts/FormLayout'
import withAuth from "@/src/utils/withAuth";

function EscuelaFormPage(){
  return (
    <FormLayout>
      <Escuela title="Definir Escuela"/>
    </FormLayout>
  )
}

export default withAuth(EscuelaFormPage);