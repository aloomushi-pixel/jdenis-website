import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { products as localProducts } from '../../data/products';
import type { Promotion, DistributorPrice } from '../../lib/supabase';
import {
    getPromotions, createPromotion, updatePromotion, deletePromotion,
    getDistributorPrices, createDistributorPrice, updateDistributorPrice, deleteDistributorPrice,
} from '../../lib/supabase';

type Tab = 'promotions' | 'distributor';

// ─── Helpers ────────────────────────────────────────────────────
const fmt = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 0 })}`;
const dateStr = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

const emptyPromo: Omit<Promotion, 'id' | 'created_at' | 'updated_at' | 'current_uses'> = {
    name: '', description: '', discount_type: 'percentage', discount_value: 0,
    min_purchase: 0, applicable_products: [], applicable_categories: [],
    start_date: '', end_date: '', is_active: true, code: '', max_uses: null,
};

const emptyDistPrice: Omit<DistributorPrice, 'id' | 'created_at' | 'updated_at'> = {
    product_id: '', product_name: '', regular_price: 0, distributor_price: 0,
    min_quantity: 1, is_active: true,
};

// ─── Component ──────────────────────────────────────────────────
export default function PromotionsManager() {
    const [tab, setTab] = useState<Tab>('promotions');
    const [promos, setPromos] = useState<Promotion[]>([]);
    const [distPrices, setDistPrices] = useState<DistributorPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // form states
    const [showPromoForm, setShowPromoForm] = useState(false);
    const [editPromo, setEditPromo] = useState<Promotion | null>(null);
    const [promoForm, setPromoForm] = useState(emptyPromo);

    const [showDistForm, setShowDistForm] = useState(false);
    const [editDist, setEditDist] = useState<DistributorPrice | null>(null);
    const [distForm, setDistForm] = useState(emptyDistPrice);

    // ─── Fetch ──────────────────────────────────────────────────
    const load = async () => {
        setLoading(true);
        try {
            const [p, d] = await Promise.all([getPromotions(), getDistributorPrices()]);
            setPromos(p); setDistPrices(d);
        } catch (e: unknown) { setError((e as Error).message); }
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    // ─── Promo Handlers ─────────────────────────────────────────
    const openNewPromo = () => { setEditPromo(null); setPromoForm(emptyPromo); setShowPromoForm(true); };
    const openEditPromo = (p: Promotion) => {
        setEditPromo(p);
        setPromoForm({
            name: p.name, description: p.description || '', discount_type: p.discount_type,
            discount_value: p.discount_value, min_purchase: p.min_purchase,
            applicable_products: p.applicable_products, applicable_categories: p.applicable_categories,
            start_date: p.start_date?.slice(0, 16) || '', end_date: p.end_date?.slice(0, 16) || '',
            is_active: p.is_active, code: p.code || '', max_uses: p.max_uses,
        });
        setShowPromoForm(true);
    };
    const savePromo = async () => {
        try {
            const payload = {
                ...promoForm,
                code: promoForm.code || null,
                description: promoForm.description || null,
            };
            if (editPromo) {
                await updatePromotion(editPromo.id, payload);
            } else {
                await createPromotion(payload);
            }
            setShowPromoForm(false); load();
        } catch (e: unknown) { setError((e as Error).message); }
    };
    const togglePromo = async (p: Promotion) => {
        await updatePromotion(p.id, { is_active: !p.is_active }); load();
    };
    const removePromo = async (id: string) => {
        if (!confirm('¿Eliminar esta promoción?')) return;
        await deletePromotion(id); load();
    };

    // ─── Dist Price Handlers ────────────────────────────────────
    const openNewDist = () => { setEditDist(null); setDistForm(emptyDistPrice); setShowDistForm(true); };
    const openEditDist = (d: DistributorPrice) => {
        setEditDist(d);
        setDistForm({
            product_id: d.product_id, product_name: d.product_name,
            regular_price: d.regular_price, distributor_price: d.distributor_price,
            min_quantity: d.min_quantity, is_active: d.is_active,
        });
        setShowDistForm(true);
    };
    const saveDist = async () => {
        try {
            if (editDist) {
                await updateDistributorPrice(editDist.id, distForm);
            } else {
                await createDistributorPrice(distForm);
            }
            setShowDistForm(false); load();
        } catch (e: unknown) { setError((e as Error).message); }
    };
    const toggleDist = async (d: DistributorPrice) => {
        await updateDistributorPrice(d.id, { is_active: !d.is_active }); load();
    };
    const removeDist = async (id: string) => {
        if (!confirm('¿Eliminar este precio de distribuidor?')) return;
        await deleteDistributorPrice(id); load();
    };

    const selectProduct = (productId: string) => {
        const product = localProducts.find(p => p.id === productId);
        if (product) {
            setDistForm({ ...distForm, product_id: product.id, product_name: product.name, regular_price: product.price });
        }
    };

    // ─── Unique categories from local products ──────────────────
    const categories = [...new Set(localProducts.map(p => p.category))].sort();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Precios y Promociones</h1>
                    <p className="text-gray-500 text-sm mt-1">Administra promociones para clientes y precios de distribuidor</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                    <button onClick={() => setError('')} className="float-right font-bold">×</button>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {([
                    { key: 'promotions' as Tab, label: '🏷️ Promociones', count: promos.length },
                    { key: 'distributor' as Tab, label: '🤝 Precios Distribuidor', count: distPrices.length },
                ]).map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.key
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t.label}
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-200 text-xs">{t.count}</span>
                    </button>
                ))}
            </div>

            {/* ═══════════ PROMOTIONS TAB ═══════════ */}
            {tab === 'promotions' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={openNewPromo}
                            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Nueva Promoción
                        </button>
                    </div>

                    {promos.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /></svg>
                            <p className="text-gray-500">No hay promociones creadas</p>
                            <button onClick={openNewPromo} className="mt-3 text-indigo-600 hover:underline text-sm">Crear primera promoción →</button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Descuento</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Código</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Vigencia</th>
                                        <th className="text-center px-4 py-3 font-medium text-gray-600">Estado</th>
                                        <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {promos.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900">{p.name}</p>
                                                {p.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{p.description}</p>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                                    {p.discount_type === 'percentage' ? `${p.discount_value}%` : fmt(p.discount_value)}
                                                </span>
                                                {p.min_purchase > 0 && (
                                                    <span className="block text-xs text-gray-400 mt-0.5">Min. {fmt(p.min_purchase)}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {p.code ? (
                                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{p.code}</span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-600">
                                                {dateStr(p.start_date)} — {dateStr(p.end_date)}
                                                {p.max_uses && (
                                                    <span className="block text-gray-400">{p.current_uses}/{p.max_uses} usos</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button onClick={() => togglePromo(p)}>
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${p.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                        }`}>
                                                        {p.is_active ? 'Activa' : 'Inactiva'}
                                                    </span>
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                <button onClick={() => openEditPromo(p)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Editar</button>
                                                <button onClick={() => removePromo(p.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            )}

            {/* ═══════════ DISTRIBUTOR TAB ═══════════ */}
            {tab === 'distributor' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={openNewDist}
                            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            Agregar Precio Distribuidor
                        </button>
                    </div>

                    {distPrices.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-gray-500">No hay precios de distribuidor configurados</p>
                            <button onClick={openNewDist} className="mt-3 text-indigo-600 hover:underline text-sm">Configurar primer precio →</button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Producto</th>
                                        <th className="text-right px-4 py-3 font-medium text-gray-600">Precio Público</th>
                                        <th className="text-right px-4 py-3 font-medium text-gray-600">Precio Distribuidor</th>
                                        <th className="text-right px-4 py-3 font-medium text-gray-600">Ahorro</th>
                                        <th className="text-center px-4 py-3 font-medium text-gray-600">Qty Mín</th>
                                        <th className="text-center px-4 py-3 font-medium text-gray-600">Estado</th>
                                        <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {distPrices.map(d => {
                                        const savings = d.regular_price - d.distributor_price;
                                        const pct = d.regular_price > 0 ? Math.round((savings / d.regular_price) * 100) : 0;
                                        return (
                                            <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-900">{d.product_name}</td>
                                                <td className="px-4 py-3 text-right text-gray-600">{fmt(d.regular_price)}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="font-semibold text-green-700">{fmt(d.distributor_price)}</span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                                                        -{pct}% ({fmt(savings)})
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center text-gray-600">{d.min_quantity}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <button onClick={() => toggleDist(d)}>
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${d.is_active
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-500'
                                                            }`}>
                                                            {d.is_active ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 text-right space-x-2">
                                                    <button onClick={() => openEditDist(d)} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">Editar</button>
                                                    <button onClick={() => removeDist(d.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Eliminar</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            )}

            {/* ═══════════ PROMO MODAL ═══════════ */}
            <AnimatePresence>
                {showPromoForm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPromoForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                {editPromo ? 'Editar Promoción' : 'Nueva Promoción'}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                    <input type="text" value={promoForm.name}
                                        onChange={e => setPromoForm({ ...promoForm, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ej: Descuento de Primavera" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                    <textarea value={promoForm.description || ''}
                                        onChange={e => setPromoForm({ ...promoForm, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        rows={2} placeholder="Descripción opcional..." />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Descuento</label>
                                        <select value={promoForm.discount_type}
                                            onChange={e => setPromoForm({ ...promoForm, discount_type: e.target.value as 'percentage' | 'fixed_amount' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                            <option value="percentage">Porcentaje (%)</option>
                                            <option value="fixed_amount">Monto Fijo ($)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Valor {promoForm.discount_type === 'percentage' ? '(%)' : '($)'}
                                        </label>
                                        <input type="number" min={0} value={promoForm.discount_value}
                                            onChange={e => setPromoForm({ ...promoForm, discount_value: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Código Promo</label>
                                        <input type="text" value={promoForm.code || ''}
                                            onChange={e => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Ej: SPRING2026" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Compra Mínima ($)</label>
                                        <input type="number" min={0} value={promoForm.min_purchase}
                                            onChange={e => setPromoForm({ ...promoForm, min_purchase: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Inicio *</label>
                                        <input type="datetime-local" value={promoForm.start_date}
                                            onChange={e => setPromoForm({ ...promoForm, start_date: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fin *</label>
                                        <input type="datetime-local" value={promoForm.end_date}
                                            onChange={e => setPromoForm({ ...promoForm, end_date: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de Usos</label>
                                    <input type="number" min={0} value={promoForm.max_uses ?? ''}
                                        onChange={e => setPromoForm({ ...promoForm, max_uses: e.target.value ? Number(e.target.value) : null })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Vacío = ilimitado" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categorías Aplicables</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {categories.map(cat => (
                                            <button key={cat} type="button"
                                                onClick={() => {
                                                    const cats = promoForm.applicable_categories.includes(cat)
                                                        ? promoForm.applicable_categories.filter(c => c !== cat)
                                                        : [...promoForm.applicable_categories, cat];
                                                    setPromoForm({ ...promoForm, applicable_categories: cats });
                                                }}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${promoForm.applicable_categories.includes(cat)
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Vacío = aplica a todas las categorías</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input type="checkbox" id="promo-active" checked={promoForm.is_active}
                                        onChange={e => setPromoForm({ ...promoForm, is_active: e.target.checked })}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                    <label htmlFor="promo-active" className="text-sm text-gray-700">Activar inmediatamente</label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button onClick={() => setShowPromoForm(false)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
                                <button onClick={savePromo}
                                    disabled={!promoForm.name || !promoForm.start_date || !promoForm.end_date || promoForm.discount_value <= 0}
                                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {editPromo ? 'Guardar Cambios' : 'Crear Promoción'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════ DISTRIBUTOR MODAL ═══════════ */}
            <AnimatePresence>
                {showDistForm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowDistForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                {editDist ? 'Editar Precio Distribuidor' : 'Nuevo Precio Distribuidor'}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Producto *</label>
                                    <select value={distForm.product_id}
                                        onChange={e => selectProduct(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="">Seleccionar producto...</option>
                                        {localProducts.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>
                                        ))}
                                    </select>
                                </div>

                                {distForm.product_id && (
                                    <>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-600">Precio Público: <span className="font-semibold text-gray-900">{fmt(distForm.regular_price)}</span></p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Distribuidor ($) *</label>
                                            <input type="number" min={0} value={distForm.distributor_price}
                                                onChange={e => setDistForm({ ...distForm, distributor_price: Number(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                            {distForm.distributor_price > 0 && distForm.regular_price > 0 && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    Ahorro: {Math.round(((distForm.regular_price - distForm.distributor_price) / distForm.regular_price) * 100)}%
                                                    ({fmt(distForm.regular_price - distForm.distributor_price)} de descuento)
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Mínima</label>
                                            <input type="number" min={1} value={distForm.min_quantity}
                                                onChange={e => setDistForm({ ...distForm, min_quantity: Number(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" id="dist-active" checked={distForm.is_active}
                                                onChange={e => setDistForm({ ...distForm, is_active: e.target.checked })}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                            <label htmlFor="dist-active" className="text-sm text-gray-700">Activo</label>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button onClick={() => setShowDistForm(false)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
                                <button onClick={saveDist}
                                    disabled={!distForm.product_id || distForm.distributor_price <= 0}
                                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {editDist ? 'Guardar Cambios' : 'Agregar Precio'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
