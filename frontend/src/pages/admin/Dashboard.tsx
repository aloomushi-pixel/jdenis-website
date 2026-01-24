import { useAuthStore } from '../../store/authStore';
import DashboardAnalytics from '../../components/DashboardAnalytics';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">J DENIS ERP</h1>
                            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                                ADMIN
                            </span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link
                                to="/resources"
                                className="text-gray-700 hover:text-gray-900 font-medium text-sm"
                            >
                                Recursos
                            </Link>
                            <Link
                                to="/quotations"
                                className="text-gray-700 hover:text-gray-900 font-medium text-sm"
                            >
                                Cotizaciones
                            </Link>
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Dashboard Ejecutivo</h2>
                    <p className="text-gray-600 mt-1">Panel de control con analytics en tiempo real</p>
                </div>

                <DashboardAnalytics />
            </main>
        </div>
    );
}
