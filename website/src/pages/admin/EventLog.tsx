import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { getEventLog, type EventLogEntry } from '../../lib/erp';

const I = ({ d }: { d: string }) => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>;

const TYPE_ICONS: Record<string, ReactNode> = {
    COMPRA: <I d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />,
    VENTA: <I d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    INGRESO: <I d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />,
    EGRESO: <I d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3v11.25" />,
    PRODUCCION: <I d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0V21" />,
    TRANSPORTE: <I d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />,
    FACTURA: <I d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
};

const MODULE_COLORS: Record<string, string> = {
    FABRICA: 'bg-amber-100 text-amber-700', ALMACEN_MP: 'bg-blue-100 text-blue-700',
    ALMACEN_PF: 'bg-cyan-100 text-cyan-700', EJECUTIVO: 'bg-purple-100 text-purple-700',
    TRANSPORTE: 'bg-green-100 text-green-700',
};

export default function EventLog() {
    const [events, setEvents] = useState<EventLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('');
    const [moduleFilter, setModuleFilter] = useState('');

    useEffect(() => {
        setLoading(true);
        const filters: any = {};
        if (typeFilter) filters.event_type = typeFilter;
        if (moduleFilter) filters.module = moduleFilter;
        getEventLog(100, Object.keys(filters).length ? filters : undefined).then(setEvents).finally(() => setLoading(false));
    }, [typeFilter, moduleFilter]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><I d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /> Log de Eventos</h1>
                <div className="flex gap-3">
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option value="">Todos los Tipos</option>
                        {Object.keys(TYPE_ICONS).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                        <option value="">Todos los Módulos</option>
                        {Object.keys(MODULE_COLORS).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div></div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-50">
                        {events.map(event => (
                            <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                                <div className="w-6 h-6 mt-0.5">{TYPE_ICONS[event.event_type] || <I d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-medium text-gray-800 text-sm">{event.action}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${MODULE_COLORS[event.module] || 'bg-gray-100 text-gray-600'}`}>{event.module}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span>{(event as any).users?.fullName || (event as any).users?.email || event.performed_by.slice(0, 8)}</span>
                                        <span>•</span>
                                        <span>{new Date(event.created_at).toLocaleString('es-MX')}</span>
                                        {event.entity_type && <><span>•</span><span>{event.entity_type}</span></>}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {events.length === 0 && (
                            <div className="px-6 py-12 text-center text-gray-400">No hay eventos registrados. Las operaciones del ERP aparecerán aquí.</div>
                        )}
                    </div>
                    <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100">{events.length} evento(s)</div>
                </motion.div>
            )}
        </div>
    );
}
