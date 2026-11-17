import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ShieldCheck, RefreshCw, CheckCircle2, AlertTriangle, Wrench, Clock, MessageSquarePlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

interface BackendQaReport {
    id: string;
    created_at: string;
    trigger_source: string;
    overall_status: 'HEALTHY' | 'AUTO_HEALED' | 'WARNING' | 'CRITICAL';
    checks: Record<string, boolean>;
    auto_fixes: string[];
    metrics: Record<string, number | string>;
    duration_ms: number;
}

interface AdminUxNote {
    id: string;
    created_at: string;
    path: string | null;
    element_text: string | null;
    metadata?: {
        feedback_type?: string;
        message?: string;
        user_email?: string;
    } | null;
}

const CHECK_LABELS: Record<string, string> = {
    storefront_health_200: 'Servidor Web (/health HTTP 200)',
    tienda_route_200: 'Tienda Pública (/tienda HTTP 200)',
    service_worker_no_store: 'Service Worker Anti-Caché (/sw.js no-store)',
    merchant_feed_200: 'Google Merchant Feed XML (HTTP 200)',
    all_products_in_stock: '100% Productos y Variantes con Stock',
    all_prices_valid: '100% Precios Base y Promos Válidos',
    all_descriptions_legible: '100% Descripciones Comerciales Legibles',
    mercadopago_configured: 'Credencial Mercado Pago Activa (Opcional si usa Pedido Directo)',
    resend_email_configured: 'Motor de Correos Transaccionales (Resend)',
    js_exceptions_low_6h: 'Cero Picos de Excepciones JS (Últimas 6h)',
};

