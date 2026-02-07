import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createTransportAssignment, getTransportAssignments, getUsers, updateTransportAssignment, type ERPUser, type TransportAssignment } from '../../lib/erp';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    PROGRAMADO: { label: 'Programado', color: 'bg-gray-100 text-gray-700' },
    EN_RUTA: { label: 'En Ruta', color: 'bg-blue-100 text-blue-700' },
    RECOLECTADO: { label: 'Recolectado', color: 'bg-amber-100 text-amber-700' },
    ENTREGADO: { label: 'Entregado', color: 'bg-green-100 text-green-700' },
};

const FLOW: Record<string, string> = { PROGRAMADO: 'EN_RUTA', EN_RUTA: 'RECOLECTADO', RECOLECTADO: 'ENTREGADO' };

export default function TransportAssignments() {
    const [assignments, setAssignments] = useState<TransportAssignment[]>([]);
    const [drivers, setDrivers] = useState<ERPUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ driver_id: '', scheduled_date: '', notes: '' });
    const [saving, setSaving] = useState(false);

    const fetch = () => { setLoading(true); getTransportAssignments().then(setAssignments).finally(() => setLoading(false)); };
    useEffect(() => { fetch(); getUsers('TRANSPORTISTA').then(setDrivers); }, []);

    const handleAdvance = async (id: string, current: string) => {
        const next = FLOW[current]; if (!next) return;
        const updates: any = { status: next };
        if (next === 'ENTREGADO') updates.delivery_confirmed = true;
        if (next === 'RECOLECTADO') updates.pickup_confirmed = true;
        await updateTransportAssignment(id, updates);
        fetch();
    };

    const handleCreate = async () => {
        if (!form.driver_id || !form.scheduled_date) return;
        setSaving(true);
        try {
            await createTransportAssignment(form);
            setShowCreate(false); fetch();
        } catch (e) { console.error(e); } finally { setSaving(false); }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🚛 Asignaciones de Transporte</h1>
                <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Nueva Asignación</button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div></div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {assignments.map(a => (
                        <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_MAP[a.status]?.color}`}>{STATUS_MAP[a.status]?.label}</span>
                                <span className="text-xs text-gray-400">{new Date(a.scheduled_date).toLocaleDateString('es-MX')}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-800 mb-1">Chofer: {(a as any).users?.fullName || (a as any).users?.email || '—'}</p>
                            <div className="flex gap-4 text-xs text-gray-500 mb-3">
                                <span>📦 Recolección: {a.pickup_confirmed ? '✅' : '⏳'}</span>
                                <span>🏠 Entrega: {a.delivery_confirmed ? '✅' : '⏳'}</span>
                            </div>
                            {a.notes && <p className="text-xs text-gray-400 mb-3">{a.notes}</p>}
                            {FLOW[a.status] && (
                                <button onClick={() => handleAdvance(a.id, a.status)} className="w-full py-2 bg-indigo-50 text-indigo-600 text-sm rounded-lg hover:bg-indigo-100 font-medium">
                                    → {STATUS_MAP[FLOW[a.status]]?.label}
                                </button>
                            )}
                        </motion.div>
                    ))}
                    {assignments.length === 0 && <div className="col-span-2 text-center py-12 text-gray-400">No hay asignaciones</div>}
                </div>
            )}

            {showCreate && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">🚛 Nueva Asignación</h2>
                        <div className="space-y-4">
                            <div><label className="block text-xs font-medium text-gray-500 mb-1">Chofer *</label>
                                <select value={form.driver_id} onChange={e => setForm(f => ({ ...f, driver_id: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                                    <option value="">Seleccionar...</option>
                                    {drivers.map(d => <option key={d.id} value={d.id}>{d.fullName || d.email}</option>)}
                                </select></div>
                            <div><label className="block text-xs font-medium text-gray-500 mb-1">Fecha Programada *</label>
                                <input type="date" value={form.scheduled_date} onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                            <div><label className="block text-xs font-medium text-gray-500 mb-1">Notas</label>
                                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} /></div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                            <button onClick={handleCreate} disabled={saving || !form.driver_id || !form.scheduled_date} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                                {saving ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
