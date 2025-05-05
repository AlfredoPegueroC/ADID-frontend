"use client"

import CampusForm from "@components/forms/Campus"
import FormLayout from "@components/layouts/FormLayout"
import withAuth from "@/src/utils/withAuth";

function CampusFormPage(){
  return(
    <FormLayout>
      <CampusForm/>
    </FormLayout>
  )
}

export default withAuth(CampusFormPage)