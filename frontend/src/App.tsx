import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import FactoryDashboard from './pages/factory/Dashboard';
import WarehouseDashboard from './pages/warehouse/Dashboard';
import OperatorDeliveries from './pages/operator/Deliveries';

function App() {
    const { isAuthenticated, user } = useAuthStore();

    const getDefaultRoute = () => {
        if (!isAuthenticated || !user) return '/login';

        switch (user.role) {
            case 'ADMIN':
                return '/admin/dashboard';
            case 'FACTORY_MANAGER':
                return '/factory/dashboard';
            case 'WAREHOUSE_MANAGER':
                return '/warehouse/dashboard';
            case 'TRANSPORTER':
                return '/operator/deliveries';
            default:
                return '/login';
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Admin Routes */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Factory Routes */}
                <Route
                    path="/factory/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'FACTORY_MANAGER']}>
                            <FactoryDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Warehouse Routes */}
                <Route
                    path="/warehouse/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'WAREHOUSE_MANAGER']}>
                            <WarehouseDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Operator/Transporter Routes */}
                <Route
                    path="/operator/deliveries"
                    element={
                        <ProtectedRoute allowedRoles={['TRANSPORTER']}>
                            <OperatorDeliveries />
                        </ProtectedRoute>
                    }
                />

                {/* Unauthorized */}
                <Route
                    path="/unauthorized"
                    element={
                        <div className="min-h-screen flex items-center justify-center bg-gray-50">
                            <div className="card max-w-md">
                                <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                                <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
                            </div>
                        </div>
                    }
                />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
                <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
