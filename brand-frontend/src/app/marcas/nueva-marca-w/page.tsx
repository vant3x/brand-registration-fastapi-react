import MainLayout from '../../../components/layout/MainLayout';
import BrandStepperForm from '../../../components/forms/BrandStepperForm';

export default function NewBrandPage() {
    return (
        <MainLayout>
            <h1>Registrar Nueva Marca</h1>
            <BrandStepperForm /> 
        </MainLayout>
    );
}