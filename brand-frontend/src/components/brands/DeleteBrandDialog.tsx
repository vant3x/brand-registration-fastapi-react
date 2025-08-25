import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface DeleteBrandDialogProps {
  open: boolean;
  brandId: string | null;
  onClose: () => void;
  onConfirmDelete: (brandId: string) => void;
}

const DeleteBrandDialog: React.FC<DeleteBrandDialogProps> = ({
  open,
  brandId,
  onClose,
  onConfirmDelete,
}) => {
  const handleConfirm = () => {
    if (brandId) {
      onConfirmDelete(brandId);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Confirmar Eliminación"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ¿Estás seguro de que quieres eliminar esta marca? Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirm} autoFocus color="error">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBrandDialog;