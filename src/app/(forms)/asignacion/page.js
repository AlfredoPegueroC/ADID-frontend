"use client"

import AsignacionForm from "@components/forms/Asignacion"
import FormLayout from "@components/layouts/FormLayout"
import withAuth from "@utils/withAuth"

function AsignacionFormPage(){
  return(
    <FormLayout>
      <AsignacionForm/>
    </FormLayout>
  )
}
export default withAuth(AsignacionFormPage)