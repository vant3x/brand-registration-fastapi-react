'use client';

import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import axiosClient from '../../config/axios';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

interface BrandFormData {
    marca: string;
    titular: string;
    status: string;
    pais_registro: string;
    imagen_url?: string;
}

interface BrandRegistrationFormProps {
    initialData?: BrandFormData;
    onSuccess?: () => void; 
    isEditMode?: boolean;
    brandId?: string; 
}

const BrandRegistrationForm: React.FC<BrandRegistrationFormProps> = ({
    initialData,
    onSuccess,
    isEditMode = false,
    brandId,
}) => {
    const router = useRouter();
    const [formData, setFormData] = useState<BrandFormData>(initialData ? {
        ...initialData,
        imagen_url: initialData.imagen_url || '', 
    } : {
        marca: '',
        titular: '',
        status: '',
        pais_registro: '',
        imagen_url: '',
    });

    useEffect(() => {
        console.log("BrandRegistrationForm - formData.status:", formData.status);
    }, [formData.status]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name as string]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isEditMode) {
                if (!brandId) {
                    throw new Error("Brand ID is required for edit mode.");
                }
                await axiosClient.put(`/brands/${brandId}`, formData);
                setSuccess('Marca actualizada exitosamente!');
            } else {
                await axiosClient.post('/brands/', formData); 
                setSuccess('Marca registrada exitosamente!');
            }

            if (!isEditMode) {
                setFormData({
                    marca: '',
                    titular: '',
                    status: '',
                    pais_registro: '',
                    imagen_url: '',
                });
            }

            if (onSuccess) {
                onSuccess();
            } else if (!isEditMode) { 
                router.push('/marcas');
            }
        } catch (err) { 
            const axiosError = err as AxiosError<{ detail: string }>;
            console.error(isEditMode ? 'Error updating brand:' : 'Error registering brand:', err);
            setError(axiosError.response?.data?.detail || (isEditMode ? 'Error al actualizar la marca.' : 'Error al registrar la marca.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '45ch' } }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <Typography variant="h6" gutterBottom>
                {isEditMode ? 'Editar Datos de la Marca' : 'Registrar Nueva Marca'}
            </Typography>
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
            <FormControl sx={{ m: 1, width: '45ch' }} required>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                >
                    <MenuItem value="ACTIVO">ACTIVO</MenuItem>
                    <MenuItem value="INACTIVA">INACTIVA</MenuItem>
                    <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
                </Select>
            </FormControl>
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
            <Box sx={{ m: 1, position: 'relative' }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Actualizar Marca' : 'Registrar Marca')}
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
        </Box>
    );
};

export default BrandRegistrationForm;