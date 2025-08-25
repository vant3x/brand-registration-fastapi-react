'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, CardActions, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

import axiosInstance from '../../config/axios';
import AuthContext from '../../context/auth/AuthContext';

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

interface BrandItemProps {
  brand: Brand;
  onViewDetails: (brand: Brand) => void; 
}

const BrandItem: React.FC<BrandItemProps> = ({ brand, onViewDetails }) => {
  const [presignedImageUrl, setPresignedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { auth } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const fetchPresignedUrl = async () => {
      if (!brand.id || !auth) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/brands/${brand.id}/image/presigned-url`);
        setPresignedImageUrl(response.data);
      } catch (err) {
        setError("Error al cargar la imagen.");
      } finally {
        setLoading(false);
      }
    };

    fetchPresignedUrl();
  }, [brand.id, auth]);

  const imageUrlToDisplay = presignedImageUrl || brand.imagen_url || 'https://via.placeholder.com/140?text=No+Image';

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrlToDisplay}
        alt={brand.marca}
        sx={{ objectFit: 'contain', p: 1 }}
      />
      {loading && <Typography variant="body2" color="text.secondary">Cargando imagen...</Typography>}
      {error && <Typography variant="body2" color="error">{error}</Typography>}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {brand.marca}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Titular: {brand.titular}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Estado: {brand.status}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          País: {brand.pais_registro}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onViewDetails(brand)}>Ver Detalles</Button>
        <Button size="small" onClick={() => router.push('/marcas/editar/'+brand.id)}>Editar</Button>
        <Button size="small" onClick={() => onViewDetails(brand)}>Eliminar</Button>
      </CardActions>
    </Card>
  );
};

export default BrandItem;
