'use client';

import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  CardMedia,
} from '@mui/material';
import axiosInstance from '../../config/axios';
import AuthContext from '../../context/auth/AuthContext';
import { Brand } from '../../services/brandService';

interface BrandDetailModalProps {
  open: boolean;
  onClose: () => void;
  brand: Brand | null;
}

const BrandDetailModal: React.FC<BrandDetailModalProps> = ({ open, onClose, brand }) => {
  const [presignedImageUrl, setPresignedImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [imageError, setImageError] = useState<string | null>(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchPresignedUrl = async () => {
      if (!brand?.id || !auth || !brand.imagen_url) {
        setLoadingImage(false);
        setPresignedImageUrl(null); 
        return;
      }
      setLoadingImage(true);
      setImageError(null);
      try {
        const response = await axiosInstance.get(`/brands/${brand.id}/image/presigned-url`);
        setPresignedImageUrl(response.data);
      } catch (err) {
        console.error("Error fetching presigned URL:", err);
        setImageError("Error al cargar la imagen.");
        setPresignedImageUrl(null); 
      } finally {
        setLoadingImage(false);
      }
    };

    if (open && brand) {
      fetchPresignedUrl();
    } else {
      setPresignedImageUrl(null);
      setLoadingImage(true);
      setImageError(null);
    }
  }, [open, brand, auth]);

  const imageUrlToDisplay = presignedImageUrl || brand?.imagen_url;
  const hasImage = !!imageUrlToDisplay;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalles de la Marca</DialogTitle>
      <DialogContent dividers>
        {brand ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {loadingImage ? (
              <CircularProgress />
            ) : imageError ? (
              <Typography color="error">{imageError}</Typography>
            ) : hasImage ? (
              <CardMedia
                component="img"
                image={imageUrlToDisplay}
                alt={brand.marca}
                sx={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  objectFit: 'contain',
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                }}
              />
            ) : (
              <Avatar sx={{ bgcolor: 'primary.main', width: 100, height: 100, fontSize: 48 }}>
                {brand.marca ? brand.marca.charAt(0).toUpperCase() : '?'}
              </Avatar>
            )}

            <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
              {brand.marca}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>Titular:</strong> {brand.titular}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>Estado:</strong> {brand.status}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>País de Registro:</strong> {brand.pais_registro}
            </Typography>
            {brand.created_at && (
              <Typography variant="body2" color="text.secondary">
                Creado: {new Date(brand.created_at).toLocaleDateString()}
              </Typography>
            )}
            {brand.updated_at && (
              <Typography variant="body2" color="text.secondary">
                Actualizado: {new Date(brand.updated_at).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography>No se ha seleccionado ninguna marca.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BrandDetailModal;
