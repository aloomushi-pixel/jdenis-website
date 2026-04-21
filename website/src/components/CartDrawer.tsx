import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CouponCard from './CouponCard';
import { useCartPromotion } from '../hooks/useCartPromotion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import CartPromoBanner from './CartPromoBanner';
import { validateCoupon } from '../lib/supabase';

// ─── Coupon state ─────────────────────────────────────────────────────────────

export default function CartDrawer() {
    const { isOpen, closeCart, items, removeItem, updateQuantity, appliedCoupon, applyCoupon, removeCoupon } = useCartStore();
    const userRole = useAuthStore((s) => s.user?.role);
    const promotion = useCartPromotion();

    const [couponInput, setCouponInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState<string | null>(null);

    // ── Check if applied coupon is still valid (e.g. min purchase) ──────
    const isCouponValid = appliedCoupon && promotion.subtotal >= appliedCoupon.min_purchase;
    
    // ── Coupon discount amount (0 if none applied or invalid)
    const rawCouponDiscount = appliedCoupon
        ? (appliedCoupon.discount_type === 'percentage'
            ? Math.round((promotion.subtotal * appliedCoupon.discount_value) / 100 * 100) / 100
            : Math.min(appliedCoupon.discount_value, promotion.subtotal))
        : 0;
    
    const couponDiscount = isCouponValid ? rawCouponDiscount : 0;

    // ── Adjusted grand total
    const adjustedTotal = Math.max(0, promotion.grandTotal - couponDiscount);

    // ── Apply coupon handler ───────────────────────────────────────────────────
    async function handleApplyCoupon() {
        const code = couponInput.trim();
        if (!code) return;
        setCouponLoading(true);
        setCouponError(null);

        const result = await validateCoupon(code, promotion.subtotal);

        if (result.valid) {
            applyCoupon(result.coupon);
            setCouponInput('');
        } else {
            setCouponError(result.error);
        }
        setCouponLoading(false);
    }

    function handleRemoveCoupon() {
        removeCoupon();
        setCouponInput('');
        setCouponError(null);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') handleApplyCoupon();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-mauve/30 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-botanical-lg z-50 flex flex-col border-l border-kraft/30"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-rose/20">
                            <h2 className="font-serif text-xl text-mauve">Tu Carrito</h2>
                            <button
                                onClick={closeCart}
                                aria-label="Cerrar carrito"
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-rose/20 transition-colors text-mauve"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-6xl mb-4">🛍️</p>
                                    <p className="text-ink/60">Tu carrito está vacío</p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4 py-5 border-b border-kraft/30 last:border-0 relative">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-sm bg-cream shadow-sm"
                                            />
                                            <div className="flex-1 flex flex-col justify-between">
                                                <h3 className="font-medium text-mauve">{item.name}</h3>
                                                {(() => {
                                                    const isDistributor = userRole === 'DISTRIBUIDOR';
                                                    const activePrice = isDistributor && item.distributorPrice ? item.distributorPrice : item.price;
                                                    return (
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-rose-deep font-semibold">${activePrice}</p>
                                                            {isDistributor && (
                                                                <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium uppercase tracking-wide">
                                                                    Precio Distribuidor
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                                <div className="flex items-center gap-3 mt-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        aria-label="Reducir cantidad"
                                                        className="w-8 h-8 rounded-full bg-white text-mauve hover:bg-rose/20 flex items-center justify-center transition-colors shadow-sm"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="text-ink font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        aria-label="Aumentar cantidad"
                                                        className="w-8 h-8 rounded-full bg-white text-mauve hover:bg-rose/20 flex items-center justify-center transition-colors shadow-sm"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                aria-label={`Eliminar ${item.name} del carrito`}
                                                className="text-charcoal/40 hover:text-red-600 transition-colors absolute top-5 right-0 p-1"
                                                title="Eliminar producto"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Promotion Banner */}
                        {items.length > 0 && userRole !== 'DISTRIBUIDOR' && (
                            <div className="px-6">
                                <CartPromoBanner promotion={promotion} />
                            </div>
                        )}

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-rose/20 bg-blush/50 rounded-bl-4xl">

                                {/* ── Cupón section ───────────────────────────────── */}
                                {userRole !== 'DISTRIBUIDOR' && (
                                    <div className="mb-4">
                                        {isCouponValid && appliedCoupon ? (
                                            /* Applied coupon card */
                                            <CouponCard
                                                code={appliedCoupon.code}
                                                discountType={appliedCoupon.discount_type}
                                                discountValue={appliedCoupon.discount_value}
                                                visualDesign={appliedCoupon.visual_design}
                                                onRemove={handleRemoveCoupon}
                                            />
                                        ) : (
                                            /* Coupon input */
                                            <div className="coupon-input-wrap">
                                                {appliedCoupon && !isCouponValid && (
                                                    <p className="coupon-error text-sm mb-2" role="alert">
                                                        ⚠ El cupón {appliedCoupon.code} requiere un mínimo de compra de ${appliedCoupon.min_purchase.toLocaleString('es-MX')} MXN.
                                                    </p>
                                                )}
                                                <p className="coupon-input-label">¿Tienes un código de descuento?</p>
                                                <div className="coupon-input-row">
                                                    <input
                                                        type="text"
                                                        className="coupon-input"
                                                        placeholder="Ej. INVIERNO20"
                                                        value={couponInput}
                                                        onChange={(e) => {
                                                            setCouponInput(e.target.value.toUpperCase());
                                                            if (couponError) setCouponError(null);
                                                        }}
                                                        onKeyDown={handleKeyDown}
                                                        maxLength={30}
                                                        disabled={couponLoading}
                                                        aria-label="Código de descuento"
                                                    />
                                                    <button
                                                        className="coupon-apply-btn"
                                                        onClick={handleApplyCoupon}
                                                        disabled={!couponInput.trim() || couponLoading}
                                                    >
                                                        {couponLoading ? '…' : 'Aplicar'}
                                                    </button>
                                                </div>
                                                {couponError && (
                                                    <p className="coupon-error" role="alert">
                                                        ⚠ {couponError}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* ── End cupón section ─────────────────────────── */}

                                <div className="space-y-2 mb-4">
                                    {/* Subtotal */}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-ink/70">Subtotal</span>
                                        <span className="text-ink">${promotion.subtotal.toLocaleString()} MXN</span>
                                    </div>

                                    {/* Descuento promo (si aplica) */}
                                    {userRole !== 'DISTRIBUIDOR' && promotion.discountAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-emerald-600 font-medium">Descuento ({promotion.discountPercent}%)</span>
                                            <span className="text-emerald-600 font-medium">-${promotion.discountAmount.toLocaleString()} MXN</span>
                                        </div>
                                    )}

                                    {/* Descuento cupón */}
                                    {isCouponValid && appliedCoupon && (
                                        <div className="flex justify-between text-sm">
                                            <span className="coupon-discount-label">
                                                Cupón {appliedCoupon.code}
                                                {appliedCoupon.discount_type === 'percentage'
                                                    ? ` (${appliedCoupon.discount_value}%)`
                                                    : ''}
                                            </span>
                                            <span className="coupon-discount-value">
                                                -${couponDiscount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                            </span>
                                        </div>
                                    )}

                                    {/* Envío */}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-ink/70">Envío</span>
                                        {promotion.isFreeShipping ? (
                                            <span className="font-medium">
                                                <span className="text-emerald-600">GRATIS</span>{' '}
                                                <span className="line-through text-ink/40 text-xs">$200 MXN</span>
                                            </span>
                                        ) : (
                                            <span className="text-ink">${promotion.shippingCost} MXN</span>
                                        )}
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between pt-2 border-t border-rose/20 mb-4">
                                    <span className="text-ink font-semibold">Total</span>
                                    <span className="text-rose-deep font-bold text-xl">
                                        ${adjustedTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                    </span>
                                </div>

                                <Link
                                    to="/checkout"
                                    onClick={closeCart}
                                    className="btn btn-primary w-full"
                                >
                                    Proceder al Pago
                                </Link>
                                <button
                                    onClick={closeCart}
                                    className="btn btn-ghost w-full"
                                >
                                    Continuar Comprando
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
