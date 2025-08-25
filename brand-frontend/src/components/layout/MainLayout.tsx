
'use client';

import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, Stack, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import Sidebar from './Sidebar';
import authContext from "../../context/auth/AuthContext";
import { AuthContextType } from "../../interfaces/AuthContextType";

const drawerWidth = 240;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const AuthContext = useContext<AuthContextType>(authContext);
  const { auth } = AuthContext;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="abrir menú"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            SignaIP
          </Typography>
          <Button color="inherit" component={Link} href="/">Inicio</Button>
          {auth ? (
            <>
              <Button color="inherit" component={Link} href="/dashboard">Administrar</Button>
              <Button color="inherit" onClick={AuthContext.logout}>Cerrar Sesión</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} href="/auth/login">Iniciar Sesión</Button>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: { xs: '56px', sm: '64px' }
          }}
        >
          <Toolbar />
          <Container maxWidth="lg">
            <Stack spacing={3}>
              {children}
            </Stack>
          </Container>
        </Box>
      </Box>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} SignaIP. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
