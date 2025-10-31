"use client"

import AccionForm from "@components/forms/AccionForm"
import FormLayout from "@components/layouts/FormLayout"
import withAuth from "@utils/withAuth";
function AccionFormPage(){
    return (
        <FormLayout>
            <AccionForm title={"Definir Acción"}/>
        </FormLayout>
    )
}

export default withAuth(AccionFormPage);