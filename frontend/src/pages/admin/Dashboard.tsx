import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import socketService from '../../services/socket';

interface StockItem {
    id: string;
    quantity: number;
    product: {
        name: string;
        sku: string;
    };
    location: {
        name: string;
    };
}

export default function AdminDashboard() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState<StockItem[]>([]);
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStock: 0,
        factoryStock: 0,
        warehouseStock: 0,
    });

    useEffect(() => {
        fetchInventory();

        // Connect to real-time updates
        const socket = socketService.connect();
        socketService.on('inventory:update', (updatedStock) => {
            console.log('Inventory updated:', updatedStock);
            fetchInventory(); // Refresh inventory
        });

        return () => {
            socketService.off('inventory:update');
        };
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await api.get('/inventory');
            setInventory(response.data);

            // Calculate stats
            const totalProducts = response.data.length;
            const lowStock = response.data.filter((item: StockItem) => item.quantity < 100).length;
            const factoryStock = response.data
                .filter((item: StockItem) => item.location.name.includes('Fábrica'))
                .reduce((sum: number, item: StockItem) => sum + item.quantity, 0);
            const warehouseStock = response.data
                .filter((item: StockItem) => item.location.name.includes('Almacén'))
                .reduce((sum: number, item: StockItem) => sum + item.quantity, 0);

            setStats({ totalProducts, lowStock, factoryStock, warehouseStock });
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const handleLogout = () => {
        logout();
        socketService.disconnect();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-2xl font-bold text-primary-800">J DENIS</h1>
                            <div className="hidden md:flex space-x-4">
                                <button
                                    onClick={() => navigate('/admin/dashboard')}
                                    className="text-primary-600 hover:text-primary-800 font-medium"
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => navigate('/admin/inventory')}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Inventario
                                </button>
                                <button
                                    onClick={() => navigate('/admin/sales')}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Ventas
                                </button>
                                <button
                                    onClick={() => navigate('/admin/purchases')}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Compras
                                </button>
                                <button
                                    onClick={() => navigate('/admin/hr')}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    RR.HH.
                                </button>
                                <button
                                    onClick={() => navigate('/admin/assets')}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Flota
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

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Panel de Administración</h2>
                    <p className="mt-2 text-gray-600">Vista general del negocio</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Total Productos</p>
                                <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
                            </div>
                            <div className="text-5xl opacity-20">📦</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100 text-sm">Stock Bajo</p>
                                <p className="text-3xl font-bold mt-2">{stats.lowStock}</p>
                            </div>
                            <div className="text-5xl opacity-20">⚠️</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Stock Fábrica</p>
                                <p className="text-3xl font-bold mt-2">{stats.factoryStock}</p>
                            </div>
                            <div className="text-5xl opacity-20">🏭</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Stock Almacén</p>
                                <p className="text-3xl font-bold mt-2">{stats.warehouseStock}</p>
                            </div>
                            <div className="text-5xl opacity-20">🏢</div>
                        </div>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Inventario en Tiempo Real</h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">En vivo</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        SKU
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ubicación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cantidad
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inventory.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.product.sku}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.product.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.location.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                            {item.quantity.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.quantity < 50
                                                        ? 'bg-red-100 text-red-800'
                                                        : item.quantity < 100
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}
                                            >
                                                {item.quantity < 50 ? 'Crítico' : item.quantity < 100 ? 'Bajo' : 'Normal'}
                                            </span>
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
