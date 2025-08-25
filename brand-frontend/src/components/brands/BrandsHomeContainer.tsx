
'use client';
import * as React from 'react';
import { Typography, Box } from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import BrandItem from './BrandItem';
import BrandDetailModal from './BrandDetailModal'; 
import { Brand } from '../../services/brandService';

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
