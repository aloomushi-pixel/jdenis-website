import { create } from 'zustand';
import { persist } from 'zustand/middleware';



import { supabase } from '../lib/supabase';

interface User {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatar_url?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    loginWithOAuth: (provider: 'google' | 'facebook') => Promise<void>;
    register: (data: { email: string; password: string; fullName: string }) => Promise<boolean>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            checkSession: async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    set({
                        user: {
                            id: session.user.id,
                            email: session.user.email!,
                            fullName: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
                            role: session.user.user_metadata.role || 'CLIENTE',
                            avatar_url: session.user.user_metadata.avatar_url
                        },
                        token: session.access_token,
                        isAuthenticated: true
                    });
                } else {
                    set({ user: null, token: null, isAuthenticated: false });
                }
            },

            login: async (email, password) => {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error || !data.user) return false;

                set({
                    user: {
                        id: data.user.id,
                        email: data.user.email!,
                        fullName: data.user.user_metadata.full_name || email.split('@')[0],
                        role: data.user.user_metadata.role || 'CLIENTE',
                    },
                    token: data.session.access_token,
                    isAuthenticated: true,
                });
                return true;
            },

            loginWithOAuth: async (provider) => {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider,
                    options: {
                        redirectTo: `${window.location.origin}/mi-cuenta`
                    }
                });
                if (error) console.error('OAuth Error:', error);
            },

            register: async (data) => {
                const { data: result, error } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            full_name: data.fullName,
                            role: 'CLIENTE',
                        },
                    },
                });

                if (error || !result.user) return false;

                // Note: If email confirmation is enabled, user won't be signed in automatically
                // But for now we assume they are or we handle it.
                if (result.session) {
                    set({
                        user: {
                            id: result.user.id,
                            email: result.user.email!,
                            fullName: data.fullName,
                            role: 'CLIENTE',
                        },
                        token: result.session.access_token,
                        isAuthenticated: true,
                    });
                    return true;
                }
                return true; // Registration successful, maybe waiting for email
            },

            logout: async () => {
                await supabase.auth.signOut();
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        { name: 'jdenis-auth' }
    )
);
