'use client';
import React, { useReducer, useCallback } from 'react';
import type { AppState } from '../../interfaces/AppContextType';
import AppContext from './AppContext';
import { appReducer } from './AppReducer';
import {
  SHOW_LOADING,
  HIDE_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  SHOW_SNACKBAR,
  HIDE_SNACKBAR,
} from '../types';

interface AppStateProps {
  children: React.ReactNode;
}

const AppState: React.FC<AppStateProps> = ({ children }) => {
  const initialState: AppState = {
    loading: false,
    error: null,
    snackbar: {
      open: false,
      message: '',
      type: 'info',
    },
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  const showLoading = useCallback(() => {
    dispatch({ type: SHOW_LOADING });
  }, []);

  const hideLoading = useCallback(() => {
    dispatch({ type: HIDE_LOADING });
  }, []);

  const setError = useCallback((message: string) => {
    dispatch({ type: SET_ERROR, payload: message });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: CLEAR_ERROR });
  }, []);

  const showSnackbar = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    dispatch({ type: SHOW_SNACKBAR, payload: { message, type } });
  }, []);

  const hideSnackbar = useCallback(() => {
    dispatch({ type: HIDE_SNACKBAR });
  }, []);

  return (
    <AppContext.Provider
      value={{
        loading: state.loading,
        error: state.error,
        snackbar: state.snackbar,
        showLoading,
        hideLoading,
        setError,
        clearError,
        showSnackbar,
        hideSnackbar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppState;