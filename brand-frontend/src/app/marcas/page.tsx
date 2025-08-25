'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

export default function BrandsListPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get<Brand[]>('/brands');
      setBrands(res.data);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError("No se pudieron cargar las marcas o no hay marcas disponibles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Box sx={{ mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1>Listado de Marcas</h1>
      <BrandList brands={brands} onBrandDeleted={fetchBrands} />
    </MainLayout>
  );
}
