// Auth Services
// API calls for authentication

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        return response.json();
    },

    async logout(): Promise<void> {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },
};
