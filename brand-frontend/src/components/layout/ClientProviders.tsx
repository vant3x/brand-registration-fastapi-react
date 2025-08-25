'use client';

import React from 'react';
import AuthState from '../../context/auth/AuthState';
import AppState from '../../context/app/AppState';
import AppSnackbar from '../shared/AppSnackbar';

interface ClientProvidersProps {
  children: React.ReactNode;
}

const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <AppState>
      <AuthState>
        {children}
      </AuthState>
      <AppSnackbar />
    </AppState>
  );
};

export default ClientProviders;