export interface AppContextType {
  loading: boolean;
  error: string | null;
  snackbar: {
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
  showLoading: () => void;
  hideLoading: () => void;
  setError: (message: string) => void;
  clearError: () => void;
  showSnackbar: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideSnackbar: () => void;
}

export interface AppState {
  loading: boolean;
  error: string | null;
  snackbar: {
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
}