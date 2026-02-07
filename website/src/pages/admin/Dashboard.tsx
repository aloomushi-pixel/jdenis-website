import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMonthlyPurchases, getMonthlySales, getProductionSummary, getResourceSummary } from '../../lib/erp';
import { getProducts, getSalesMetrics } from '../../lib/supabase';

type DashboardMetrics = {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    lowStock: number;
    monthlySales: number;
    monthlyPurchases: number;
    totalResources: number;
    lowStockResources: number;
    totalResourceValue: number;
    productionPending: number;
    productionInProgress: number;
    productionCompleted: number;
};

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        totalOrders: 0, totalRevenue: 0, totalProducts: 0, lowStock: 0,
        monthlySales: 0, monthlyPurchases: 0,
        totalResources: 0, lowStockResources: 0, totalResourceValue: 0,
        productionPending: 0, productionInProgress: 0, productionCompleted: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const [sales, products, erpSales, erpPurchases, erpResources, erpProduction] = await Promise.allSettled([
                    getSalesMetrics(),
                    getProducts(),
                    getMonthlySales(),
                    getMonthlyPurchases(),
                    getResourceSummary(),
                    getProductionSummary(),
                ]);

                const s = sales.status === 'fulfilled' ? sales.value : { totalOrders: 0, totalRevenue: 0 };
                const p = products.status === 'fulfilled' ? products.value : [];
                const lowStockCount = p?.filter((x: any) => (x.stock || 0) < 10).length || 0;
                const monthlySalesVal = erpSales.status === 'fulfilled' ? erpSales.value : 0;
                const monthlyPurchasesVal = erpPurchases.status === 'fulfilled' ? erpPurchases.value : 0;
                // getResourceSummary returns an array of category summaries
                const resSummary = erpResources.status === 'fulfilled' ? erpResources.value : [];
                const totalResources = resSummary.reduce((a: number, r: any) => a + (r.total_items || 0), 0);
                const lowStockRes = resSummary.reduce((a: number, r: any) => a + (r.low_stock_count || 0), 0);
                const totalValue = resSummary.reduce((a: number, r: any) => a + (r.total_value || 0), 0);
                const prod = erpProduction.status === 'fulfilled' ? erpProduction.value : { pending_orders: 0, in_progress: 0, completed: 0 };

                setMetrics({
                    totalOrders: s.totalOrders,
                    totalRevenue: s.totalRevenue,
                    totalProducts: p?.length || 0,
                    lowStock: lowStockCount,
                    monthlySales: Number(monthlySalesVal) || 0,
                    monthlyPurchases: Number(monthlyPurchasesVal) || 0,
                    totalResources,
                    lowStockResources: lowStockRes,
                    totalResourceValue: totalValue,
                    productionPending: prod.pending_orders || 0,
                    productionInProgress: prod.in_progress || 0,
                    productionCompleted: prod.completed || 0,
                });
            } catch (error) {
                console.error('Error fetching metrics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return (
        <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    const topCards = [
        { title: 'Ventas Mensuales', value: `$${metrics.monthlySales.toLocaleString()}`, icon: '💰', color: 'bg-green-100 text-green-600', link: '/admin/sales' },
        { title: 'Compras Mensuales', value: `$${metrics.monthlyPurchases.toLocaleString()}`, icon: '🛒', color: 'bg-blue-100 text-blue-600', link: '/admin/purchases' },
        { title: 'Recursos Totales', value: metrics.totalResources, icon: '📦', color: 'bg-purple-100 text-purple-600', link: '/admin/resources' },
        { title: 'Stock Bajo', value: metrics.lowStockResources, icon: '⚠️', color: 'bg-red-100 text-red-600', link: '/admin/resources' },
    ];

    const b2bCards = [
        { title: 'Ventas B2B', value: `$${metrics.totalRevenue.toLocaleString()}`, icon: '🏷️', color: 'bg-indigo-100 text-indigo-600' },
        { title: 'Pedidos B2B', value: metrics.totalOrders, icon: '🧾', color: 'bg-cyan-100 text-cyan-600' },
        { title: 'Productos B2B', value: metrics.totalProducts, icon: '✨', color: 'bg-amber-100 text-amber-600' },
    ];

    const quickActions = [
        { label: 'Nueva Orden Producción', icon: '🏭', path: '/admin/production' },
        { label: 'Nueva Compra', icon: '🛒', path: '/admin/purchases' },
        { label: 'Nuevo Pedido Venta', icon: '💰', path: '/admin/sales' },
        { label: 'Gestionar Recursos', icon: '📦', path: '/admin/resources' },
        { label: 'Ver Log de Eventos', icon: '📝', path: '/admin/event-log' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">📊 Dashboard General</h1>

            {/* ERP Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {topCards.map((card, i) => (
                    <Link key={i} to={card.link}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="bg-white rounded-xl shadow-sm p-5 flex items-center hover:shadow-md transition-shadow cursor-pointer">
                            <div className={`p-3 rounded-lg ${card.color} mr-4`}>
                                <span className="text-2xl">{card.icon}</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">{card.title}</p>
                                <h3 className="text-xl font-bold text-gray-900">{card.value}</h3>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            {/* Production Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">🏭 Producción</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-600">{metrics.productionPending}</p>
                            <p className="text-xs text-gray-500 mt-1">Pendientes</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{metrics.productionInProgress}</p>
                            <p className="text-xs text-gray-500 mt-1">En Proceso</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{metrics.productionCompleted}</p>
                            <p className="text-xs text-gray-500 mt-1">Completadas</p>
                        </div>
                    </div>
                    {metrics.totalResourceValue > 0 && (
                        <p className="mt-4 text-sm text-gray-500">
                            Valor total en inventario: <span className="font-semibold text-gray-800">${metrics.totalResourceValue.toLocaleString()}</span>
                        </p>
                    )}
                </motion.div>

                {/* B2B Summary */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">🏷️ Tienda B2B</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {b2bCards.map((card, i) => (
                            <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{card.title}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">⚡ Acciones Rápidas</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {quickActions.map((action, i) => (
                        <Link key={i} to={action.path}
                            className="flex flex-col items-center p-4 bg-gray-50 hover:bg-indigo-50 rounded-lg transition-colors group">
                            <span className="text-2xl mb-2">{action.icon}</span>
                            <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600 text-center">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
