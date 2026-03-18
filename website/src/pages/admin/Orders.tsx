import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import type { OrderB2B, OrderItem } from '../../lib/supabase';
import { getOrders, updateOrderStatus, getOrderItems } from '../../lib/supabase';

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

function OrderRow({ 
    order, 
    handleStatusChange, 
    updatingId 
}: { 
    order: OrderB2B; 
    handleStatusChange: (id: string, status: string) => void;
    updatingId: string | null;
}) {
    const statusInfo = getStatusStyle(order.status);
    const [isExpanded, setIsExpanded] = useState(false);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);

    const toggleExpand = async () => {
        const nextState = !isExpanded;
        setIsExpanded(nextState);
        
        if (nextState && items.length === 0) {
            setLoadingItems(true);
            try {
                const data = await getOrderItems(order.id);
                setItems(data || []);
            } catch (err) {
                console.error('Error fetching order items:', err);
            } finally {
                setLoadingItems(false);
            }
        }
    };

    // Cast shipping_address to a useful type
    const customer = (order.shipping_address as any) || {};

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100 hover:border-gray-200 transition-colors">
            {/* Header Row (Always visible) */}
            <div 
                className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                onClick={toggleExpand}
            >
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <svg 
                                className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <h3 className="font-bold text-gray-900">#{order.order_number}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                        </span>
                        {/* Indicador de Pago Rápido */}
                        {order.status !== 'pending' && order.status !== 'cancelled' ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Pagado
                            </span>
                        ) : null}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm ml-8">
                        <div>
                            <p className="text-gray-400 text-xs">Cliente</p>
                            <p className="font-medium text-gray-800 truncate" title={customer.fullName || '—'}>
                                {customer.fullName || '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs">Total</p>
                            <p className="font-semibold text-gray-900">
                                ${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs">Método de Pago</p>
                            <p className="text-gray-600 capitalize">{order.payment_method || 'Mercado Pago'}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs">Fecha</p>
                            <p className="text-gray-600">{formatDate(order.created_at)}</p>
                        </div>
                    </div>
                </div>

                {/* Status selector stops propagation so it doesn't trigger toggleExpand */}
                <div 
                    className="flex items-center gap-2 ml-8 md:ml-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 font-medium bg-gray-50 hover:bg-white"
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

            {/* Expandable Details Section */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-100 bg-gray-50/50"
                    >
                        <div className="p-6 md:pl-14 grid md:grid-cols-2 gap-8">
                            
                            {/* Dirección y Cliente info */}
                            <div>
                                <h4 className="font-serif text-lg text-gray-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                                    Información del Cliente
                                </h4>
                                <div className="space-y-3 bg-white p-5 rounded-xl border border-gray-200">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Nombre Completo</p>
                                        <p className="text-sm font-medium text-gray-900 mt-0.5">{customer.fullName || '—'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Email</p>
                                            <p className="text-sm text-gray-700 mt-0.5 break-all">{order.shipping_address ? (order.shipping_address as any).email : '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Teléfono</p>
                                            <p className="text-sm text-gray-700 mt-0.5">{customer.phone || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100 mt-3">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Dirección de Envío</p>
                                        <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                                            {customer.address}<br/>
                                            {customer.city}, {customer.state} {customer.zip}
                                        </p>
                                        {customer.references && (
                                            <p className="text-xs text-gray-600 mt-2 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100/50 flex gap-2">
                                                <svg className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                                                <span><strong className="font-medium text-indigo-900">Referencias:</strong> {customer.references}</span>
                                            </p>
                                        )}
                                    </div>
                                    {order.notes && (
                                        <div className="pt-3 border-t border-gray-100 mt-3">
                                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Notas del pedido</p>
                                            <p className="text-sm text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-100">
                                                {order.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Productos */}
                            <div>
                                <h4 className="font-serif text-lg text-gray-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    Productos ({items.reduce((acc, curr) => acc + curr.quantity, 0)})
                                </h4>
                                
                                {loadingItems ? (
                                    <div className="flex justify-center p-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600 border-b-2"></div>
                                    </div>
                                ) : items.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic p-4 bg-white rounded-xl border border-gray-200">No se encontraron productos.</p>
                                ) : (
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                        <ul className="divide-y divide-gray-100 max-h-[320px] overflow-y-auto">
                                            {items.map(item => (
                                                <li key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                                    {(item as any).products?.image_url ? (
                                                        <img 
                                                            src={(item as any).products.image_url} 
                                                            alt={item.product_name} 
                                                            className="w-14 h-14 object-cover rounded-lg border border-gray-100 shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L28 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate" title={item.product_name}>{item.product_name}</p>
                                                        <p className="text-sm text-gray-500 mt-0.5">
                                                            Cant: <span className="font-medium text-gray-700">{item.quantity}</span> × ${item.unit_price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                    <div className="text-sm font-bold text-gray-900 shrink-0">
                                                        ${item.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-500">Subtotal p/Productos</span>
                                                <span className="font-medium text-gray-800">
                                                    ${items.reduce((acc, curr) => acc + curr.total, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-500">Envío y Descuentos</span>
                                                <span className="font-medium text-gray-800">
                                                    ${(order.total - items.reduce((acc, curr) => acc + curr.total, 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-base font-bold mt-3 pt-3 border-t border-gray-200">
                                                <span className="text-gray-900">Total</span>
                                                <span className="text-indigo-600">
                                                    ${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
                <div className="flex items-center gap-3">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                    >
                        <option value="">Todos los estados</option>
                        {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-500 px-3 py-1.5 bg-gray-100 rounded-lg">{orders.length} pedidos</span>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                    <p className="mb-4"><svg className="w-12 h-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg></p>
                    <p className="text-gray-600 text-lg font-medium">No hay pedidos {filter ? `con estado "${getStatusStyle(filter).label}"` : ''}</p>
                    <p className="text-gray-400 text-sm mt-2">Los pedidos aparecerán aquí cuando los clientes empiecen a comprar</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <OrderRow 
                                    order={order} 
                                    handleStatusChange={handleStatusChange} 
                                    updatingId={updatingId} 
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
