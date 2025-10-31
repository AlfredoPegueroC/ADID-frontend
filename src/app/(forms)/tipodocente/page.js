"use client";

import TipoDocenteForm from "@components/forms/TipoDocente";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";

function TipoDocenteFormPage(){
    return (
        <FormLayout>
            <TipoDocenteForm title={"Definir Tipo de Asignatura"}/>
        </FormLayout>
    )
}

export default withAuth(TipoDocenteFormPage);