import MainLayout from '../components/layout/MainLayout';
import { getBrands } from '../services/brandService';
import BrandsHomeContainer from '../components/brands/BrandsHomeContainer'; 

export default async function Home() {
  const brands = await getBrands();

  return (
    <>
      <MainLayout>
        <BrandsHomeContainer brands={brands} />
      </MainLayout>
    </>
  );
}