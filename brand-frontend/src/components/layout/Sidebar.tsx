import React, { useContext } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Link from 'next/link';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark'; 
import AddBusinessIcon from '@mui/icons-material/AddBusiness'; 
import Image from "next/image";
import AuthContext from '../../context/auth/AuthContext';
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
  const { auth } = useContext(AuthContext);
  const drawer = (
    <div>
      <Toolbar>
      
        <Image       src="/assets/image.webp"
        width={140}
        height={140}
        alt="Logo" />
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
        {auth && (
          <ListItem disablePadding component={Link} href="/marcas/nueva-marca-w">
            <ListItemButton>
              <ListItemIcon>
                <AddBusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Registrar Marca" />
            </ListItemButton>
          </ListItem>
        )}
        
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
