import MainLayout from '../../../components/layout/MainLayout';
import BrandRegistrationForm from '../../../components/forms/BrandRegistrationForm';

export default function NewBrandPage() {
    return (
        <MainLayout>
            <h1>Registrar Nueva Marca</h1>
            <BrandRegistrationForm /> 
        </MainLayout>
    );
}