import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import FactoryDashboard from './pages/factory/Dashboard';
import WarehouseDashboard from './pages/warehouse/Dashboard';
import OperatorDeliveries from './pages/operator/Deliveries';
import ResourceManager from './components/ResourceManager';
import QuotationModule from './components/QuotationModule';
import OrderTimeline from './components/OrderTimeline';

function App() {
    const { isAuthenticated, user } = useAuthStore();

    const getDefaultRoute = () => {
        if (!isAuthenticated || !user) return '/login';

        switch (user.role) {
            case 'ADMIN':
                return '/admin/dashboard';
            case 'FABRICA':
                return '/factory/dashboard';
            case 'ALMACEN_MATERIA_PRIMA':
            case 'ALMACEN_PRODUCTO_FINAL':
                return '/warehouse/dashboard';
            case 'TRANSPORTISTA':
                return '/operator/deliveries';
            case 'EJECUTIVO':
                return '/quotations';
            case 'CLIENTE':
                return '/my-orders';
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
                        <ProtectedRoute allowedRoles={['ADMIN', 'FABRICA']}>
                            <FactoryDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Warehouse Routes */}
                <Route
                    path="/warehouse/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL']}>
                            <WarehouseDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Operator/Transporter Routes */}
                <Route
                    path="/operator/deliveries"
                    element={
                        <ProtectedRoute allowedRoles={['TRANSPORTISTA', 'ADMIN']}>
                            <OperatorDeliveries />
                        </ProtectedRoute>
                    }
                />

                {/* Resource Manager */}
                <Route
                    path="/resources"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'EJECUTIVO']}>
                            <ResourceManager />
                        </ProtectedRoute>
                    }
                />

                {/* Quotations Module */}
                <Route
                    path="/quotations"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'EJECUTIVO']}>
                            <QuotationModule />
                        </ProtectedRoute>
                    }
                />

                {/* Order Timeline */}
                <Route
                    path="/orders/:id/timeline"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL', 'TRANSPORTISTA']}>
                            <OrderTimeline />
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
