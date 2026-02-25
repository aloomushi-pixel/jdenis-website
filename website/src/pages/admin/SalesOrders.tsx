import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { createSalesOrder, getSalesOrders, getUsers, updateSalesOrderStatus, type ERPUser, type SalesOrder } from '../../lib/erp';
import { useAuthStore } from '../../store/authStore';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    PENDIENTE: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
    CONFIRMADO: { label: 'Confirmado', color: 'bg-blue-100 text-blue-700' },
    EN_PRODUCCION: { label: 'En Producción', color: 'bg-purple-100 text-purple-700' },
    EMPAQUETADO: { label: 'Empaquetado', color: 'bg-indigo-100 text-indigo-700' },
    EN_TRANSPORTE: { label: 'En Transporte', color: 'bg-cyan-100 text-cyan-700' },
    ENTREGADO: { label: 'Entregado', color: 'bg-green-100 text-green-700' },
    CANCELADO: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
};

const FLOW: Record<string, string> = {
    PENDIENTE: 'CONFIRMADO', CONFIRMADO: 'EN_PRODUCCION', EN_PRODUCCION: 'EMPAQUETADO',
    EMPAQUETADO: 'EN_TRANSPORTE', EN_TRANSPORTE: 'ENTREGADO'
};

export default function SalesOrders() {
    const user = useAuthStore(s => s.user);
    const [orders, setOrders] = useState<SalesOrder[]>([]);
    const [clients, setClients] = useState<ERPUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [form, setForm] = useState({ order_number: '', client_id: '', delivery_address: '', delivery_date: '', notes: '', subtotal: 0, tax: 0 });
    const [saving, setSaving] = useState(false);

    const fetchOrders = useCallback(() => { setLoading(true); getSalesOrders(filter || undefined).then(setOrders).finally(() => setLoading(false)); }, [filter]);
    useEffect(() => { fetchOrders(); }, [fetchOrders]);
    useEffect(() => { getUsers('CLIENTE').then(setClients); }, []);

    const handleCreate = async () => {
        if (!form.order_number || !form.client_id || !user) return;
        setSaving(true);
        try {
            await createSalesOrder({ ...form, total: form.subtotal + form.tax, created_by: user.id });
            setShowCreate(false); fetchOrders();
        } catch (e) { console.error(e); } finally { setSaving(false); }
    };

    const handleAdvance = async (id: string, current: string) => {
        const next = FLOW[current]; if (!next || !user) return;
        await updateSalesOrderStatus(id, next, user.id);
        fetchOrders();
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Pedidos de Venta</h1>
                <div className="flex gap-3">
                    <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option value="">Todos</option>
                        {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Nuevo Pedido</button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div></div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-gray-800">#{order.order_number}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_MAP[order.status]?.color}`}>{STATUS_MAP[order.status]?.label}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">Cliente: {(((order as unknown) as Record<string, unknown>).users as Record<string, string> | undefined)?.fullName || (((order as unknown) as Record<string, unknown>).users as Record<string, string> | undefined)?.email || order.client_id.slice(0, 8)}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-gray-800">${order.total.toLocaleString()}</span>
                                        {FLOW[order.status] && (
                                            <button onClick={() => handleAdvance(order.id, order.status)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">
                                                → {STATUS_MAP[FLOW[order.status]]?.label}
                                            </button>
                                        )}
                                        <button onClick={() => setExpanded(expanded === order.id ? null : order.id)} className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">
                                            {expanded === order.id ? '▲' : '▼'} Historial
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {expanded === order.id && order.status_history?.length > 0 && (
                                <div className="px-6 pb-4 border-t border-gray-100 pt-3">
                                    <p className="text-xs font-semibold text-gray-500 mb-2">Historial de Estatus</p>
                                    <div className="space-y-2">
                                        {order.status_history.map((hist: unknown, i: number) => {
                                            const h = hist as Record<string, unknown>;
                                            const statusKey = typeof h.status === 'string' ? h.status : '';
                                            return (
                                                <div key={i} className="flex items-center gap-3 text-xs">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                                    <span className="font-medium text-gray-700">{STATUS_MAP[statusKey as keyof typeof STATUS_MAP]?.label || statusKey}</span>
                                                    <span className="text-gray-400">{new Date(h.timestamp as string).toLocaleString('es-MX')}</span>
                                                    {typeof h.notes === 'string' && <span className="text-gray-500">— {h.notes}</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                    {orders.length === 0 && <div className="text-center py-12 text-gray-400">No hay pedidos de venta</div>}
                </div>
            )}

            {showCreate && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Nuevo Pedido</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-medium text-gray-500 mb-1"># Orden *</label>
                                <input value={form.order_number} onChange={e => setForm(f => ({ ...f, order_number: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="VTA-001" /></div>
                            <div><label className="block text-xs font-medium text-gray-500 mb-1">Cliente *</label>
                                <select value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                                    <option value="">Seleccionar...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.fullName || c.email}</option>)}
                                </select></div>
                            <div><label className="block text-xs font-medium text-gray-500 mb-1">Fecha Entrega</label>
                                <input type="date" value={form.delivery_date} onChange={e => setForm(f => ({ ...f, delivery_date: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                            <div><label className="block text-xs font-medium text-gray-500 mb-1">Subtotal</label>
                                <input type="number" value={form.subtotal} onChange={e => setForm(f => ({ ...f, subtotal: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                            <div className="col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Dirección de Entrega</label>
                                <input value={form.delivery_address} onChange={e => setForm(f => ({ ...f, delivery_address: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                            <button onClick={handleCreate} disabled={saving || !form.order_number || !form.client_id} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                                {saving ? 'Creando...' : 'Crear Pedido'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
