import { useEffect, useRef, useState } from 'react';
import type { Coupon, CouponVisualDesign } from '../../lib/supabase';
import {
    createCoupon,
    deleteCoupon,
    getCoupons,
    updateCoupon,
} from '../../lib/supabase';
import CouponCard from '../../components/CouponCard';

// ─── Types ──────────────────────────────────────────────────────────────────

type DiscountType = 'percentage' | 'fixed_amount';
type Theme = 'spring' | 'summer' | 'autumn' | 'winter';

interface CouponForm {
    code: string;
    discount_type: DiscountType;
    discount_value: string;
    min_purchase: string;
    expiration_date: string;
    max_uses: string;
    is_active: boolean;
    visual_design: CouponVisualDesign;
}

const THEMES: { value: Theme; label: string; icon: string }[] = [
    { value: 'spring', label: 'Primavera', icon: '🌸' },
    { value: 'summer', label: 'Verano', icon: '☀️' },
    { value: 'autumn', label: 'Otoño', icon: '🍂' },
    { value: 'winter', label: 'Invierno', icon: '❄️' },
];

const EMPTY_FORM: CouponForm = {
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_purchase: '0',
    expiration_date: '',
    max_uses: '',
    is_active: true,
    visual_design: {
        backgroundColor: '#1a1a1a',
        textColor: '#D4AF37',
        theme: undefined,
    },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function CouponManager() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<CouponForm>(EMPTY_FORM);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    // ── Load coupons ──────────────────────────────────────────────────────────
    useEffect(() => {
        loadCoupons();
    }, []);

    async function loadCoupons() {
        try {
            setLoading(true);
            const data = await getCoupons();
            setCoupons(data);
        } catch {
            showToast('error', 'Error al cargar los cupones');
        } finally {
            setLoading(false);
        }
    }

    // ── Toast helper ─────────────────────────────────────────────────────────
    function showToast(type: 'success' | 'error', msg: string) {
        setToast({ type, msg });
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    }

    // ── Form helpers ─────────────────────────────────────────────────────────
    function openCreate() {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setShowForm(true);
    }

    function openEdit(coupon: Coupon) {
        setEditingId(coupon.id);
        const expDate = coupon.expiration_date
            ? new Date(coupon.expiration_date).toISOString().slice(0, 16)
            : '';
        setForm({
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: String(coupon.discount_value),
            min_purchase: String(coupon.min_purchase),
            expiration_date: expDate,
            max_uses: coupon.max_uses !== null ? String(coupon.max_uses) : '',
            is_active: coupon.is_active,
            visual_design: { ...coupon.visual_design },
        });
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
    }

    function setField<K extends keyof CouponForm>(key: K, value: CouponForm[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function setDesignField<K extends keyof CouponVisualDesign>(
        key: K,
        value: CouponVisualDesign[K]
    ) {
        setForm((prev) => ({
            ...prev,
            visual_design: { ...prev.visual_design, [key]: value },
        }));
    }

    // ── Save ─────────────────────────────────────────────────────────────────
    async function handleSave() {
        if (!form.code.trim()) return showToast('error', 'El código es obligatorio');
        if (!form.discount_value || Number(form.discount_value) <= 0)
            return showToast('error', 'El valor del descuento debe ser mayor a 0');

        try {
            setSaving(true);
            const payload = {
                code: form.code.trim().toUpperCase(),
                discount_type: form.discount_type,
                discount_value: Number(form.discount_value),
                min_purchase: Number(form.min_purchase) || 0,
                expiration_date: form.expiration_date
                    ? new Date(form.expiration_date).toISOString()
                    : null,
                max_uses: form.max_uses ? Number(form.max_uses) : null,
                is_active: form.is_active,
                visual_design: form.visual_design,
            };

            if (editingId) {
                await updateCoupon(editingId, payload);
                showToast('success', 'Cupón actualizado correctamente');
            } else {
                await createCoupon(payload);
                showToast('success', 'Cupón creado correctamente');
            }
            closeForm();
            loadCoupons();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            showToast('error', msg.includes('duplicate') ? 'Ese código ya existe' : 'Error al guardar');
        } finally {
            setSaving(false);
        }
    }

    // ── Toggle active ─────────────────────────────────────────────────────────
    async function handleToggleActive(coupon: Coupon) {
        try {
            await updateCoupon(coupon.id, { is_active: !coupon.is_active });
            setCoupons((prev) =>
                prev.map((c) =>
                    c.id === coupon.id ? { ...c, is_active: !c.is_active } : c
                )
            );
        } catch {
            showToast('error', 'Error al actualizar el estado');
        }
    }

    // ── Delete ────────────────────────────────────────────────────────────────
    async function handleDelete(coupon: Coupon) {
        if (!confirm(`¿Desactivar el cupón "${coupon.code}"?`)) return;
        try {
            await deleteCoupon(coupon.id);
            setCoupons((prev) =>
                prev.map((c) => (c.id === coupon.id ? { ...c, is_active: false } : c))
            );
            showToast('success', 'Cupón desactivado');
        } catch {
            showToast('error', 'Error al desactivar el cupón');
        }
    }

    // ── Preview data ──────────────────────────────────────────────────────────
    const previewDiscountValue = Number(form.discount_value) || 0;
    const previewCode = form.code.trim().toUpperCase() || 'CODIGO';

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="cm-root">
            {/* Toast */}
            {toast && (
                <div className={`cm-toast cm-toast--${toast.type}`}>
                    {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="cm-header">
                <div>
                    <h1 className="cm-title">Gestión de Cupones</h1>
                    <p className="cm-subtitle">{coupons.length} cupones registrados</p>
                </div>
                <button className="cm-btn-primary" onClick={openCreate}>
                    + Nuevo Cupón
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="cm-loading">Cargando cupones…</div>
            ) : coupons.length === 0 ? (
                <div className="cm-empty">
                    <span className="cm-empty-icon">🎫</span>
                    <p>No hay cupones creados.</p>
                    <button className="cm-btn-primary" onClick={openCreate}>
                        Crear primer cupón
                    </button>
                </div>
            ) : (
                <div className="cm-table-wrap">
                    <table className="cm-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descuento</th>
                                <th>Mín. compra</th>
                                <th>Vencimiento</th>
                                <th>Usos</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((c) => (
                                <tr key={c.id} className={c.is_active ? '' : 'cm-row--inactive'}>
                                    <td>
                                        <span className="cm-code">{c.code}</span>
                                        {c.visual_design?.theme && (
                                            <span className="cm-theme-badge">
                                                {THEMES.find((t) => t.value === c.visual_design.theme)?.icon}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {c.discount_type === 'percentage'
                                            ? `${c.discount_value}%`
                                            : `$${c.discount_value} MXN`}
                                    </td>
                                    <td>${c.min_purchase.toLocaleString('es-MX')} MXN</td>
                                    <td>
                                        {c.expiration_date
                                            ? new Date(c.expiration_date).toLocaleDateString('es-MX')
                                            : '—'}
                                    </td>
                                    <td>
                                        {c.usage_count}
                                        {c.max_uses !== null ? ` / ${c.max_uses}` : ''}
                                    </td>
                                    <td>
                                        <button
                                            className={`cm-toggle ${c.is_active ? 'cm-toggle--on' : 'cm-toggle--off'}`}
                                            onClick={() => handleToggleActive(c)}
                                            title={c.is_active ? 'Desactivar' : 'Activar'}
                                        >
                                            {c.is_active ? 'Activo' : 'Inactivo'}
                                        </button>
                                    </td>
                                    <td className="cm-actions">
                                        <button
                                            className="cm-btn-icon"
                                            onClick={() => openEdit(c)}
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="cm-btn-icon cm-btn-icon--danger"
                                            onClick={() => handleDelete(c)}
                                            title="Desactivar"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="cm-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeForm()}>
                    <div className="cm-modal">
                        <div className="cm-modal-header">
                            <h2>{editingId ? 'Editar Cupón' : 'Crear Cupón'}</h2>
                            <button className="cm-modal-close" onClick={closeForm}>✕</button>
                        </div>

                        <div className="cm-modal-body">
                            {/* Left column: form */}
                            <div className="cm-form-col">
                                {/* Reglas del cupón */}
                                <section className="cm-section">
                                    <h3 className="cm-section-title">📋 Reglas del Cupón</h3>

                                    <label className="cm-label">
                                        Código
                                        <input
                                            className="cm-input"
                                            placeholder="Ej. INVIERNO20"
                                            value={form.code}
                                            onChange={(e) =>
                                                setField('code', e.target.value.toUpperCase())
                                            }
                                            maxLength={30}
                                        />
                                    </label>

                                    <label className="cm-label">
                                        Tipo de descuento
                                        <div className="cm-radio-group">
                                            <label className="cm-radio">
                                                <input
                                                    type="radio"
                                                    name="discount_type"
                                                    checked={form.discount_type === 'percentage'}
                                                    onChange={() => setField('discount_type', 'percentage')}
                                                />
                                                Porcentaje (%)
                                            </label>
                                            <label className="cm-radio">
                                                <input
                                                    type="radio"
                                                    name="discount_type"
                                                    checked={form.discount_type === 'fixed_amount'}
                                                    onChange={() => setField('discount_type', 'fixed_amount')}
                                                />
                                                Monto fijo (MXN)
                                            </label>
                                        </div>
                                    </label>

                                    <div className="cm-row-2">
                                        <label className="cm-label">
                                            Valor del descuento
                                            <input
                                                className="cm-input"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder={form.discount_type === 'percentage' ? '20' : '50'}
                                                value={form.discount_value}
                                                onChange={(e) => setField('discount_value', e.target.value)}
                                            />
                                        </label>
                                        <label className="cm-label">
                                            Compra mínima (MXN)
                                            <input
                                                className="cm-input"
                                                type="number"
                                                min="0"
                                                step="1"
                                                placeholder="0"
                                                value={form.min_purchase}
                                                onChange={(e) => setField('min_purchase', e.target.value)}
                                            />
                                        </label>
                                    </div>

                                    <div className="cm-row-2">
                                        <label className="cm-label">
                                            Fecha de vencimiento
                                            <input
                                                className="cm-input"
                                                type="datetime-local"
                                                value={form.expiration_date}
                                                onChange={(e) => setField('expiration_date', e.target.value)}
                                            />
                                        </label>
                                        <label className="cm-label">
                                            Máximo de usos (vacío = ilimitado)
                                            <input
                                                className="cm-input"
                                                type="number"
                                                min="1"
                                                step="1"
                                                placeholder="∞"
                                                value={form.max_uses}
                                                onChange={(e) => setField('max_uses', e.target.value)}
                                            />
                                        </label>
                                    </div>

                                    <label className="cm-toggle-row">
                                        <span>Cupón activo</span>
                                        <button
                                            type="button"
                                            className={`cm-toggle ${form.is_active ? 'cm-toggle--on' : 'cm-toggle--off'}`}
                                            onClick={() => setField('is_active', !form.is_active)}
                                        >
                                            {form.is_active ? 'Activo' : 'Inactivo'}
                                        </button>
                                    </label>
                                </section>

                                {/* Diseño visual */}
                                <section className="cm-section">
                                    <h3 className="cm-section-title">🎨 Diseño Visual</h3>

                                    <div className="cm-row-2">
                                        <label className="cm-label">
                                            Color de fondo
                                            <div className="cm-color-row">
                                                <input
                                                    type="color"
                                                    className="cm-color-picker"
                                                    value={form.visual_design.backgroundColor}
                                                    onChange={(e) =>
                                                        setDesignField('backgroundColor', e.target.value)
                                                    }
                                                />
                                                <span className="cm-color-hex">
                                                    {form.visual_design.backgroundColor}
                                                </span>
                                            </div>
                                        </label>
                                        <label className="cm-label">
                                            Color de texto
                                            <div className="cm-color-row">
                                                <input
                                                    type="color"
                                                    className="cm-color-picker"
                                                    value={form.visual_design.textColor}
                                                    onChange={(e) =>
                                                        setDesignField('textColor', e.target.value)
                                                    }
                                                />
                                                <span className="cm-color-hex">
                                                    {form.visual_design.textColor}
                                                </span>
                                            </div>
                                        </label>
                                    </div>

                                    <label className="cm-label">
                                        Tema estacional (opcional)
                                        <div className="cm-theme-grid">
                                            <button
                                                type="button"
                                                className={`cm-theme-btn${!form.visual_design.theme ? ' cm-theme-btn--active' : ''}`}
                                                onClick={() => setDesignField('theme', undefined)}
                                            >
                                                🎫 Sin tema
                                            </button>
                                            {THEMES.map((t) => (
                                                <button
                                                    key={t.value}
                                                    type="button"
                                                    className={`cm-theme-btn${form.visual_design.theme === t.value ? ' cm-theme-btn--active' : ''}`}
                                                    onClick={() => setDesignField('theme', t.value)}
                                                >
                                                    {t.icon} {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                </section>
                            </div>

                            {/* Right column: live preview */}
                            <div className="cm-preview-col">
                                <h3 className="cm-section-title">👁️ Vista Previa</h3>
                                <p className="cm-preview-hint">
                                    Así verá el cliente la tarjeta del cupón en el carrito.
                                </p>
                                <CouponCard
                                    code={previewCode}
                                    discountType={form.discount_type}
                                    discountValue={previewDiscountValue}
                                    visualDesign={form.visual_design}
                                    isPreview
                                />
                            </div>
                        </div>

                        <div className="cm-modal-footer">
                            <button className="cm-btn-ghost" onClick={closeForm} disabled={saving}>
                                Cancelar
                            </button>
                            <button
                                className="cm-btn-primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? 'Guardando…' : editingId ? 'Actualizar' : 'Crear Cupón'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
