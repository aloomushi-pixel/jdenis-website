// Auth Hooks
// Export all auth-related hooks

import { useAuthStore } from '../../../store/authStore';

export const useAuth = () => {
    const { user, isAuthenticated, login, logout } = useAuthStore();

    return {
        user,
        isAuthenticated,
        login,
        logout,
        isAdmin: user?.role === 'ADMIN',
        role: user?.role,
    };
};

export { useAuthStore };
