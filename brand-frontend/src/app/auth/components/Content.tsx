"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { SitemarkIcon } from './CustomIcons';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Gestión eficiente de marcas',
    description:
      'Nuestra plataforma se adapta a tus necesidades, optimizando la eficiencia y simplificando la gestión de tus marcas.',
  },
  {
    icon: <ConstructionRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Seguridad y durabilidad de tus datos',
    description:
      'Experimenta una durabilidad inigualable que va más allá, asegurando una inversión duradera en la protección de tus marcas.',
  },
  {
    icon: <ThumbUpAltRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Interfaz intuitiva y fácil de usar',
    description:
      'Integra nuestra herramienta en tu rutina con una interfaz sencilla y amigable, diseñada para tu comodidad.',
  },
  {
    icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Herramientas avanzadas para tu gestión',
    description:
      'Mantente a la vanguardia con funcionalidades que establecen nuevos estándares, abordando tus necesidades de gestión de marcas de manera superior.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <SitemarkIcon />
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}