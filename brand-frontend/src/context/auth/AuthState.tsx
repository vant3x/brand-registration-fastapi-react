'use client';

import React, { useReducer } from "react";
import AuthContext from "./AuthContext";
import authReducer from "./AuthReducer";


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


const AuthState = ({ children }: Props) => {
  const initialState = {
    token: null, // El access_token vivirá aquí, en memoria
    auth: null,
    user: null,
    message: null,
    errorSession: {},
    signupStatus: null
  };

  // definir reducer
  const [state, dispatch] = useReducer(authReducer, initialState);

  // registrar nuevos usuarios
  const signup = async (values: any) => {
    try {
      const response = await axiosClient.post("/users/", values);
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: {
          message: "Usuario creado correctamente", // Opcional: puedes usar un mensaje de la respuesta
          status: 201
        }
      });
    } catch (error: any) {
      dispatch({
        type: SIGNUP_ERROR,
        payload: error.response.data.detail,
      });
    }
    // limpia la alerta
    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERTS,
      });
    }, 4000);
  };

  // autenticar usuarios
  const login = async (values: any) => {
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

      // Inmediatamente después del login, obtenemos los datos del usuario
      await userAuthtenticate(access_token);

    } catch (error: any) {
      dispatch({
        type: LOGIN_ERROR,
        payload: error.response.data.detail,
      });
    }
    // limpia la alerta
    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERTS,
      });
    }, 4000);
  };

  // Retorna el usuario autenticado en base al JWT
  const userAuthtenticate = async (token: string | null) => {
    authToken(token); // Configura o limpia el token en las cabeceras de Axios

    if (!token) {
        dispatch({ type: LOGOUT });
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
    } catch (error: any) { 
      dispatch({
        type: SESSION_ERROR,
        payload: error?.response?.data?.detail,
      });
      // Si falla la autenticación del usuario, cerramos sesión
      logout();
    }
  };


  // cerrar la sesion
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("refreshToken");
    }
    authToken(null); // Limpia la cabecera de autorización
    dispatch({
      type: LOGOUT,
    });
  };

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
