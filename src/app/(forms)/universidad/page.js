"use client";

import FormLayout from '@components/layouts/FormLayout.js';
import Universidad from '@components/forms/Universidad';
import withAuth from '@/src/utils/withAuth';

function UniversidadFormPage() {
    return (
        <FormLayout>
            <Universidad title="Definir Universidad" />
        </FormLayout>
    );
}

export default withAuth(UniversidadFormPage);