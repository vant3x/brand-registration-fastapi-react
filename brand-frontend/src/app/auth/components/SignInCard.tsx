"use client";
import React, { useContext, useEffect } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { SitemarkIcon } from './CustomIcons';

import authContext from "../../../context/auth/AuthContext";
import { AuthContextType } from "../../../interfaces/AuthContextType";
import axiosClient from "../../../config/axios";

interface IFormInput {
  email: string;
  password: string;
  remember?: boolean;
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {

  const AuthContext = useContext<AuthContextType>(authContext);
  const { message, auth, login, errorSession } = AuthContext;

  const [open, setOpen] = React.useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    login(data)
  };

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Iniciar Sesión
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            id="email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            {...register('email', { 
              required: 'Por favor, introduce tu dirección de correo electrónico.',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Por favor, introduce una dirección de correo electrónico válida.'
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            color={errors.email ? 'error' : 'primary'}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="password">Contraseña</FormLabel>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'baseline' }}
            >
              Cambiar contraseña?
            </Link>
          </Box>
          <TextField
            id="password"
            type="password"
            placeholder="••••••"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
         
            {...register('password', {
              required: 'Por favor, introduce tu contraseña.',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres.'
              }
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            color={errors.password ? 'error' : 'primary'}
          />
        </FormControl>
        <FormControlLabel
          control={<Checkbox color="primary" {...register('remember')} />}
          label="Recordarme"
        />
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button type="submit" fullWidth variant="contained">
          Iniciar Sesión
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          ¿No tienes una cuenta?{' '}
          <span>
            <Link
              href="/material-ui/getting-started/templates/sign-in/"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Registrarse
            </Link>
          </span>
        </Typography>
      </form>
      <Divider>o</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        
      </Box>
    </Card>
  );
}
