import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'TRANSPORTISTA' | 'ALMACEN_MATERIA_PRIMA' | 'ALMACEN_PRODUCTO_FINAL' | 'FABRICA' | 'EJECUTIVO' | 'CLIENTE';

interface User {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            login: (token, user) => {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                set({ token, user, isAuthenticated: true });
            },
            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ token: null, user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
