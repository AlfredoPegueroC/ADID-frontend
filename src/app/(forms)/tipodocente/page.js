"use client";

import TipoDocenteForm from "@components/forms/TipoDocente";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";

function TipoDocenteFormPage(){
    return (
        <FormLayout>
            <TipoDocenteForm/>
        </FormLayout>
    )
}

export default withAuth(TipoDocenteFormPage);