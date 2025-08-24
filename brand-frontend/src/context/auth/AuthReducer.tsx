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

const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case SIGNUP_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                signupStatus: action.payload.status
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                token: action.payload.token,
                auth: true,
                message: null,
                errorSession: null
            };
        case USER_AUTHENTICATE:
            return {
                ...state,
                user: action.payload,
                auth: true
            };
        case LOGOUT:
        case LOGIN_ERROR:
        case SESSION_ERROR:
            return {
                ...state,
                token: null,
                user: null,
                auth: null,
                message: action.payload,
                errorSession: action.payload
            };
        case SIGNUP_ERROR:
            return {
                ...state,
                message: action.payload
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