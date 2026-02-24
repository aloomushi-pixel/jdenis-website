
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import type { UserRole } from '../../lib/erp';
import { useAuthStore } from '../../store/authStore';

type MenuItem = {
    path: string;
    label: string;
    icon: ReactNode;
    roles: UserRole[];
};

const I = ({ d, ...p }: { d: string } & React.SVGProps<SVGSVGElement>) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...p}><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>;

const menuItems: MenuItem[] = [
    { path: '/admin', label: 'Dashboard', icon: <I d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />, roles: ['ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_MP', 'ALMACEN_PF', 'TRANSPORTISTA'] },
    { path: '/admin/users', label: 'Usuarios', icon: <I d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />, roles: ['ADMIN'] },
    // === OCULTOS TEMPORALMENTE — próximamente se habilitarán ===
    // { path: '/admin/resources', label: 'Recursos', icon: <I d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />, roles: ['ADMIN', 'EJECUTIVO', 'ALMACEN_MP', 'ALMACEN_PF'] },
    // { path: '/admin/production', label: 'Fábrica', icon: <I d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0V21" />, roles: ['ADMIN', 'FABRICA'] },
    // { path: '/admin/purchases', label: 'Compras', icon: <I d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />, roles: ['ADMIN', 'EJECUTIVO'] },
    { path: '/admin/sales', label: 'Ventas', icon: <I d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />, roles: ['ADMIN', 'EJECUTIVO'] },
    // { path: '/admin/transport', label: 'Transporte', icon: <I d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />, roles: ['ADMIN', 'TRANSPORTISTA', 'EJECUTIVO'] },
    // { path: '/admin/packaging', label: 'Embalaje', icon: <I d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />, roles: ['ADMIN', 'FABRICA', 'ALMACEN_PF'] },
    // { path: '/admin/warehouse-queue', label: 'Cola de Envíos', icon: <I d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />, roles: ['ADMIN', 'ALMACEN_PF'] },
    // { path: '/admin/event-log', label: 'Log de Eventos', icon: <I d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />, roles: ['ADMIN', 'EJECUTIVO'] },
    // === FIN OCULTOS TEMPORALMENTE ===

    { path: '/admin/orders', label: 'Pedidos B2B', icon: <I d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />, roles: ['ADMIN', 'EJECUTIVO'] },
    { path: '/admin/reviews', label: 'Reseñas', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>, roles: ['ADMIN'] },
    { path: '/admin/academy', label: 'Academia', icon: <I d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />, roles: ['ADMIN', 'EJECUTIVO'] },
    { path: '/admin/blog', label: 'Blog', icon: <I d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />, roles: ['ADMIN', 'EJECUTIVO'] },
    { path: '/admin/reels', label: 'Reels', icon: <I d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625m0 0A1.125 1.125 0 014.5 4.5h15a1.125 1.125 0 011.125 1.125m-17.25 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h15m-15 0v8.625A1.125 1.125 0 004.5 16.5h15a1.125 1.125 0 001.125-1.125V7.25m0 0v-1.5m0 12.75v1.5" />, roles: ['ADMIN', 'EJECUTIVO'] },
    { path: '/admin/distributors', label: 'Solicitudes Dist.', icon: <I d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />, roles: ['ADMIN', 'EJECUTIVO'] },

    { path: '/admin/catalog', label: 'Editor Catálogo', icon: <I d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125M3.375 19.5c-.621 0-1.125-.504-1.125-1.125M19.5 19.5h1.125c.621 0 1.125-.504 1.125-1.125M19.5 19.5c.621 0 1.125-.504 1.125-1.125m0 0V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125V5.625M2.25 5.625c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125m-20.625 0v12.75c0 .621.504 1.125 1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0c-.621 0-1.125-.504-1.125-1.125M18.375 8.25c.621 0 1.125-.504 1.125-1.125M18.375 8.25h-16.5M18.375 8.25c-.621 0-1.125-.504-1.125-1.125" />, roles: ['ADMIN'] },
    { path: '/admin/cart-promos', label: 'Promos Carrito', icon: <I d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />, roles: ['ADMIN'] },
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
                                <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
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
                        <span className="w-5 h-5 flex-shrink-0"><I d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></span>
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
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
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
