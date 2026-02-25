import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { createProductionOrder, getProductionOrders, updateProductionOrderStatus, type ProductionOrder } from '../../lib/erp';
import { useAuthStore } from '../../store/authStore';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    PENDIENTE: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
    EN_PROCESO: { label: 'En Proceso', color: 'bg-blue-100 text-blue-700' },
    COMPLETADA: { label: 'Completada', color: 'bg-green-100 text-green-700' },
    CANCELADA: { label: 'Cancelada', color: 'bg-red-100 text-red-700' },
};

export default function ProductionOrders() {
    const user = useAuthStore(s => s.user);
    const [orders, setOrders] = useState<ProductionOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ order_number: '', tolerance_coefficient: 0.02 });
    const [saving, setSaving] = useState(false);

    const fetchOrders = useCallback(() => {
        setLoading(true);
        getProductionOrders(filter || undefined).then(setOrders).finally(() => setLoading(false));
    }, [filter]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleCreate = async () => {
        if (!form.order_number || !user) return;
        setSaving(true);
        try {
            await createProductionOrder({ order_number: form.order_number, created_by: user.id });
            setShowCreate(false);
            setForm({ order_number: '', tolerance_coefficient: 0.02 });
            fetchOrders();
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const handleStatusChange = async (id: string, status: string) => {
        await updateProductionOrderStatus(id, status);
        fetchOrders();
    };

    const nextStatus = (current: string) => {
        const flow: Record<string, string> = { PENDIENTE: 'EN_PROCESO', EN_PROCESO: 'COMPLETADA' };
        return flow[current];
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🏭 Órdenes de Producción</h1>
                <div className="flex gap-3">
                    <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option value="">Todos</option>
                        {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                        + Nueva Orden
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div></div>
            ) : (
                <div className="grid gap-4">
                    {orders.map(order => (
                        <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-gray-800 text-lg">#{order.order_number}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_MAP[order.status]?.color || 'bg-gray-100'}`}>
                                            {STATUS_MAP[order.status]?.label || order.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">MP Ingresada</span>
                                            <p className="font-semibold text-gray-800">{order.total_raw_input}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">PF Producido</span>
                                            <p className="font-semibold text-gray-800">{order.total_finished_output}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Merma</span>
                                            <p className={`font-semibold ${order.actual_loss > 0 ? 'text-red-600' : 'text-gray-800'}`}>{order.actual_loss}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Tolerancia</span>
                                            <p className="font-semibold text-gray-800">{(order.tolerance_coefficient * 100).toFixed(1)}%</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 self-end sm:self-center">
                                    {nextStatus(order.status) && (
                                        <button
                                            onClick={() => handleStatusChange(order.id, nextStatus(order.status)!)}
                                            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            → {STATUS_MAP[nextStatus(order.status)!]?.label}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="mt-3 text-xs text-gray-400">
                                Creada: {new Date(order.created_at).toLocaleDateString('es-MX')}
                                {order.started_at && ` | Iniciada: ${new Date(order.started_at).toLocaleDateString('es-MX')}`}
                                {order.completed_at && ` | Completada: ${new Date(order.completed_at).toLocaleDateString('es-MX')}`}
                            </div>
                        </motion.div>
                    ))}
                    {orders.length === 0 && <div className="text-center py-12 text-gray-400">No hay órdenes de producción</div>}
                </div>
            )}

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">🏭 Nueva Orden de Producción</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Número de Orden *</label>
                                <input value={form.order_number} onChange={e => setForm(f => ({ ...f, order_number: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="PROD-001" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Coeficiente de Tolerancia (%)</label>
                                <input type="number" step="0.01" value={form.tolerance_coefficient} onChange={e => setForm(f => ({ ...f, tolerance_coefficient: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                            <button onClick={handleCreate} disabled={saving || !form.order_number} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                                {saving ? 'Creando...' : 'Crear Orden'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
