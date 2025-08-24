import Image from "next/image";
import MainLayout from '../components/layout/MainLayout';
import axiosClient from '../config/axios'; 
import BrandsHomeContainer from '../components/brands/BrandsHomeContainer'; 

interface Brand {
  marca: string;
  titular: string;
  status: string;
  pais_registro: string;
  imagen_url: string;
  id: string;
  created_at: string;
  updated_at: string;
}

async function getBrands(): Promise<Brand[]> {
  try {
    const res = await axiosClient.get('/brands'); 
    return res.data;
  } catch (error) {
    return []; 
  }
}

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