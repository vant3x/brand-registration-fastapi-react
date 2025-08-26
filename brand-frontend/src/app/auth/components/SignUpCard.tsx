"use client";
import React, { useContext, useEffect, useState } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
 
import authContext from "../../../context/auth/AuthContext";
import { AuthContextType } from "../../../interfaces/AuthContextType";

interface IFormInput {
  name: string;
  email: string;
  password: string;
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

export default function SignUpCard() {

  const AuthContext = useContext<AuthContextType>(authContext);
  const { auth, signup } = AuthContext;
  const router = useRouter();

  useEffect(() => {
    if (auth) {
      router.push('/');
    }
  }, [auth, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    signup(data)
  };

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
    
      
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Crear Cuenta
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}
      >
        <FormControl>
          <FormLabel htmlFor="name">Nombre</FormLabel>
          <TextField
            id="name"
            type="text"
            placeholder="your name"
            autoComplete="name"
            autoFocus
            required
            fullWidth
            variant="outlined"
            {...register('name', { 
              required: 'Por favor, introduce tu nombre.',
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
            color={errors.name ? 'error' : 'primary'}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            id="email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
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
          <FormLabel htmlFor="password">Contraseña</FormLabel>
          <TextField
            id="password"
            type="password"
            placeholder="••••••"
            autoComplete="new-password"
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
        <Button type="submit" fullWidth variant="contained">
          Crear Cuenta
        </Button>
        <Divider>o</Divider>
        <Typography sx={{ textAlign: 'center' }}>
          ¿Ya tienes una cuenta?{' '}
          <span>
            <Link
              href="/auth/login"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Iniciar Sesión
            </Link>
          </span>
        </Typography>
      </form>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        
      </Box>
    </Card>
  );
}