import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

export default function FactoryDashboard() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [batches, setBatches] = useState<any[]>([]);

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const response = await api.get('/factory/batches');
            setBatches(response.data);
        } catch (error) {
            console.error('Error fetching batches:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-2xl font-bold text-amber-800">J DENIS - Fábrica</h1>
                            <div className="hidden md:flex space-x-4">
                                <button className="text-amber-600 hover:text-amber-800 font-medium">
                                    Dashboard
                                </button>
                                <button className="text-gray-600 hover:text-gray-800">
                                    Producción
                                </button>
                                <button className="text-gray-600 hover:text-gray-800">
                                    Protocolos
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
                    <h2 className="text-3xl font-bold text-gray-900">Panel de Fábrica</h2>
                    <p className="mt-2 text-gray-600">Control de Producción</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100 text-sm">Lotes Activos</p>
                                <p className="text-3xl font-bold mt-2">
                                    {batches.filter(b => b.status === 'IN_PROGRESS').length}
                                </p>
                            </div>
                            <div className="text-5xl opacity-20">⚙️</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Lotes Completados</p>
                                <p className="text-3xl font-bold mt-2">
                                    {batches.filter(b => b.status === 'COMPLETED').length}
                                </p>
                            </div>
                            <div className="text-5xl opacity-20">✅</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Total Lotes</p>
                                <p className="text-3xl font-bold mt-2">{batches.length}</p>
                            </div>
                            <div className="text-5xl opacity-20">📊</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-xl font-bold mb-6">Lotes de Producción Recientes</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Número de Lote
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Fecha Inicio
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Creado Por
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {batches.slice(0, 10).map((batch) => (
                                    <tr key={batch.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {batch.batchNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${batch.status === 'COMPLETED'
                                                        ? 'bg-green-100 text-green-800'
                                                        : batch.status === 'IN_PROGRESS'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {batch.status === 'COMPLETED' ? 'Completado' :
                                                    batch.status === 'IN_PROGRESS' ? 'En Progreso' : 'Cancelado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(batch.startDate).toLocaleDateString('es-MX')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {batch.createdByUser?.fullName}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
