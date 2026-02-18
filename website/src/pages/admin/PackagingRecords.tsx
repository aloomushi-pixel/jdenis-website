import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPackagingRecord, getPackagingRecords, updatePackagingStatus, type PackagingRecord } from '../../lib/erp';
import { useAuthStore } from '../../store/authStore';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    PENDIENTE: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
    EN_PROCESO: { label: 'En Proceso', color: 'bg-blue-100 text-blue-700' },
    COMPLETADO: { label: 'Completado', color: 'bg-green-100 text-green-700' },
};

export default function PackagingRecords() {
    const user = useAuthStore(s => s.user);
    const [records, setRecords] = useState<PackagingRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ total_packages: 0, packing_list: '', weight: 0 });
    const [saving, setSaving] = useState(false);

    const fetch = () => { setLoading(true); getPackagingRecords(filter || undefined).then(setRecords).finally(() => setLoading(false)); };
    useEffect(() => { fetch(); }, [filter]);

    const handleCreate = async () => {
        setSaving(true);
        try {
            await createPackagingRecord({ packaged_by: user?.id });
            setShowCreate(false); fetch();
        } catch (e) { console.error(e); } finally { setSaving(false); }
    };

    const handleAdvance = async (id: string, current: string) => {
        const flow: Record<string, string> = { PENDIENTE: 'EN_PROCESO', EN_PROCESO: 'COMPLETADO' };
        const next = flow[current]; if (!next) return;
        await updatePackagingStatus(id, next);
        fetch();
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg> Registros de Embalaje</h1>
                <div className="flex gap-3">
                    <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option value="">Todos</option>
                        {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Nuevo Registro</button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div></div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {records.map(r => (
                        <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_MAP[r.status]?.color}`}>{STATUS_MAP[r.status]?.label}</span>
                                <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('es-MX')}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                <div><span className="text-gray-500">Paquetes:</span> <span className="font-medium">{r.total_packages}</span></div>
                                <div><span className="text-gray-500">Peso:</span> <span className="font-medium">{r.weight || '—'} kg</span></div>
                            </div>
                            {r.packing_list && <p className="text-xs text-gray-500 mb-3 truncate">PL: {r.packing_list}</p>}
                            {r.status !== 'COMPLETADO' && (
                                <button onClick={() => handleAdvance(r.id, r.status)} className="w-full py-2 bg-indigo-50 text-indigo-600 text-sm rounded-lg hover:bg-indigo-100 font-medium">
                                    → {r.status === 'PENDIENTE' ? 'Iniciar' : 'Completar'}
                                </button>
                            )}
                        </motion.div>
                    ))}
                    {records.length === 0 && <div className="col-span-3 text-center py-12 text-gray-400">No hay registros de embalaje</div>}
                </div>
            )}

            {showCreate && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg> Nuevo Registro de Embalaje</h2>
                        <div className="space-y-4">
                            <div><label className="block text-xs font-medium text-gray-500 mb-1">Total de Paquetes</label>
                                <input type="number" value={form.total_packages} onChange={e => setForm(f => ({ ...f, total_packages: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                            <div><label className="block text-xs font-medium text-gray-500 mb-1">Peso (kg)</label>
                                <input type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                            <div><label className="block text-xs font-medium text-gray-500 mb-1">Packing List</label>
                                <textarea value={form.packing_list} onChange={e => setForm(f => ({ ...f, packing_list: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" rows={3} /></div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                            <button onClick={handleCreate} disabled={saving} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                                {saving ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
