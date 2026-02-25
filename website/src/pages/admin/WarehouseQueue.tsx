import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { OrderB2B, OrderItem } from '../../lib/supabase';
import {
    getShippingQueue,
    getCompletedShipments,
    updatePackedItems,
    updateOrderTracking,
} from '../../lib/supabase';

type QueueOrder = OrderB2B & { order_items: OrderItem[] };

const CUTOFF_HOUR = 17; // 5 PM

function getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
}

function isPastCutoff(): boolean {
    return new Date().getHours() >= CUTOFF_HOUR;
}

function formatDate(d: string): string {
    return new Date(d + 'T12:00:00').toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatTime(d: string | null): string {
    if (!d) return '—';
    return new Date(d).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

// ─────────────────────────────────────────────
// Shipping Email Template (visual reference)
// ─────────────────────────────────────────────
function ShippingEmailPreview({
    order,
    onClose,
}: {
    order: QueueOrder;
    onClose: () => void;
}) {
    const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f1ec;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:32px 24px;text-align:center;">
    <h1 style="color:#d4af37;font-size:28px;margin:0;font-family:Georgia,serif;">J. Denis</h1>
    <p style="color:#ccc;font-size:13px;margin:8px 0 0;">Belleza Profesional</p>
  </td></tr>
  <tr><td style="padding:32px 24px;">
    <h2 style="color:#1a1a2e;text-align:center;margin:0 0 8px;">¡Tu pedido ha sido enviado! 📦</h2>
    <p style="text-align:center;color:#666;font-size:14px;">Pedido <strong>#${order.order_number}</strong></p>
    <div style="background:#f8f6f0;border-radius:8px;padding:20px;margin:24px 0;text-align:center;">
      <p style="color:#888;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">Número de Guía</p>
      <p style="color:#1a1a2e;font-size:24px;font-weight:bold;margin:0;letter-spacing:2px;">${order.tracking_number || '—'}</p>
    </div>
    <h3 style="color:#1a1a2e;font-size:15px;border-bottom:1px solid #eee;padding-bottom:8px;">Productos enviados</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
      ${(order.order_items || []).map(item => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${item.product_name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center;">x${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">$${item.total.toLocaleString('es-MX')}</td>
      </tr>`).join('')}
      <tr>
        <td colspan="2" style="padding:12px 0;font-weight:700;font-size:15px;">Total</td>
        <td style="padding:12px 0;text-align:right;font-weight:700;font-size:15px;color:#d4af37;">$${order.total.toLocaleString('es-MX')} MXN</td>
      </tr>
    </table>
    <div style="background:#eef7ee;border-left:4px solid #48bb78;padding:12px 16px;border-radius:4px;margin:24px 0;">
      <p style="margin:0;font-size:13px;color:#2d6a4f;">Puedes rastrear tu paquete con el número de guía proporcionado en la página de la paquetería correspondiente.</p>
    </div>
  </td></tr>
  <tr><td style="background:#1a1a2e;padding:20px 24px;text-align:center;">
    <p style="color:#999;font-size:12px;margin:0;">¿Necesitas ayuda? Contáctanos por WhatsApp</p>
    <p style="color:#d4af37;font-size:13px;margin:4px 0 0;">📱 55 1234 5678 · ✉️ contacto@jdenis.com</p>
  </td></tr>
</table>
</body>
</html>`;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                        Vista Previa — Correo de Envío
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <iframe
                        title="Email Preview"
                        srcDoc={html}
                        className="w-full h-[600px] border border-gray-200 rounded-lg"
                    />
                </div>
                <div className="px-6 py-3 border-t bg-gray-50 text-xs text-gray-500">
                    ⓘ Vista previa del correo que se enviará al cliente. El envío real se procesa vía servidor.
                </div>
            </motion.div>
        </div>
    );
}

// ─────────────────────────────────────────────
// ORDER CARD Component
// ─────────────────────────────────────────────
function OrderCard({
    order,
    index,
    onUpdate,
}: {
    order: QueueOrder;
    index: number;
    onUpdate: () => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [packedItems, setPackedItems] = useState<Record<string, boolean>>(
        order.packed_items || {}
    );
    const [trackingNumber, setTrackingNumber] = useState('');
    const [saving, setSaving] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [completed, setCompleted] = useState(false);

    const items = order.order_items || [];
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);
    const packedCount = Object.values(packedItems).filter(Boolean).length;
    const allPacked = items.length > 0 && packedCount === items.length;

    const statusLabel = completed
        ? 'COMPLETADO'
        : allPacked
            ? 'LISTO PARA ENVÍO'
            : packedCount > 0
                ? 'EN PROGRESO'
                : 'EMPAQUETAR';

    const statusColor = completed
        ? 'bg-green-100 text-green-700'
        : allPacked
            ? 'bg-blue-100 text-blue-700'
            : packedCount > 0
                ? 'bg-amber-100 text-amber-700'
                : 'bg-red-100 text-red-700';

    const handleToggleItem = async (itemId: string) => {
        const updated = { ...packedItems, [itemId]: !packedItems[itemId] };
        setPackedItems(updated);
        setSaving(true);
        try {
            await updatePackedItems(order.id, updated);
        } catch (e) {
            console.error('Error updating packed items:', e);
        } finally {
            setSaving(false);
        }
    };

    const handleComplete = async () => {
        if (!trackingNumber.trim()) return;
        setCompleting(true);
        try {
            await updateOrderTracking(order.id, trackingNumber.trim());
            setCompleted(true);
            // Show email preview briefly, then refresh
            setShowEmail(true);
        } catch (e) {
            console.error('Error completing order:', e);
        } finally {
            setCompleting(false);
        }
    };

    const handleCloseEmail = () => {
        setShowEmail(false);
        onUpdate();
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all border-l-4 ${completed ? 'border-green-500 opacity-60' : allPacked ? 'border-blue-500' : packedCount > 0 ? 'border-amber-400' : 'border-red-400'
                    }`}
            >
                {/* Header — always visible */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-gray-300 tabular-nums w-8 text-right">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                            <p className="font-bold text-gray-900 flex items-center gap-2">
                                Pedido · #{order.order_number}
                                <span className="text-gray-400 font-normal text-sm">
                                    ({totalItems} Producto{totalItems !== 1 ? 's' : ''})
                                </span>
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                ${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                {order.payment_method && ` · ${order.payment_method}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${statusColor}`}>
                            {statusLabel}
                        </span>
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                        >
                            <div className="px-5 pb-5 border-t border-gray-100">
                                {/* Product checklist */}
                                <div className="mt-4 space-y-2">
                                    {items.map((item, idx) => {
                                        const checked = !!packedItems[item.id];
                                        return (
                                            <label
                                                key={item.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${checked
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => handleToggleItem(item.id)}
                                                    disabled={completed}
                                                    className="w-5 h-5 accent-green-600 rounded"
                                                />
                                                <span className="text-sm font-medium text-gray-500 w-6">
                                                    {idx + 1}-
                                                </span>
                                                <span className={`flex-1 text-sm ${checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                    ({String(item.quantity).padStart(2, '0')}) {item.product_name}
                                                </span>
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${checked
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-200 text-gray-500'
                                                    }`}>
                                                    {checked ? '✓ completado' : 'pendiente'}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>

                                {saving && (
                                    <p className="text-xs text-indigo-500 mt-2 flex items-center gap-1">
                                        <span className="animate-spin inline-block w-3 h-3 border-t-2 border-indigo-500 rounded-full" />
                                        Guardando progreso...
                                    </p>
                                )}

                                {/* Tracking number + complete button */}
                                {allPacked && !completed && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-200"
                                    >
                                        <p className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                                            Todos los productos empaquetados — Ingresa el número de guía
                                        </p>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={trackingNumber}
                                                onChange={(e) => setTrackingNumber(e.target.value)}
                                                placeholder="Ej: 7940 1234 5678 9012"
                                                className="flex-1 px-4 py-2.5 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            />
                                            <button
                                                onClick={handleComplete}
                                                disabled={!trackingNumber.trim() || completing}
                                                className="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                                            >
                                                {completing ? (
                                                    <span className="animate-spin inline-block w-4 h-4 border-t-2 border-white rounded-full" />
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                )}
                                                COMPLETAR
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Completed summary */}
                                {completed && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3"
                                    >
                                        <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <div>
                                            <p className="text-sm font-bold text-green-800">Pedido enviado</p>
                                            <p className="text-xs text-green-600">Guía: {trackingNumber}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Email preview modal */}
            {showEmail && (
                <ShippingEmailPreview
                    order={{ ...order, tracking_number: trackingNumber }}
                    onClose={handleCloseEmail}
                />
            )}
        </>
    );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function WarehouseQueue() {
    const [queueOrders, setQueueOrders] = useState<QueueOrder[]>([]);
    const [completedOrders, setCompletedOrders] = useState<QueueOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCompleted, setShowCompleted] = useState(false);
    const [viewDate] = useState(getTodayDate());

    const fetchQueue = useCallback(async () => {
        try {
            const [queue, completed] = await Promise.all([
                getShippingQueue(viewDate),
                getCompletedShipments(viewDate),
            ]);
            setQueueOrders(queue || []);
            setCompletedOrders(completed || []);
        } catch (e) {
            console.error('Error fetching queue:', e);
        } finally {
            setLoading(false);
        }
    }, [viewDate]);

    useEffect(() => {
        fetchQueue();
        // Polling every 30s
        const interval = setInterval(fetchQueue, 30000);
        return () => clearInterval(interval);
    }, [fetchQueue]);

    const pastCutoff = useMemo(() => isPastCutoff(), []);

    const stats = useMemo(() => ({
        pending: queueOrders.length,
        completed: completedOrders.length,
        total: queueOrders.length + completedOrders.length,
    }), [queueOrders, completedOrders]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Cargando cola de envíos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                        </div>
                        Cola de Envíos
                    </h1>
                    <div className="flex items-center gap-3">
                        {pastCutoff && (
                            <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Corte 5 PM — Nuevos pedidos se encolan para mañana
                            </span>
                        )}
                        <button
                            onClick={() => { setLoading(true); fetchQueue(); }}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                            title="Actualizar"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
                        </button>
                    </div>
                </div>

                <p className="text-sm text-gray-500 capitalize">{formatDate(viewDate)}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                        <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                        <p className="text-xs text-gray-500 mt-1">Total pedidos</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                        <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                        <p className="text-xs text-gray-500 mt-1">Pendientes</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                        <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                        <p className="text-xs text-gray-500 mt-1">Enviados</p>
                    </div>
                </div>
            </div>

            {/* Active Queue */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                    Pedidos Activos
                    <span className="text-sm font-normal text-gray-400">({stats.pending})</span>
                </h2>

                {queueOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl shadow-sm p-12 text-center"
                    >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">¡Todo listo!</h3>
                        <p className="text-gray-500">No hay pedidos pendientes de envío para hoy.</p>
                        <p className="text-xs text-gray-400 mt-2">La cola se actualiza automáticamente cada 30 segundos</p>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        {queueOrders.map((order, index) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                index={index}
                                onUpdate={fetchQueue}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Completed toggle */}
            {completedOrders.length > 0 && (
                <div className="mb-6">
                    <button
                        onClick={() => setShowCompleted(!showCompleted)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-3"
                    >
                        <svg
                            className={`w-4 h-4 transition-transform ${showCompleted ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Enviados hoy ({completedOrders.length})
                    </button>

                    <AnimatePresence>
                        {showCompleted && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                {completedOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    #{order.order_number}
                                                    <span className="text-gray-400 ml-2">
                                                        ({(order.order_items || []).reduce((s, i) => s + i.quantity, 0)} productos)
                                                    </span>
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Guía: <span className="font-mono text-gray-600">{order.tracking_number}</span>
                                                    {' · '}Enviado: {formatTime(order.shipped_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                                            ENVIADO
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Footer info */}
            <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                    <div className="text-xs text-indigo-700 space-y-1">
                        <p><strong>Horario de cola:</strong> Los nuevos pedidos se agregan a la cola hasta las 5:00 PM. Después de esa hora, se encolan automáticamente para el día siguiente.</p>
                        <p><strong>Actualización:</strong> La cola se actualiza automáticamente cada 30 segundos. También puedes actualizar manualmente con el botón ↻.</p>
                        <p><strong>Notificación:</strong> Al completar un pedido con su guía, se envía automáticamente un correo al cliente con los detalles de envío.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
