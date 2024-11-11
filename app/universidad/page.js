import FormLayout from '@components/layouts/FormLayout.js';
import Universidad from '@components/forms/Universidad';

export default function UniversidadFormPage() {
    return (
        <FormLayout title="Registrar Tipo de Docente">
            <Universidad />
        </FormLayout>
    );
}