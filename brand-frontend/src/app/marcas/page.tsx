'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import BrandList from '../../components/brands/BrandList';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getBrands, Brand } from '../../services/brandService';

export default function BrandsListPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBrands(); 
      setBrands(data);
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
