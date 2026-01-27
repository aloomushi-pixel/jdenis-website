import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    fullName: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (data: { email: string; password: string; fullName: string }) => Promise<boolean>;
    logout: () => void;
}

const API_URL = 'http://localhost:4000/api';

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                try {
                    const res = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!res.ok) return false;

                    const data = await res.json();
                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                    });
                    return true;
                } catch {
                    return false;
                }
            },

            register: async (data) => {
                try {
                    const res = await fetch(`${API_URL}/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...data, role: 'CLIENTE' }),
                    });

                    if (!res.ok) return false;

                    const result = await res.json();
                    set({
                        user: result.user,
                        token: result.token,
                        isAuthenticated: true,
                    });
                    return true;
                } catch {
                    return false;
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        { name: 'jdenis-auth' }
    )
);
