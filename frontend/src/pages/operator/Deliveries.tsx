import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

export default function OperatorDeliveries() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [deliveries, setDeliveries] = useState<any[]>([]);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const response = await api.get('/assets/deliveries');
            setDeliveries(response.data);
        } catch (error) {
            console.error('Error fetching deliveries:', error);
        }
    };

    const handleComplete = async (deliveryId: string) => {
        try {
            await api.patch(`/assets/deliveries/${deliveryId}/complete`, {
                notes: 'Entrega completada',
            });
            fetchDeliveries();
            alert('✅ Entrega completada exitosamente');
        } catch (error) {
            console.error('Error completing delivery:', error);
            alert('❌ Error al completar entrega');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const activeDeliveries = deliveries.filter(d => d.status === 'ASSIGNED' || d.status === 'IN_TRANSIT');
    const completedDeliveries = deliveries.filter(d => d.status === 'COMPLETED');

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-blue-800">J DENIS - Transporte</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{user?.fullName}</span>
                            <button onClick={handleLogout} className="btn btn-secondary">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Mis Entregas</h2>
                    <p className="mt-2 text-gray-600">Gestión de entregas asignadas</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Entregas Activas</p>
                                <p className="text-3xl font-bold mt-2">{activeDeliveries.length}</p>
                            </div>
                            <div className="text-5xl opacity-20">🚚</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Completadas</p>
                                <p className="text-3xl font-bold mt-2">{completedDeliveries.length}</p>
                            </div>
                            <div className="text-5xl opacity-20">✅</div>
                        </div>
                    </div>
                </div>

                {/* Active Deliveries */}
                <div className="card mb-6">
                    <h3 className="text-xl font-bold mb-6">Entregas Pendientes</h3>
                    {activeDeliveries.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No hay entregas pendientes</p>
                    ) : (
                        <div className="space-y-4">
                            {activeDeliveries.map((delivery) => (
                                <div key={delivery.id} className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                Orden #{delivery.salesOrder.orderNumber}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Cliente: {delivery.salesOrder.customer.name}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${delivery.status === 'IN_TRANSIT'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {delivery.status === 'IN_TRANSIT' ? 'En Tránsito' : 'Asignada'}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Productos:</p>
                                        {delivery.salesOrder.items.map((item: any) => (
                                            <div key={item.id} className="flex justify-between text-sm text-gray-600">
                                                <span>{item.product.name}</span>
                                                <span className="font-medium">x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Vehículo</p>
                                            <p className="text-sm font-medium text-gray-900">{delivery.vehicle.vehicleNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Asignado</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(delivery.assignedAt).toLocaleDateString('es-MX')}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleComplete(delivery.id)}
                                        className="btn btn-success w-full"
                                    >
                                        ✓ Marcar como Completada
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Completed Deliveries */}
                {completedDeliveries.length > 0 && (
                    <div className="card">
                        <h3 className="text-xl font-bold mb-6">Entregas Completadas</h3>
                        <div className="space-y-3">
                            {completedDeliveries.slice(0, 5).map((delivery) => (
                                <div key={delivery.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Orden #{delivery.salesOrder.orderNumber}
                                            </p>
                                            <p className="text-sm text-gray-600">{delivery.salesOrder.customer.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Completada</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(delivery.completedAt).toLocaleDateString('es-MX')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
