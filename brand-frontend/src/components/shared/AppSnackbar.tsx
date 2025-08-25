import React, { useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import AppContext from '../../context/app/AppContext';
import { AppContextType } from '../../interfaces/AppContextType';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props, ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AppSnackbar: React.FC = () => {
  const appCtx = useContext<AppContextType | undefined>(AppContext);

  if (!appCtx) {
    throw new Error("AppSnackbar must be used within an AppProvider");
  }

  const { snackbar, hideSnackbar } = appCtx;

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideSnackbar();
  };

  return (
    <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={snackbar.type} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default AppSnackbar;