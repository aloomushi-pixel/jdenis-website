
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface User {
    id: string;
    email: string;
    fullName: string;
    name?: string; // Alias for compatibility
    role: string;
    avatar_url?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithOAuth: (provider: 'google' | 'facebook') => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            loading: true,

            checkSession: async () => {
                try {
                    set({ loading: true });
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        // Fetch the role from the public database table instead of user metadata
                        const { data: publicUser } = await supabase
                            .from('users')
                            .select('role')
                            .eq('id', session.user.id)
                            .maybeSingle();

                        // Force DISTRIBUIDOR role for our test account
                        const effectiveRole = session.user.email === 'distribuidor@jdenis.com'
                            ? 'DISTRIBUIDOR'
                            : (publicUser?.role || session.user.user_metadata?.role || 'CLIENTE');

                        set({
                            user: {
                                id: session.user.id,
                                email: session.user.email!,
                                fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                                role: effectiveRole,
                                avatar_url: session.user.user_metadata?.avatar_url
                            },
                            isAuthenticated: true
                        });
                    } else {
                        set({ user: null, isAuthenticated: false });
                    }
                } catch (error) {
                    console.error('Session check failed', error);
                } finally {
                    set({ loading: false });
                }
            },

            login: async (email, password) => {
                set({ loading: true });
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });

                    if (error) throw error;
                    if (!data.user) throw new Error('No user returned');

                    // Fetch the role from the public database table instead of user metadata
                    const { data: publicUser } = await supabase
                        .from('users')
                        .select('role')
                        .eq('id', data.user.id)
                        .single();

                    set({
                        user: {
                            id: data.user.id,
                            email: data.user.email!,
                            fullName: data.user.user_metadata.full_name || email.split('@')[0],
                            name: data.user.user_metadata.full_name || email.split('@')[0],
                            role: publicUser?.role || data.user.user_metadata.role || 'CLIENTE',
                        },
                        isAuthenticated: true,
                    });
                } catch (error) {
                    console.error('Login error:', error);
                    throw error;
                } finally {
                    set({ loading: false });
                }
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

            register: async (email, password, fullName) => {
                set({ loading: true });
                try {
                    const { data: result, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                full_name: fullName,
                                role: 'CLIENTE',
                            },
                        },
                    });

                    if (error) throw error;
                    if (!result.user) throw new Error('No user returned');

                    if (result.session) {
                        set({
                            user: {
                                id: result.user.id,
                                email: result.user.email!,
                                fullName: fullName,
                                name: fullName,
                                role: 'CLIENTE',
                            },
                            isAuthenticated: true,
                        });
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                } finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                set({ loading: true });
                await supabase.auth.signOut();
                set({ user: null, isAuthenticated: false, loading: false });
            },

            resetPassword: async (email: string) => {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/restablecer-contrasena`,
                });
                if (error) throw error;
            },

            updatePassword: async (newPassword: string) => {
                const { error } = await supabase.auth.updateUser({
                    password: newPassword,
                });
                if (error) throw error;
            },
        }),
        {
            name: 'jdenis-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
