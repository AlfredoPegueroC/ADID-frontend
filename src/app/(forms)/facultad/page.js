"use client"

import Facultad from '@components/forms/Facultad'
import FormLayout from '@components/layouts/FormLayout'
import withAuth from "@/src/utils/withAuth";

function FacultadFormPage(){
  return (
    <FormLayout>
      <Facultad title="Definir Facultad"/>
    </FormLayout>
  )
  
}

export default withAuth(FacultadFormPage);