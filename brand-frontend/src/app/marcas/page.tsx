import MainLayout from '../../components/layout/MainLayout';
import BrandList from '../../components/brands/BrandList';
import axiosClient from '../../config/axios';
import { Box, CircularProgress, Typography } from '@mui/material';

interface Brand {
  id: string;
  marca: string;
  titular: string;
  status: string;
  pais_registro: string;
  imagen_url?: string;
}

async function getBrands(): Promise<Brand[]> {
  try {
    const res = await axiosClient.get('/brands');
    return res.data;
  } catch (error) {
    return [];
  }
}

export default async function BrandsListPage() {
  const brands = await getBrands();

  if (!brands) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (brands.length === 0) {
    return (
      <MainLayout>
        <Box sx={{ mt: 4 }}>
          <Typography color="error">No se pudieron cargar las marcas o no hay marcas disponibles.</Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1>Listado de Marcas</h1>
      <BrandList brands={brands} />
    </MainLayout>
  );
}
