import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Link from 'next/link';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark'; 
import AddBusinessIcon from '@mui/icons-material/AddBusiness'; 

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
}) => {
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Menú
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding component={Link} href="/">
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding component={Link} href="/marcas">
          <ListItemButton>
            <ListItemIcon>
              <BrandingWatermarkIcon />
            </ListItemIcon>
            <ListItemText primary="Listar Marcas" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding component={Link} href="/marcas/nueva-marca">
          <ListItemButton>
            <ListItemIcon>
              <AddBusinessIcon />
            </ListItemIcon>
            <ListItemText primary="Registrar Marca" />
          </ListItemButton>
        </ListItem>
        
      </List>
      <Divider />
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
