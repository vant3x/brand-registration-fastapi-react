'use client';

import { createContext } from "react";
import { AuthContextType } from "../../interfaces/AuthContextType";

const AuthContext = createContext<AuthContextType>({
    token: null,
    message: null,
    auth: null,
    login: async () => {},
    errorSession: null,
    userAuthtenticate: async () => {},
    user: null,
    signup: async () => {},
    logout: () => {},
    signupStatus: null
});

export default AuthContext;