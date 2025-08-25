'use client';
import React, { useState } from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import axiosClient from '../../config/axios'; 
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import { AxiosError } from "axios";


interface BrandFormData {
    marca: string;
    titular: string;
    status: string;
    pais_registro: string;
    imagen_url?: string;
}

const steps = ['Información Básica', 'Detalles de Contacto', 'Configuración Adicional'];

export default function BrandStepperForm() {
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [formData, setFormData] = React.useState<BrandFormData>({
    marca: '',
    titular: '',
    status: '',
    pais_registro: '',
    imagen_url: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name as string]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axiosClient.post('/brands/', formData);
      setSuccess('Marca registrada exitosamente!');
      setFormData({
        marca: '',
        titular: '',
        status: '',
        pais_registro: '',
        imagen_url: '',
      }); 
      router.push('/marcas'); 
    } catch (err) {
      const axiosError = err as AxiosError<{ detail: string }>;
      console.error('Error registering brand:', err);
      setError(axiosError.response?.data?.detail || 'Error al registrar la marca.');
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? 
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true,
    });
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              required
              id="marca"
              name="marca"
              label="Marca"
              value={formData.marca}
              onChange={handleChange}
            />
            <TextField
              required
              id="titular"
              name="titular"
              label="Titular"
              value={formData.titular}
              onChange={handleChange}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              required
              id="pais_registro"
              name="pais_registro"
              label="País de Registro"
              value={formData.pais_registro}
              onChange={handleChange}
            />
            <TextField
              id="imagen_url"
              name="imagen_url"
              label="URL de la Imagen (Opcional)"
              value={formData.imagen_url}
              onChange={handleChange}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl sx={{ minWidth: 200 }} required>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="activo">ACTIVO</MenuItem>
                <MenuItem value="inactivo">INACTIVO</MenuItem>
                <MenuItem value="pendiente de aprobacion">PENDIENTE DE APROBACION</MenuItem>
                <MenuItem value="rechazado">RECHAZADO</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      default:
        return <Typography>Paso desconocido</Typography>;
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              Todos los pasos completados - ¡has terminado!
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reiniciar</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ ml: 1 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Registrar Marca'}
              </Button>
            </Box>
            {error && (
              <Typography color="error" sx={{ m: 1 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success.main" sx={{ m: 1 }}>
                {success}
              </Typography>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box sx={{ mt: 2, mb: 1, py: 1 }}>
              {getStepContent(activeStep)}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Atrás
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                Siguiente
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" sx={{ display: 'inline-block' }}>
                    Paso {activeStep + 1} ya completado
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finalizar'
                      : 'Completar Paso'}
                  </Button>
                ))}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}