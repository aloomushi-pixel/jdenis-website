import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMonthlyPurchases, getMonthlySales, getProductionSummary, getResourceSummary } from '../../lib/erp';
import { getProducts, getSalesMetrics } from '../../lib/supabase';

const I = ({ d }: { d: string }) => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>;

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
                const prod = erpProduction.status === 'fulfilled' ? erpProduction.value : { pending_orders: 0, in_progress: 0, completed: 0 } as any;

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

    const topCards: { title: string; value: string | number; icon: ReactNode; color: string; link: string }[] = [
        { title: 'Ventas Mensuales', value: `$${metrics.monthlySales.toLocaleString()}`, icon: <I d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />, color: 'bg-green-100 text-green-600', link: '/admin/sales' },
        // OCULTOS TEMPORALMENTE
        // { title: 'Compras Mensuales', value: `$${metrics.monthlyPurchases.toLocaleString()}`, icon: <I d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />, color: 'bg-blue-100 text-blue-600', link: '/admin/purchases' },
        // { title: 'Recursos Totales', value: metrics.totalResources, icon: <I d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />, color: 'bg-purple-100 text-purple-600', link: '/admin/resources' },
        // { title: 'Stock Bajo', value: metrics.lowStockResources, icon: <I d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />, color: 'bg-red-100 text-red-600', link: '/admin/resources' },
    ];

    const b2bCards: { title: string; value: string | number; icon: ReactNode; color: string }[] = [
        { title: 'Ventas B2B', value: `$${metrics.totalRevenue.toLocaleString()}`, icon: <I d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />, color: 'bg-indigo-100 text-indigo-600' },
        { title: 'Pedidos B2B', value: metrics.totalOrders, icon: <I d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />, color: 'bg-cyan-100 text-cyan-600' },
        { title: 'Productos B2B', value: metrics.totalProducts, icon: <I d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />, color: 'bg-amber-100 text-amber-600' },
    ];

    const quickActions: { label: string; icon: ReactNode; path: string }[] = [
        // OCULTOS TEMPORALMENTE
        // { label: 'Nueva Orden Producción', icon: <I d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0V21" />, path: '/admin/production' },
        // { label: 'Nueva Compra', icon: <I d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />, path: '/admin/purchases' },
        { label: 'Nuevo Pedido Venta', icon: <I d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />, path: '/admin/sales' },
        // { label: 'Gestionar Recursos', icon: <I d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />, path: '/admin/resources' },
        // { label: 'Ver Log de Eventos', icon: <I d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />, path: '/admin/event-log' },
        { label: 'Gestionar Academia', icon: <I d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />, path: '/admin/academy' },
        { label: 'Gestionar Blog', icon: <I d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />, path: '/admin/blog' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><I d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /> Dashboard General</h1>

            {/* ERP Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {topCards.map((card, i) => (
                    <Link key={i} to={card.link}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="bg-white rounded-xl shadow-sm p-5 flex items-center hover:shadow-md transition-shadow cursor-pointer">
                            <div className={`p-3 rounded-lg ${card.color} mr-4`}>
                                <span className="w-6 h-6 block">{card.icon}</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">{card.title}</p>
                                <h3 className="text-xl font-bold text-gray-900">{card.value}</h3>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>

            {/* B2B Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* PRODUCCIÓN — OCULTO TEMPORALMENTE
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><I d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0V21" /> Producción</h2>
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
                */}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><I d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /> Tienda B2B</h2>
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
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><I d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /> Acciones Rápidas</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {quickActions.map((action, i) => (
                        <Link key={i} to={action.path}
                            className="flex flex-col items-center p-4 bg-gray-50 hover:bg-indigo-50 rounded-lg transition-colors group">
                            <span className="w-6 h-6 mb-2">{action.icon}</span>
                            <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600 text-center">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
