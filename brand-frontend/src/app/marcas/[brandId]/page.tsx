import MainLayout from '../../../components/layout/MainLayout';
import BrandDetailsClient from '../../../components/brands/BrandDetailsClient';
import { Typography } from '@mui/material';

interface BrandEditPageProps {
  params: { brandId: string };
}

export default async function BrandEditPage({ params }: BrandEditPageProps) {
  const { brandId } = params;

  return (
    <MainLayout>
      <BrandDetailsClient brandId={brandId} />
    </MainLayout>
  );
}
