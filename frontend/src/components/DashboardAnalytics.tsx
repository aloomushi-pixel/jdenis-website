import { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardData {
    rawMaterialIntake: { total: number; count: number };
    factoryConsumption: { total: number; count: number };
    finishedProducts: { total: number; count: number };
    monthlySales: { total: number; count: number };
    monthlyPurchases: { total: number; count: number };
    recentEvents: any[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function DashboardAnalytics() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [dashboardRes, chartsRes] = await Promise.all([
                api.get('/analytics/dashboard'),
                api.get('/analytics/charts?period=30d'),
            ]);
            setData(dashboardRes.data);
            setChartData(chartsRes.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Cargando analytics...</div>
            </div>
        );
    }

    if (!data) return null;

    const summaryData = [
        { name: 'Insumos', value: data.rawMaterialIntake.total, color: COLORS[0] },
        { name: 'Consumo', value: data.factoryConsumption.total, color: COLORS[1] },
        { name: 'Producción', value: data.finishedProducts.total, color: COLORS[2] },
    ];

    const financialData = [
        { name: 'Ventas', amount: data.monthlySales.total },
        { name: 'Compras', amount: data.monthlyPurchases.total },
    ];

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ingreso Insumos</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {data.rawMaterialIntake.total.toLocaleString()}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">{data.rawMaterialIntake.count} eventos</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4M12 4v16" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Consumo Fábrica</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {data.factoryConsumption.total.toLocaleString()}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">{data.factoryConsumption.count} lotes</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10h10a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Producto Final</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {data.finishedProducts.total.toLocaleString()}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">{data.finishedProducts.count} unidades</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ventas del Mes</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                ${data.monthlySales.total.toLocaleString()}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">{data.monthlySales.count} pedidos</p>
                        </div>
                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart - Resumen de Producción */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen de Producción</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={summaryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {summaryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart - Ventas vs Compras */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Ventas vs Compras</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={financialData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill="#6366f1" name="Monto ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Line Chart - Tendencia (30 días) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Actividad - Últimos 30 Días</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="COMPRA" stroke="#f59e0b" strokeWidth={2} name="Compras" />
                            <Line type="monotone" dataKey="VENTA" stroke="#10b981" strokeWidth={2} name="Ventas" />
                            <Line type="monotone" dataKey="PRODUCCION" stroke="#6366f1" strokeWidth={2} name="Producción" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">Eventos Recientes</h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {data.recentEvents.map((event, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start space-x-4">
                                <div className={`w-2 h-2 mt-2 rounded-full ${event.eventType === 'VENTA' ? 'bg-green-500' :
                                        event.eventType === 'COMPRA' ? 'bg-blue-500' :
                                            event.eventType === 'PRODUCCION' ? 'bg-purple-500' :
                                                'bg-gray-500'
                                    }`} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-gray-900">
                                            {event.eventType} - {event.user.fullName}
                                        </p>
                                        <span className="text-xs text-gray-400">
                                            {new Date(event.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    {event.resource && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {event.resource.title} ({event.resource.category})
                                            {event.quantity && ` - Cantidad: ${event.quantity}`}
                                        </p>
                                    )}
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mt-2 ${event.user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                            event.user.role === 'EJECUTIVO' ? 'bg-blue-100 text-blue-800' :
                                                event.user.role === 'FABRICA' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {event.user.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
