import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

export default function WarehouseDashboard() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [racks, setRacks] = useState<any[]>([]);
    const [receiving, setReceiving] = useState<any[]>([]);
    const [dispatch, setDispatch] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [racksRes, receivingRes, dispatchRes] = await Promise.all([
                api.get('/warehouse/racks'),
                api.get('/warehouse/receiving'),
                api.get('/warehouse/dispatch'),
            ]);
            setRacks(racksRes.data);
            setReceiving(receivingRes.data);
            setDispatch(dispatchRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const totalCapacity = racks.reduce((sum, r) => sum + r.capacity, 0);
    const totalUtilization = racks.reduce((sum, r) => sum + r.currentUtilization, 0);
    const utilizationPercentage = totalCapacity > 0 ? (totalUtilization / totalCapacity * 100).toFixed(1) : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-2xl font-bold text-green-800">J DENIS - Almacén</h1>
                            <div className="hidden md:flex space-x-4">
                                <button className="text-green-600 hover:text-green-800 font-medium">
                                    Dashboard
                                </button>
                                <button className="text-gray-600 hover:text-gray-800">
                                    Recepción
                                </button>
                                <button className="text-gray-600 hover:text-gray-800">
                                    Despacho
                                </button>
                                <button className="text-gray-600 hover:text-gray-800">
                                    Racks
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{user?.fullName}</span>
                            <button onClick={handleLogout} className="btn btn-secondary">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Panel de Almacén</h2>
                    <p className="mt-2 text-gray-600">Gestión Logística</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Utilización</p>
                                <p className="text-3xl font-bold mt-2">{utilizationPercentage}%</p>
                            </div>
                            <div className="text-5xl opacity-20">📦</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Recepciones Hoy</p>
                                <p className="text-3xl font-bold mt-2">{receiving.length}</p>
                            </div>
                            <div className="text-5xl opacity-20">📥</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Despachos Hoy</p>
                                <p className="text-3xl font-bold mt-2">{dispatch.length}</p>
                            </div>
                            <div className="text-5xl opacity-20">📤</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h3 className="text-xl font-bold mb-6">Racks de Almacenamiento</h3>
                        <div className="space-y-3">
                            {racks.map((rack) => {
                                const utilization = (rack.currentUtilization / rack.capacity * 100).toFixed(0);
                                return (
                                    <div key={rack.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold text-gray-900">{rack.rackCode}</span>
                                            <span className="text-sm text-gray-600">
                                                {rack.currentUtilization} / {rack.capacity}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full transition-all duration-300 ${Number(utilization) > 90
                                                        ? 'bg-red-500'
                                                        : Number(utilization) > 70
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'
                                                    }`}
                                                style={{ width: `${utilization}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{utilization}% utilizado</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-xl font-bold mb-6">Recepciones Recientes</h3>
                        <div className="space-y-3">
                            {receiving.slice(0, 5).map((log) => (
                                <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900">{log.product.name}</p>
                                            <p className="text-sm text-gray-600">Cantidad: {log.quantity}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Origen: {log.source === 'FACTORY' ? 'Fábrica' : 'Proveedor'}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(log.receivedAt).toLocaleDateString('es-MX')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
