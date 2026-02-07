
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getProducts, getSalesMetrics } from '../../lib/supabase';

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        lowStock: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const [sales, products] = await Promise.all([
                    getSalesMetrics(),
                    getProducts()
                ]);

                const lowStockCount = products?.filter((p: any) => (p.stock || 0) < 10).length || 0;

                setMetrics({
                    totalOrders: sales.totalOrders,
                    totalRevenue: sales.totalRevenue,
                    totalProducts: products?.length || 0,
                    lowStock: lowStockCount
                });
            } catch (error) {
                console.error('Error fetching metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) return <div>Cargando dashboard...</div>;

    const cards = [
        { title: 'Ventas Totales', value: `$${metrics.totalRevenue.toLocaleString()}`, icon: '💰', color: 'bg-green-100 text-green-600' },
        { title: 'Pedidos', value: metrics.totalOrders, icon: '📦', color: 'bg-blue-100 text-blue-600' },
        { title: 'Productos', value: metrics.totalProducts, icon: '🏷️', color: 'bg-purple-100 text-purple-600' },
        { title: 'Stock Bajo', value: metrics.lowStock, icon: '⚠️', color: 'bg-red-100 text-red-600' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard General</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-6 flex items-center"
                    >
                        <div className={`p-4 rounded-lg ${card.color} mr-4`}>
                            <span className="text-2xl">{card.icon}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between group transition-colors">
                            <span className="font-medium text-gray-700">Agregar Nuevo Producto</span>
                            <span className="text-gray-400 group-hover:text-gray-600">→</span>
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between group transition-colors">
                            <span className="font-medium text-gray-700">Revisar Pedidos Pendientes</span>
                            <span className="text-gray-400 group-hover:text-gray-600">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
