import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getEventLog, type EventLogEntry } from '../../lib/erp';

const TYPE_ICONS: Record<string, string> = {
    COMPRA: '🛒', VENTA: '💰', INGRESO: '📥', EGRESO: '📤',
    PRODUCCION: '🏭', TRANSPORTE: '🚛', FACTURA: '📄',
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
                <h1 className="text-2xl font-bold text-gray-800">📝 Log de Eventos</h1>
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
                                <div className="text-2xl mt-0.5">{TYPE_ICONS[event.event_type] || '📋'}</div>
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
