export interface LoginCredentials {
    email: string,
    password: string,
}

export interface LoginFormData extends LoginCredentials {
    rememberMe?: boolean;
}

export interface RegisterFormData extends LoginCredentials {
    name: string;
    confirmPassword: string;
}

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    createdAt: number;
}

export interface AuthSession {
    userId: string;
    createdAt: number;
}

export interface LoginResponse {
    success: boolean,
    token?: string,
    user?: {
        id: string;
        email: string;
        name: string;
    };
    error?: string
}

export interface LoginFormErrors {
    email?: string,
    password?: string,
    general?: string
}

export interface RegisterFormErrors {
    name?: string,
    email?: string,
    password?: string,
    confirmPassword?: string,
    general?: string
}

export interface LoginFormState {
    isLoading: boolean;
    errors: LoginFormErrors;
}

export type LoginStatus = "idle" | "loading" | "success" | "error"