'use client';
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

interface BrandFormData {
  marca: string;
  titular: string;
  status: string;
  pais_registro: string;
  imagen_url?: string;
}

interface NewBrandPreviewDetailProps {
  formData: BrandFormData;
  imageFile: File | null;
}

const NewBrandPreviewDetail: React.FC<NewBrandPreviewDetailProps> = ({ formData, imageFile }) => {
  const imageUrl = imageFile ? URL.createObjectURL(imageFile) : formData.imagen_url || '/assets/image.webp';

  return (
    <Card sx={{ mt: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Previsualización de la Marca
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CardMedia
                component="img"
                sx={{
                  width: 150,
                  height: 150,
                  objectFit: 'contain',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}
                image={imageUrl}
                alt="Imagen de la marca"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 12}}>
            <Typography variant="subtitle1" color="text.secondary">
              <strong>Marca:</strong> {formData.marca || 'No especificado'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              <strong>Titular:</strong> {formData.titular || 'No especificado'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              <strong>País de Registro:</strong> {formData.pais_registro || 'No especificado'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              <strong>Status:</strong> <Typography component="span" sx={{
                color: formData.status === 'activo' ? 'success.main' : formData.status === 'inactivo' ? 'error.main' : 'warning.main',
                fontWeight: 'bold'
              }}>
                {formData.status ? formData.status.toUpperCase() : 'No especificado'}
              </Typography>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default NewBrandPreviewDetail;