'use client';

import React, { useEffect, useState, useContext } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import axiosClient from '../../config/axios';
import authContext from "../../context/auth/AuthContext";
import { AuthContextType } from "../../interfaces/AuthContextType";
import BrandRegistrationForm from '../forms/BrandRegistrationForm'; // Import the form

interface Brand {
  id: string;
  marca: string;
  titular: string;
  status: string;
  pais_registro: string;
  imagen_url?: string;
}

interface BrandDetailsClientProps {
  brandId: string;
}

const BrandDetailsClient: React.FC<BrandDetailsClientProps> = ({ brandId }) => {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const AuthContext = useContext<AuthContextType>(authContext);
  const { token, userAuthtenticate } = AuthContext; // Get token from AuthContext

  useEffect(() => {
    const fetchBrand = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) {
          console.warn("No access token available in AuthContext. Attempting to re-authenticate.");
        }

        const res = await axiosClient.get(`/brands/${brandId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBrand({
          ...res.data,
          status: res.data.status.toUpperCase(), 
        });
      } catch (err: any) {
        console.error(`Error fetching brand with ID ${brandId}:`, err);
        setError(err.response?.data?.detail || 'Error al cargar la marca.');
      } finally {
        setLoading(false);
      }
    };

    if (brandId && token) { 
      fetchBrand();
    } else if (!token && !loading) { 
        setError("No autenticado. Por favor, inicie sesión.");
        setLoading(false);
    }
  }, [brandId, token, userAuthtenticate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!brand) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Marca no encontrada.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Editar Marca: {brand.marca} (ID: {brand.id})
      </Typography>
      <BrandRegistrationForm
        initialData={brand}
        isEditMode={true}
        brandId={brandId}
        onSuccess={() => {
          console.log('Marca actualizada exitosamente!');
        }}
      />
    </Box>
  );
};

export default BrandDetailsClient;
