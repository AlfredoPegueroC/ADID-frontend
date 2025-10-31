"use client"

import StatusForm from "@components/forms/StatusForm"
import FormLayout from "@components/layouts/FormLayout"
import withAuth from "@utils/withAuth";

function StatusFormPage(){
    return (
        <FormLayout>
            <StatusForm title={"Definir Status"}/>
        </FormLayout>
    )
}
export default withAuth(StatusFormPage);