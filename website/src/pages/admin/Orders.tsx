import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import type { OrderB2B } from '../../lib/supabase';
import { getOrders, updateOrderStatus } from '../../lib/supabase';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'confirmed', label: 'Confirmado', color: 'bg-blue-100 text-blue-700' },
    { value: 'processing', label: 'En Proceso', color: 'bg-purple-100 text-purple-700' },
    { value: 'shipped', label: 'Enviado', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'delivered', label: 'Entregado', color: 'bg-green-100 text-green-700' },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-700' },
];

function getStatusStyle(status: string) {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<OrderB2B[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getOrders(filter || undefined);
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            await updateOrderStatus(orderId, newStatus);
            await fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
                <div className="flex items-center gap-3">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Todos los estados</option>
                        {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-500">{orders.length} pedidos</span>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <p className="mb-4"><svg className="w-10 h-10 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg></p>
                    <p className="text-gray-500 text-lg">No hay pedidos {filter ? `con estado "${getStatusStyle(filter).label}"` : ''}</p>
                    <p className="text-gray-400 text-sm mt-2">Los pedidos aparecerán aquí cuando los clientes empiecen a comprar</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, index) => {
                        const statusInfo = getStatusStyle(order.status);
                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-gray-900">#{order.order_number}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                            <div>
                                                <p className="text-gray-400 text-xs">Total</p>
                                                <p className="font-semibold text-gray-900">
                                                    ${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs">Subtotal</p>
                                                <p className="text-gray-600">${order.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs">Método de Pago</p>
                                                <p className="text-gray-600">{order.payment_method || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs">Fecha</p>
                                                <p className="text-gray-600">{formatDate(order.created_at)}</p>
                                            </div>
                                        </div>
                                        {order.notes && (
                                            <p className="mt-2 text-sm text-gray-500 italic flex items-center gap-1"><svg className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg> {order.notes}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            disabled={updatingId === order.id}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                        >
                                            {STATUS_OPTIONS.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                        {updatingId === order.id && (
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-indigo-600"></div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
