import { ErrorSession, User } from "@/context/auth/AuthReducer";

interface LoginFormValues {
    email: string;
    password: string;
    remember?: boolean;
}

interface SignupFormValues {
    email: string;
    password: string;
}

export interface AxiosErrorResponse {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export interface AuthContextType {
    message: string | null;
    auth: boolean | null;
    login: (user: LoginFormValues) => void;
    signup: (user: SignupFormValues) => void;
    userAuthtenticate: (token: string | null) => void;
    logout: () => void;
    errorSession: ErrorSession | null;
    token: string | null;
    signupStatus: number | null;
    user: User | null;
}