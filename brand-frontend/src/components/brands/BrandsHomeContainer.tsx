'use client';

import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import BrandItem from './BrandItem'; // Import the BrandItem component
import BrandDetailModal from './BrandDetailModal'; // Import the BrandDetailModal component

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

interface BrandsHomeContainerProps {
  brands: Brand[];
}

const BrandsHomeContainer: React.FC<BrandsHomeContainerProps> = ({ brands }) => {
  const [openBrandDetailModal, setOpenBrandDetailModal] = React.useState(false);
  const [selectedBrandForModal, setSelectedBrandForModal] = React.useState<Brand | null>(null);

  const handleOpenBrandDetailModal = (brand: Brand) => {
    setSelectedBrandForModal(brand);
    setOpenBrandDetailModal(true);
  };

  const handleCloseBrandDetailModal = () => {
    setOpenBrandDetailModal(false);
    setSelectedBrandForModal(null);
  };

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nuestras Marcas
        </Typography>
        {brands.length > 0 ? (
          <Grid container spacing={3}>
            {brands.map((brand) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={brand.id}>
                <BrandItem brand={brand} onViewDetails={handleOpenBrandDetailModal} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1">No se encontraron marcas.</Typography>
        )}
      </Box>

      <BrandDetailModal
        open={openBrandDetailModal}
        onClose={handleCloseBrandDetailModal}
        brand={selectedBrandForModal}
      />
    </React.Fragment>
  );
};

export default BrandsHomeContainer;
