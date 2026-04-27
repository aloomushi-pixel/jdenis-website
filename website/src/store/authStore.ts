
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
    register: (userData: {
        email: string;
        fullName: string;
        phone?: string;
        wantsInvoice?: boolean;
        razonSocial?: string;
        rfc?: string;
        emailFacturacion?: string;
        regimenFiscal?: string;
        usoCFDI?: string;
    }) => Promise<boolean>;
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

                        set({
                            user: {
                                id: session.user.id,
                                email: session.user.email!,
                                fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                                role: publicUser?.role || session.user.user_metadata?.role || 'CLIENTE',
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
                        .maybeSingle();

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
                        redirectTo: `https://jdenis.store/mi-cuenta`
                    }
                });
                if (error) console.error('OAuth Error:', error);
            },

            register: async (userData) => {
                set({ loading: true });
                try {
                    // Generate a strong random password to satisfy Supabase requirements.
                    // The user will set their actual password via the email link which redirects to /restablecer-contrasena
                    const randomPassword = crypto.randomUUID() + "A1!";

                    const { data: result, error } = await supabase.auth.signUp({
                        email: userData.email,
                        password: randomPassword,
                        options: {
                            data: {
                                full_name: userData.fullName,
                                role: 'CLIENTE',
                                phone: userData.phone || null,
                                wants_invoice: userData.wantsInvoice || false,
                                billing_info: userData.wantsInvoice ? {
                                    razon_social: userData.razonSocial,
                                    rfc: userData.rfc,
                                    email_facturacion: userData.emailFacturacion,
                                    regimen_fiscal: userData.regimenFiscal,
                                    uso_cfdi: userData.usoCFDI
                                } : null
                            },
                            emailRedirectTo: `${window.location.origin}/restablecer-contrasena`
                        },
                    });

                    if (error) throw error;
                    if (!result.user) throw new Error('No user returned');

                    // Note: Insertion into public.users is handled by a database trigger 
                    // because client-side insertion is blocked by RLS when email confirmation is required.

                    if (result.session) {
                        set({
                            user: {
                                id: result.user.id,
                                email: result.user.email!,
                                fullName: userData.fullName,
                                name: userData.fullName,
                                role: 'CLIENTE',
                            },
                            isAuthenticated: true,
                        });
                        return false; // Does not require email confirmation
                    } else {
                        return true; // Requires email confirmation
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                    throw error;
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
                    redirectTo: `https://jdenis.store/restablecer-contrasena`,
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
