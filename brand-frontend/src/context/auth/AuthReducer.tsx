import {
    SIGNUP_SUCCESS,
    SIGNUP_ERROR,
    REMOVE_ALERTS,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    SESSION_ERROR,
    USER_AUTHENTICATE,
    LOGOUT
} from '../types';

export interface User {
  full_name?: string;
  email: string;
  password?: string;
}

export interface ErrorSession {
  error: boolean;
  statusCode: number | null;
  detail?: string;
}

export interface AuthState {
    token: string | null;
    auth: boolean | null;
    user: User | null;
    message: string | null;
    errorSession: ErrorSession | null;
    signupStatus: number | null;
}

type AuthAction =
    | { type: typeof SIGNUP_SUCCESS; payload: { message: string; status: number } }
    | { type: typeof LOGIN_SUCCESS; payload: { token: string } }
    | { type: typeof USER_AUTHENTICATE; payload: User }
    | { type: typeof LOGOUT }
    | { type: typeof LOGIN_ERROR; payload: string | null }
    | { type: typeof SESSION_ERROR; payload: string | null }
    | { type: typeof SIGNUP_ERROR; payload: string | null }
    | { type: typeof REMOVE_ALERTS };


const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case SIGNUP_SUCCESS:
            // Type assertion para indicar que sabemos que payload no es null
            const signupPayload = action.payload as { message: string; status: number };
            return {
                ...state,
                message: signupPayload.message,
                signupStatus: signupPayload.status
            };
        case LOGIN_SUCCESS:
            // Type assertion para el token
            const loginPayload = action.payload as { token: string };
            return {
                ...state,
                token: loginPayload.token,
                auth: true,
                message: null,
                errorSession: null
            };
        case USER_AUTHENTICATE:
            // Type assertion para el usuario
            const userPayload = action.payload as User;
            return {
                ...state,
                user: userPayload,
                auth: true
            };
        case LOGOUT:
            return {
                ...state,
                token: null,
                user: null,
                auth: null,
                message: null,
                errorSession: null
            };
        case LOGIN_ERROR:
            return {
                ...state,
                token: null,
                user: null,
                auth: null,
                message: action.payload,
                errorSession: null
            };
        case SESSION_ERROR:
            return {
                ...state,
                token: null,
                user: null,
                auth: null,
                message: action.payload,
                errorSession: null
            };
        case SIGNUP_ERROR:
            const signupErrorPayload = action.payload as string | null;
            return {
                ...state,
                message: signupErrorPayload
            };
        case REMOVE_ALERTS:
            return {
                ...state,
                message: null
            };
        default:
            return state;
    }
};

export default authReducer;