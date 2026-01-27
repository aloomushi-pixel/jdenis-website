import { useAuthStore } from '../../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardData {
    rawMaterialIntake: { total: number; count: number };
    factoryConsumption: { total: number; count: number };
    finishedProducts: { total: number; count: number };
    monthlySales: { total: number; count: number };
    monthlyPurchases: { total: number; count: number };
    recentEvents: any[];
}

const CHART_COLORS = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
};



export default function AdminDashboard() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchData();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchData = async () => {
        try {
            const [dashboardRes, chartsRes] = await Promise.all([
                api.get('/analytics/dashboard'),
                api.get('/analytics/charts?period=30d'),
            ]);
            setData(dashboardRes.data);
            setChartData(chartsRes.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const kpis = data ? [
        { label: 'Ingreso Insumos', value: data.rawMaterialIntake.total, sub: `${data.rawMaterialIntake.count} recepciones`, icon: '📦', color: 'indigo' },
        { label: 'Consumo Fábrica', value: data.factoryConsumption.total, sub: `${data.factoryConsumption.count} lotes`, icon: '🏭', color: 'purple' },
        { label: 'Producto Final', value: data.finishedProducts.total, sub: `${data.finishedProducts.count} unidades`, icon: '✅', color: 'emerald' },
        { label: 'Ventas del Mes', value: data.monthlySales.total, sub: `${data.monthlySales.count} pedidos`, icon: '💰', color: 'amber', isCurrency: true },
        { label: 'Compras del Mes', value: data.monthlyPurchases.total, sub: `${data.monthlyPurchases.count} órdenes`, icon: '🛒', color: 'blue', isCurrency: true },
        { label: 'Margen Bruto', value: data.monthlySales.total - data.monthlyPurchases.total, sub: 'Ventas - Compras', icon: '📊', color: 'pink', isCurrency: true },
    ] : [];

    const pieData = data ? [
        { name: 'Insumos', value: data.rawMaterialIntake.total, color: CHART_COLORS.primary },
        { name: 'Consumo', value: data.factoryConsumption.total, color: CHART_COLORS.secondary },
        { name: 'Producción', value: data.finishedProducts.total, color: CHART_COLORS.success },
    ] : [];

    const quickActions = [
        { label: 'Recursos', icon: '📋', path: '/resources', color: 'from-indigo-600 to-purple-600' },
        { label: 'Cotizaciones', icon: '💼', path: '/quotations', color: 'from-purple-600 to-pink-600' },
        { label: 'Fábrica', icon: '🏭', path: '/factory/dashboard', color: 'from-emerald-600 to-teal-600' },
        { label: 'Almacén', icon: '📦', path: '/warehouse/dashboard', color: 'from-amber-600 to-orange-600' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 lg:p-6">
            {/* Compact Header */}
            <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gradient">J DENIS ERP</h1>
                    <span className="badge badge-danger">ADMIN</span>
                    <span className="text-slate-500 text-sm hidden md:block">
                        {currentTime.toLocaleString('es-MX', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.path}
                            to={action.path}
                            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${action.color} text-white text-sm font-medium hover:opacity-90 transition-opacity`}
                        >
                            <span>{action.icon}</span>
                            <span>{action.label}</span>
                        </Link>
                    ))}

                    <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">{user?.fullName}</p>
                            <p className="text-xs text-slate-400">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn btn-ghost text-sm"
                        >
                            Salir
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Quick Actions */}
            <div className="grid grid-cols-4 gap-2 mb-4 sm:hidden">
                {quickActions.map((action) => (
                    <Link
                        key={action.path}
                        to={action.path}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl bg-gradient-to-r ${action.color} text-white text-xs font-medium`}
                    >
                        <span className="text-lg">{action.icon}</span>
                        <span>{action.label}</span>
                    </Link>
                ))}
            </div>

            {/* KPI Cards - 6 columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                {kpis.map((kpi, index) => (
                    <div
                        key={kpi.label}
                        className="kpi-card animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="kpi-label">{kpi.label}</p>
                                <p className="kpi-value">
                                    {kpi.isCurrency ? '$' : ''}
                                    {kpi.value.toLocaleString('es-MX')}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
                            </div>
                            <span className="text-2xl">{kpi.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Area Chart - Trends */}
                <div className="lg:col-span-2 glass-card-static">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Tendencia - Últimos 30 días</h3>
                        <span className="badge badge-primary">En vivo</span>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorVenta" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorCompra" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={CHART_COLORS.warning} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={CHART_COLORS.warning} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="VENTA" stroke={CHART_COLORS.success} fillOpacity={1} fill="url(#colorVenta)" name="Ventas" strokeWidth={2} />
                            <Area type="monotone" dataKey="COMPRA" stroke={CHART_COLORS.warning} fillOpacity={1} fill="url(#colorCompra)" name="Compras" strokeWidth={2} />
                            <Area type="monotone" dataKey="PRODUCCION" stroke={CHART_COLORS.primary} fillOpacity={1} fill="url(#colorProd)" name="Producción" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="glass-card-static">
                    <h3 className="font-semibold text-white mb-4">Resumen Producción</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Row - Events & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Events */}
                <div className="lg:col-span-2 table-container">
                    <div className="table-header">
                        <h3>Eventos Recientes</h3>
                        <span className="text-xs text-slate-400">{data?.recentEvents.length || 0} eventos</span>
                    </div>
                    <div className="max-h-[280px] overflow-y-auto">
                        {data?.recentEvents.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <span className="text-4xl mb-2 block">📭</span>
                                <p>Sin eventos recientes</p>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Usuario</th>
                                        <th>Recurso</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.recentEvents.slice(0, 8).map((event, index) => (
                                        <tr key={index}>
                                            <td>
                                                <span className={`badge ${event.eventType === 'VENTA' ? 'badge-success' :
                                                    event.eventType === 'COMPRA' ? 'badge-warning' :
                                                        event.eventType === 'PRODUCCION' ? 'badge-purple' :
                                                            'badge-primary'
                                                    }`}>
                                                    {event.eventType}
                                                </span>
                                            </td>
                                            <td className="font-medium text-white">{event.user.fullName}</td>
                                            <td>{event.resource?.title || '-'}</td>
                                            <td className="text-slate-400 text-xs">
                                                {new Date(event.timestamp).toLocaleString('es-MX', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* System Status */}
                <div className="glass-card-static">
                    <h3 className="font-semibold text-white mb-4">Estado del Sistema</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-green-400">Backend API</span>
                            </div>
                            <span className="text-xs text-green-400">Online</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-green-400">Database</span>
                            </div>
                            <span className="text-xs text-green-400">Connected</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-blue-400">Socket.io</span>
                            </div>
                            <span className="text-xs text-blue-400">Ready</span>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <p className="text-xs text-slate-500 mb-2">Acciones Rápidas</p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => fetchData()}
                                    className="btn btn-secondary text-xs"
                                >
                                    🔄 Refrescar
                                </button>
                                <Link to="/resources" className="btn btn-primary text-xs text-center">
                                    ➕ Nuevo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
