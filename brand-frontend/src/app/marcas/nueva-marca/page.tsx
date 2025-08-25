import MainLayout from '../../../components/layout/MainLayout';
import BrandStepperForm from '../../../components/forms/BrandStepperForm';
import AddBusinessIcon from '@mui/icons-material/AddBusiness'; 

export default function NewBrandPage() {
    return (
        <MainLayout>
            <h1><AddBusinessIcon/> Registrar Nueva Marca  </h1>
            <BrandStepperForm /> 
        </MainLayout>
    );
}