export default function BackendQaMonitor() {
    const { user, isAuthenticated } = useAuthStore();
    const [reports, setReports] = useState<BackendQaReport[]>([]);
    const [uxNotes, setUxNotes] = useState<AdminUxNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isAdmin = isAuthenticated && (user?.role || '').toUpperCase() === 'ADMIN';

    const fetchReports = useCallback(async () => {
        if (!isAdmin) return;
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchErr } = await supabase
                .from('backend_qa_reports')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);
            if (fetchErr) throw fetchErr;
            setReports((data || []) as BackendQaReport[]);

            const { data: notesData } = await supabase
                .from('analytics_events')
                .select('id, created_at, path, element_text, metadata')
                .eq('event_name', 'ux_feedback')
                .order('created_at', { ascending: false })
                .limit(10);
            if (notesData) {
                setUxNotes(notesData as AdminUxNote[]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al consultar bitácora QA del backend');
        } finally {
            setLoading(false);
        }
    }, [isAdmin]);

    useEffect(() => {
        fetchReports();
        const onSubmitted = () => fetchReports();
        window.addEventListener('jdenis:ux-feedback-submitted', onSubmitted);
        return () => window.removeEventListener('jdenis:ux-feedback-submitted', onSubmitted);
    }, [fetchReports]);

    if (!isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    const handleRunAuditNow = async () => {
        setRunning(true);
        setError(null);
        try {
            const { error: rpcErr } = await supabase.rpc('run_backend_qa_audit', {
                p_trigger: 'admin_manual',
                p_send_alert: false,
            });
            if (rpcErr) throw rpcErr;
            await fetchReports();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al ejecutar auditoría en backend');
        } finally {
            setRunning(false);
        }
    };

    const latest = reports[0];

    const statusBadge = (status: BackendQaReport['overall_status']) => {
        switch (status) {
            case 'HEALTHY':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'AUTO_HEALED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'WARNING':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'CRITICAL':
                return 'bg-red-100 text-red-800 border-red-200';
        }
    };

    return (
        <div className="p-2 sm:p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                    <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-6 h-6 text-indigo-600" />
                        <h1 className="text-xl font-bold text-gray-900">Guardián QA & Mejora UX (Sólo Administradores)</h1>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Panel interno exclusivo para Administradores autenticados. El agente y la burbuja <strong>Mejora UX</strong> están 100% ocultos del frontend público de clientes.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleRunAuditNow}
                    disabled={running}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
                    {running ? 'Auditando Sistema...' : 'Ejecutar Auditoría Ahora'}
                </button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="p-12 text-center text-gray-400 text-sm">Cargando reportes administrativos...</div>
            ) : latest ? (
                <>
                    {/* Latest Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Estado Actual</span>
                            <div className="mt-2 flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge(latest.overall_status)}`}>
                                    {latest.overall_status}
                                </span>
                                <span className="text-xs text-gray-400">{latest.duration_ms} ms</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Productos Activos / Stock</span>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {latest.metrics?.active_products ?? 0}{' '}
                                <span className="text-xs font-normal text-emerald-600">
                                    ({Number(latest.metrics?.zero_stock_products ?? 0) === 0 ? '100% con stock' : `${latest.metrics?.zero_stock_products} sin stock`})
                                </span>
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Variantes Activas</span>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {latest.metrics?.active_variants ?? 0}{' '}
                                <span className="text-xs font-normal text-emerald-600">
                                    ({Number(latest.metrics?.zero_stock_variants ?? 0) === 0 ? '100% con stock' : `${latest.metrics?.zero_stock_variants} sin stock`})
                                </span>
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Excepciones JS (6h)</span>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {latest.metrics?.js_exceptions_last_6h ?? 0}
                            </p>
                        </div>
                    </div>

                    {/* Checks Matrix */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Matriz de Verificación del Último Corte</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(latest.checks || {}).map(([key, passed]) => (
                                <div
                                    key={key}
                                    className={`flex items-center justify-between p-3 rounded-xl border ${
                                        passed ? 'bg-emerald-50/40 border-emerald-100' : 'bg-amber-50/60 border-amber-200'
                                    }`}
                                >
                                    <span className="text-sm text-gray-800 font-medium">{CHECK_LABELS[key] || key}</span>
                                    {passed ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                    ) : (
                                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {Array.isArray(latest.auto_fixes) && latest.auto_fixes.length > 0 && (
                            <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-200">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800 mb-2">
                                    <Wrench className="w-4 h-4" />
                                    Auto-Rectificaciones Aplicadas en Backend
                                </div>
                                <ul className="list-disc list-inside text-sm text-blue-900 space-y-1">
                                    {latest.auto_fixes.map((fix, idx) => (
                                        <li key={idx}>{fix}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Admin UX Notes */}
                    {uxNotes.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                <MessageSquarePlus className="w-4 h-4 text-indigo-500" />
                                <h2 className="text-sm font-bold text-gray-800">Directivas Recientes de Mejora UX (Administradores)</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {uxNotes.map((n) => (
                                    <div key={n.id} className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div>
                                            <p className="text-sm text-gray-800 font-medium">
                                                {n.metadata?.message || n.element_text || 'Sin detalle'}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Categoría: {n.metadata?.feedback_type || 'ux'} · Ruta: {n.path || '/admin'}
                                                {n.metadata?.user_email ? ` · ${n.metadata.user_email}` : ''}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {new Date(n.created_at).toLocaleString('es-MX')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* History Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <h2 className="text-sm font-bold text-gray-800">Historial Reciente de Ejecuciones (`pg_cron` / Manual)</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3">Fecha / Hora</th>
                                        <th className="px-6 py-3">Origen</th>
                                        <th className="px-6 py-3">Estado</th>
                                        <th className="px-6 py-3">Auto-Rectificaciones</th>
                                        <th className="px-6 py-3 text-right">Duración</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reports.map((r) => (
                                        <tr key={r.id} className="hover:bg-gray-50/60">
                                            <td className="px-6 py-3 text-gray-700 whitespace-nowrap">
                                                {new Date(r.created_at).toLocaleString('es-MX')}
                                            </td>
                                            <td className="px-6 py-3 font-mono text-xs text-gray-500">{r.trigger_source}</td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(r.overall_status)}`}>
                                                    {r.overall_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-gray-600 text-xs">
                                                {Array.isArray(r.auto_fixes) && r.auto_fixes.length > 0
                                                    ? r.auto_fixes.join(' · ')
                                                    : 'Ninguna necesaria (100% íntegro)'}
                                            </td>
                                            <td className="px-6 py-3 text-right text-xs text-gray-400">{r.duration_ms} ms</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
