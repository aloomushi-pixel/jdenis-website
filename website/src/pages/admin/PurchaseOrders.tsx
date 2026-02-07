import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPurchaseOrder, getPurchaseOrders, updatePurchaseOrderStatus, type PurchaseOrder } from '../../lib/erp';
import { useAuthStore } from '../../store/authStore';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    BORRADOR: { label: 'Borrador', color: 'bg-gray-100 text-gray-700' },
    ENVIADA: { label: 'Enviada', color: 'bg-blue-100 text-blue-700' },
    CONFIRMADA: { label: 'Confirmada', color: 'bg-green-100 text-green-700' },
    RECIBIDA: { label: 'Recibida', color: 'bg-teal-100 text-teal-700' },
    CANCELADA: { label: 'Cancelada', color: 'bg-red-100 text-red-700' },
};

const FLOW: Record<string, string> = {
    BORRADOR: 'ENVIADA', ENVIADA: 'CONFIRMADA', CONFIRMADA: 'RECIBIDA'
};

export default function PurchaseOrders() {
    const user = useAuthStore(s => s.user);
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({
        order_number: '', supplier_name: '', supplier_contact: '',
        notes: '', subtotal: 0, tax: 0
    });
    const [saving, setSaving] = useState(false);

    const fetchOrders = () => {
        setLoading(true);
        getPurchaseOrders(filter || undefined)
            .then(setOrders).finally(() => setLoading(false));
    };
    useEffect(() => { fetchOrders(); }, [filter]);

    const handleCreate = async () => {
        if (!form.order_number || !user) return;
        setSaving(true);
        try {
            const total = form.subtotal + form.tax;
            await createPurchaseOrder({
                ...form, total, created_by: user.id
            });
            setShowCreate(false);
            setForm({ order_number: '', supplier_name: '', supplier_contact: '', notes: '', subtotal: 0, tax: 0 });
            fetchOrders();
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const handleStatusChange = async (id: string, status: string) => {
        await updatePurchaseOrderStatus(id, status);
        fetchOrders();
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    🛒 Órdenes de Compra
                </h1>
                <div className="flex gap-3">
                    <select value={filter} onChange={e => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option value="">Todos</option>
                        {Object.entries(STATUS_MAP).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                        ))}
                    </select>
                    <button onClick={() => setShowCreate(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                        + Nueva Compra
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600" />
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-3 font-semibold text-gray-600"># Orden</th>
                                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Proveedor</th>
                                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Estatus</th>
                                    <th className="text-right px-6 py-3 font-semibold text-gray-600">Subtotal</th>
                                    <th className="text-right px-6 py-3 font-semibold text-gray-600">IVA</th>
                                    <th className="text-right px-6 py-3 font-semibold text-gray-600">Total</th>
                                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Fecha</th>
                                    <th className="text-center px-6 py-3 font-semibold text-gray-600">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800">{order.order_number}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.supplier_name || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_MAP[order.status]?.color}`}>
                                                {STATUS_MAP[order.status]?.label || order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-700">${order.subtotal.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-gray-500">${order.tax.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-800">${order.total.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {new Date(order.created_at).toLocaleDateString('es-MX')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {FLOW[order.status] && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, FLOW[order.status])}
                                                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs rounded-lg hover:bg-indigo-100 font-medium">
                                                    → {STATUS_MAP[FLOW[order.status]]?.label}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                                        No hay órdenes de compra
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">🛒 Nueva Orden de Compra</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1"># Orden *</label>
                                <input value={form.order_number}
                                    onChange={e => setForm(f => ({ ...f, order_number: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="OC-001" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Proveedor</label>
                                <input value={form.supplier_name}
                                    onChange={e => setForm(f => ({ ...f, supplier_name: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Contacto Proveedor</label>
                                <input value={form.supplier_contact}
                                    onChange={e => setForm(f => ({ ...f, supplier_contact: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Subtotal</label>
                                <input type="number" value={form.subtotal}
                                    onChange={e => setForm(f => ({ ...f, subtotal: Number(e.target.value) }))}
                                    className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">IVA</label>
                                <input type="number" value={form.tax}
                                    onChange={e => setForm(f => ({ ...f, tax: Number(e.target.value) }))}
                                    className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Notas</label>
                                <textarea value={form.notes}
                                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} />
                            </div>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                            <span className="text-gray-500">Total: </span>
                            <span className="font-bold text-gray-800">${(form.subtotal + form.tax).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setShowCreate(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                Cancelar
                            </button>
                            <button onClick={handleCreate} disabled={saving || !form.order_number}
                                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                                {saving ? 'Creando...' : 'Crear Orden'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
