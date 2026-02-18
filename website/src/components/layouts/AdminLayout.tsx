
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import type { UserRole } from '../../lib/erp';
import { useAuthStore } from '../../store/authStore';

type MenuItem = {
    path: string;
    label: string;
    icon: string;
    roles: UserRole[];
};

const menuItems: MenuItem[] = [
    { path: '/admin', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_MP', 'ALMACEN_PF', 'TRANSPORTISTA'] },
    { path: '/admin/users', label: 'Usuarios', icon: '👥', roles: ['ADMIN'] },
    { path: '/admin/resources', label: 'Recursos', icon: '📦', roles: ['ADMIN', 'EJECUTIVO', 'ALMACEN_MP', 'ALMACEN_PF'] },
    { path: '/admin/production', label: 'Fábrica', icon: '🏭', roles: ['ADMIN', 'FABRICA'] },
    { path: '/admin/purchases', label: 'Compras', icon: '🛒', roles: ['ADMIN', 'EJECUTIVO'] },
    { path: '/admin/sales', label: 'Ventas', icon: '💰', roles: ['ADMIN', 'EJECUTIVO'] },
    { path: '/admin/transport', label: 'Transporte', icon: '🚛', roles: ['ADMIN', 'TRANSPORTISTA', 'EJECUTIVO'] },
    { path: '/admin/packaging', label: 'Embalaje', icon: '📋', roles: ['ADMIN', 'FABRICA', 'ALMACEN_PF'] },
    { path: '/admin/event-log', label: 'Log de Eventos', icon: '📝', roles: ['ADMIN', 'EJECUTIVO'] },
    { path: '/admin/products', label: 'Productos B2B', icon: '🏷️', roles: ['ADMIN', 'EJECUTIVO'] },
    { path: '/admin/orders', label: 'Pedidos B2B', icon: '🧾', roles: ['ADMIN', 'EJECUTIVO'] },
    { path: '/admin/reviews', label: 'Reseñas', icon: '⭐', roles: ['ADMIN'] },
    { path: '/admin/academy', label: 'Academia', icon: '🎓', roles: ['ADMIN', 'EJECUTIVO'] },
    { path: '/admin/blog', label: 'Blog', icon: '✍️', roles: ['ADMIN', 'EJECUTIVO'] },
    { path: '/admin/reels', label: 'Reels', icon: '🎬', roles: ['ADMIN', 'EJECUTIVO'] },
];

const ERP_ROLES: UserRole[] = ['ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_MP', 'ALMACEN_PF', 'TRANSPORTISTA'];

const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Administrador', EJECUTIVO: 'Ejecutivo', FABRICA: 'Fábrica',
    ALMACEN_MP: 'Almacén MP', ALMACEN_PF: 'Almacén PF', TRANSPORTISTA: 'Transportista',
};

export default function AdminLayout() {
    const { user, isAuthenticated, loading, logout } = useAuthStore();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Allow all ERP roles
    const userRole = user?.role as UserRole;
    if (!isAuthenticated || !ERP_ROLES.includes(userRole)) {
        return <Navigate to="/login" replace />;
    }

    const visibleMenu = menuItems.filter(item => item.roles.includes(userRole));

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 256 : 80 }}
                className="bg-white shadow-lg z-20 flex flex-col transition-all duration-300 overflow-hidden"
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-100">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        {isSidebarOpen ? 'J.Denis ERP' : 'JD'}
                    </span>
                </div>

                <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
                    {visibleMenu.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-2.5 rounded-lg transition-colors text-sm ${isActive
                                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {isSidebarOpen && (
                                    <span className="ml-3">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    >
                        <span className="text-lg">🚪</span>
                        {isSidebarOpen && <span className="ml-3 font-medium">Cerrar Sesión</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white shadow-sm z-10 flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                        🍔
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.email}</p>
                            <p className="text-xs text-gray-500">{ROLE_LABELS[userRole] || userRole}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {(user?.fullName?.[0] || user?.email?.[0] || 'A').toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
