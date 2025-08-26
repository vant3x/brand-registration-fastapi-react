'use client';

import React, { useReducer, useEffect, useCallback, useContext } from "react"; // Added useContext
import AuthContext from "./AuthContext";
import authReducer from "./AuthReducer";
import Cookies from 'js-cookie';


import {
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  REMOVE_ALERTS,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SESSION_ERROR,
  USER_AUTHENTICATE,
  LOGOUT,
} from "../types";

import axiosClient from "../../config/axios";
import authToken from "../../config/authToken";
import { Props } from "../../interfaces/Props.interface";
import AppContext from "../app/AppContext"; // Import AppContext
import { AppContextType } from "../../interfaces/AppContextType"; // Import AppContextType

// Import AuthState from AuthReducer to ensure consistency
import { AuthState as ReducerAuthState } from "./AuthReducer";

// Define interfaces for form values
interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

const AuthState = ({ children }: Props) => {
  const initialState: ReducerAuthState = { 
    token: null,
    auth: null,
    user: null,
    message: null,
    errorSession: null, 
    signupStatus: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);
  const appCtx = useContext<AppContextType | undefined>(AppContext); 
  if (!appCtx) {
    throw new Error("AuthState must be used within an AppProvider");
  }

  const { showSnackbar } = appCtx; 

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("refreshToken");
    }
    Cookies.remove('token', { path: '/' }); 
    authToken(null);
    dispatch({
      type: LOGOUT,
    });
  }, []);

  const userAuthtenticate = useCallback(async (token: string | null) => {
    authToken(token);

    if (!token) {
        logout();
        return;
    }

    try {
      const response = await axiosClient.get("/users/me");
      if (response.data) {
        dispatch({
          type: USER_AUTHENTICATE,
          payload: response.data,
        });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse;
      dispatch({
        type: SESSION_ERROR,
        payload: axiosError?.response?.data?.detail || null,
      });
      logout();
    }
  }, [logout]);

  const signup = async (values: SignupFormValues) => { 
    try {
      await axiosClient.post("/users/", values); 
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: {
          message: "Usuario creado correctamente",
          status: 201
        }
      });
      showSnackbar("Usuario creado correctamente", "success"); 
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse;
      dispatch({
        type: SIGNUP_ERROR,
        payload: axiosError.response?.data?.detail || null, 
      });
      showSnackbar(axiosError.response?.data?.detail || "Error al crear usuario", "error"); 
    }
    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERTS,
      });
    }, 4000);
  };

  const login = async (values: LoginFormValues) => { 
    try {
      const response = await axiosClient.post("/auth/token", values);
      const { access_token, refresh_token } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("refreshToken", refresh_token);
      }

      dispatch({
        type: LOGIN_SUCCESS,
        payload: { token: access_token },
      });

      console.log('Setting token cookie with access_token:', access_token);
      Cookies.set('token', access_token, { path: '/', expires: 7 }); 
      await userAuthtenticate(access_token);
      showSnackbar("Inicio de sesión exitoso", "success"); 

    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse;
      dispatch({
        type: LOGIN_ERROR,
        payload: axiosError.response?.data?.detail || null, 
      });
      showSnackbar(axiosError.response?.data?.detail || "Credenciales incorrectas", "error"); 
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (typeof window === "undefined") return;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axiosClient.post("/auth/refresh", { refresh_token: refreshToken });
          const { access_token } = response.data;

          dispatch({
            type: LOGIN_SUCCESS,
            payload: { token: access_token },
          });
          await userAuthtenticate(access_token);
        } catch (error) {
          logout();
        }
      } else {
        logout();
      }
    };

    checkAuthStatus();
  }, [userAuthtenticate, logout]);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        auth: state.auth,
        user: state.user,
        message: state.message,
        errorSession: state.errorSession,
        signupStatus: state.signupStatus,
        signup,
        login,
        userAuthtenticate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;