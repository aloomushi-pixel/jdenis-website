import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { CartPromoConfig } from '../../lib/supabase';
import {
    getCartPromoConfigs,
    createCartPromoConfig,
    updateCartPromoConfig,
    deleteCartPromoConfig,
} from '../../lib/supabase';

const emptyConfig: Omit<CartPromoConfig, 'id' | 'created_at' | 'updated_at'> = {
    name: '',
    is_active: true,
    min_amount: 2000,
    min_items: 0,
    eval_mode: 'OR',
    discount_percent: 0,
    free_shipping: true,
    standard_shipping_cost: 200,
    activation_message: '¡Excelente! Tu compra supera los $2,000 MXN y acabamos de activar Envío Gratis en tu carrito 🎉',
    deactivation_message: 'El envío gratis se ha retirado porque tu carrito ya no alcanza los $2,000 MXN.',
    progress_label: 'Agrega ${remaining} MXN más para desbloquear Envío Gratis 🚚',
};

const fmt = (n: number) => `$${n.toLocaleString('es-MX')}`;

export default function CartPromoSettings() {
    const [configs, setConfigs] = useState<CartPromoConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyConfig);
    const [saving, setSaving] = useState(false);

    async function load() {
        try {
            setLoading(true);
            setError(null);
            const data = await getCartPromoConfigs();
            setConfigs(data);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error al cargar configuraciones';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    function openNew() {
        setEditId(null);
        setForm(emptyConfig);
        setShowForm(true);
    }

    function openEdit(c: CartPromoConfig) {
        setEditId(c.id);
        setForm({
            name: c.name,
            is_active: c.is_active,
            min_amount: c.min_amount,
            min_items: c.min_items,
            eval_mode: c.eval_mode,
            discount_percent: c.discount_percent,
            free_shipping: c.free_shipping,
            standard_shipping_cost: c.standard_shipping_cost,
            activation_message: c.activation_message,
            deactivation_message: c.deactivation_message,
            progress_label: c.progress_label,
        });
        setShowForm(true);
    }

    async function save() {
        try {
            setSaving(true);
            if (editId) {
                await updateCartPromoConfig(editId, form);
            } else {
                await createCartPromoConfig(form);
            }
            setShowForm(false);
            await load();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Error al guardar');
        } finally {
            setSaving(false);
        }
    }

    async function toggleActive(c: CartPromoConfig) {
        await updateCartPromoConfig(c.id, { is_active: !c.is_active });
        await load();
    }

    async function remove(id: string) {
        if (!confirm('¿Eliminar esta configuración de promoción?')) return;
        await deleteCartPromoConfig(id);
        await load();
    }

    const F = (label: string, children: React.ReactNode) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
        </div>
    );

    const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Promociones del Carrito</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Configura reglas automáticas que se aplican al carrito de compras (envío gratis, descuentos, etc.)
                    </p>
                </div>
                <button onClick={openNew} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
                    + Nueva Regla
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                    <strong>Error:</strong> {error}
                    <p className="mt-2 text-xs">
                        Si la tabla no existe, ejecuta el SQL en: <code className="bg-red-100 px-1 rounded">migrations/create_cart_promo_config.sql</code>
                    </p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && configs.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900">Sin reglas de promoción</h3>
                    <p className="text-gray-500 text-sm mt-1">Crea una regla para que el carrito aplique beneficios automáticamente.</p>
                    <button onClick={openNew} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                        Crear primera regla
                    </button>
                </div>
            )}

            {/* Config Cards */}
            {!loading && configs.length > 0 && (
                <div className="grid gap-4">
                    {configs.map((c) => (
                        <motion.div
                            key={c.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white rounded-xl border shadow-sm p-5 ${c.is_active ? 'border-green-300 ring-1 ring-green-100' : 'border-gray-200 opacity-70'}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                            {c.is_active ? '● Activa' : '○ Inactiva'}
                                        </span>
                                        <h3 className="text-lg font-semibold text-gray-900">{c.name || 'Sin nombre'}</h3>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Monto Mínimo</p>
                                            <p className="text-lg font-bold text-gray-900">{c.min_amount > 0 ? fmt(c.min_amount) : '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Artículos Mín.</p>
                                            <p className="text-lg font-bold text-gray-900">{c.min_items > 0 ? c.min_items : '—'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Envío Gratis</p>
                                            <p className="text-lg font-bold text-gray-900">{c.free_shipping ? '✅ Sí' : '❌ No'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Descuento</p>
                                            <p className="text-lg font-bold text-gray-900">{c.discount_percent > 0 ? `${c.discount_percent}%` : '—'}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 text-xs text-gray-500">
                                        Modo: <span className="font-medium">{c.eval_mode === 'OR' ? 'Cualquier condición' : 'Todas las condiciones'}</span>
                                        {' · '}Envío estándar: <span className="font-medium">{fmt(c.standard_shipping_cost)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <button onClick={() => toggleActive(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${c.is_active ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}>
                                        {c.is_active ? 'Desactivar' : 'Activar'}
                                    </button>
                                    <button onClick={() => openEdit(c)} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-200 transition-colors">
                                        Editar
                                    </button>
                                    <button onClick={() => remove(c.id)} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-[640px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                                <h2 className="text-lg font-bold text-gray-900">{editId ? 'Editar Regla' : 'Nueva Regla de Promoción'}</h2>
                                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {F('Nombre de la promoción',
                                    <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ej: Envío Gratis +$2000" />
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    {F('Monto mínimo (MXN)',
                                        <input type="number" className={inputCls} value={form.min_amount} onChange={e => setForm({ ...form, min_amount: Number(e.target.value) })} min={0} />
                                    )}
                                    {F('Artículos mínimos',
                                        <input type="number" className={inputCls} value={form.min_items} onChange={e => setForm({ ...form, min_items: Number(e.target.value) })} min={0} />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {F('Modo de evaluación',
                                        <select className={inputCls} value={form.eval_mode} onChange={e => setForm({ ...form, eval_mode: e.target.value as 'OR' | 'AND' })}>
                                            <option value="OR">OR — Cualquier condición</option>
                                            <option value="AND">AND — Todas las condiciones</option>
                                        </select>
                                    )}
                                    {F('Descuento (%)',
                                        <input type="number" className={inputCls} value={form.discount_percent} onChange={e => setForm({ ...form, discount_percent: Number(e.target.value) })} min={0} max={100} />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {F('¿Envío gratis?',
                                        <select className={inputCls} value={form.free_shipping ? 'true' : 'false'} onChange={e => setForm({ ...form, free_shipping: e.target.value === 'true' })}>
                                            <option value="true">Sí — Envío gratis</option>
                                            <option value="false">No — Envío normal</option>
                                        </select>
                                    )}
                                    {F('Costo envío estándar (MXN)',
                                        <input type="number" className={inputCls} value={form.standard_shipping_cost} onChange={e => setForm({ ...form, standard_shipping_cost: Number(e.target.value) })} min={0} />
                                    )}
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                                    <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 text-indigo-600 rounded" />
                                    <label htmlFor="is_active" className="text-sm font-medium text-indigo-900">Activar esta promoción inmediatamente</label>
                                </div>

                                <hr className="border-gray-200" />
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mensajes personalizables</p>

                                {F('Mensaje de activación',
                                    <textarea className={inputCls} rows={2} value={form.activation_message} onChange={e => setForm({ ...form, activation_message: e.target.value })} />
                                )}
                                {F('Mensaje de desactivación',
                                    <textarea className={inputCls} rows={2} value={form.deactivation_message} onChange={e => setForm({ ...form, deactivation_message: e.target.value })} />
                                )}
                                {F('Texto de progreso (usa ${remaining} para monto faltante)',
                                    <textarea className={inputCls} rows={2} value={form.progress_label} onChange={e => setForm({ ...form, progress_label: e.target.value })} />
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                                <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                                    Cancelar
                                </button>
                                <button onClick={save} disabled={saving || !form.name.trim()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 shadow-sm">
                                    {saving ? 'Guardando…' : editId ? 'Guardar Cambios' : 'Crear Regla'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
