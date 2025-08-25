import {
  SHOW_LOADING,
  HIDE_LOADING,
  SET_ERROR,
  CLEAR_ERROR,
  SHOW_SNACKBAR,
  HIDE_SNACKBAR,
} from '../../context/types';

import { AppContextType } from '../../interfaces/AppContextType';

type Action =
  | { type: typeof SHOW_LOADING }
  | { type: typeof HIDE_LOADING }
  | { type: typeof SET_ERROR; payload: string }
  | { type: typeof CLEAR_ERROR }
  | { type: typeof SHOW_SNACKBAR; payload: { message: string; type: 'success' | 'error' | 'info' | 'warning' } }
  | { type: typeof HIDE_SNACKBAR };

export const appReducer = (state: AppContextType, action: Action) => {
  switch (action.type) {
    case SHOW_LOADING:
      return {
        ...state,
        loading: true,
      };
    case HIDE_LOADING:
      return {
        ...state,
        loading: false,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case SHOW_SNACKBAR:
      return {
        ...state,
        snackbar: {
          open: true,
          message: action.payload.message,
          type: action.payload.type,
        },
      };
    case HIDE_SNACKBAR:
      return {
        ...state,
        snackbar: {
          ...state.snackbar,
          open: false,
        },
      };
    default:
      return state;
  }
};