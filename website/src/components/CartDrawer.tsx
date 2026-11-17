import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CouponCard from './CouponCard';
import { useCartPromotion } from '../hooks/useCartPromotion';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import CartPromoBanner from './CartPromoBanner';
import { validateCoupon } from '../lib/supabase';

export default function CartDrawer() {
    const { isOpen, closeCart, items, addItem, removeItem, updateQuantity, appliedCoupon, applyCoupon, removeCoupon } = useCartStore();
    const userRole = useAuthStore((s) => s.user?.role);
    const favoriteIds = useWishlistStore((s) => s.favoriteIds);
    const { products } = useProducts();
    const promotion = useCartPromotion();

    const [couponInput, setCouponInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState<string | null>(null);

    const isCouponValid = appliedCoupon && promotion.subtotal >= appliedCoupon.min_purchase;

    const rawCouponDiscount = appliedCoupon
        ? (appliedCoupon.discount_type === 'percentage'
            ? Math.round((promotion.subtotal * appliedCoupon.discount_value) / 100 * 100) / 100
            : Math.min(appliedCoupon.discount_value, promotion.subtotal))
        : 0;

    const couponDiscount = isCouponValid ? rawCouponDiscount : 0;
    const adjustedTotal = Math.max(0, promotion.grandTotal - couponDiscount);

    const totalSavings = useMemo(() => {
        const promoSave = userRole !== 'DISTRIBUIDOR' ? promotion.discountAmount : 0;
        const shipSave = promotion.isFreeShipping ? 200 : 0;
        return promoSave + couponDiscount + shipSave;
    }, [promotion.discountAmount, promotion.isFreeShipping, couponDiscount, userRole]);

    // Smart suggestions: Favorites / Featured when empty, Complementary essentials when cart has items
    const emptyStateSuggestions = useMemo(() => {
        const eligible = products.filter(p => !p.hasVariants && (p.stock ?? 0) > 0 && p.price > 0 && p.image);
        if (favoriteIds.length > 0) {
            const favProducts = eligible.filter(p => favoriteIds.includes(String(p.id)));
            if (favProducts.length > 0) return { title: '❤️ Tus Favoritos Guardados', list: favProducts.slice(0, 3) };
        }
        const featured = eligible.filter(p => p.isFeatured);
        return {
            title: '✨ Favoritos de Profesionales',
            list: (featured.length > 0 ? featured : eligible).slice(0, 3),
        };
    }, [products, favoriteIds]);

    const crossSellItems = useMemo(() => {
        if (items.length === 0) return [];
        const inCartIds = new Set(items.map(i => String(i.id).split('-v')[0]));
        const eligible = products.filter(
            p => !p.hasVariants && (p.stock ?? 0) > 0 && p.price > 0 && p.image && !inCartIds.has(String(p.id))
        );
        // Prioritize cabin consumables / accessories / hygiene essentials <= $550 MXN for impulse add-on
        const essentials = eligible.filter(p => p.price <= 550 && /accesorios|adhesivos|higiene|tratamientos|cejas/i.test(p.category));
        const pool = essentials.length >= 2 ? essentials : eligible;
        return pool.slice(0, 2);
    }, [products, items]);

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

    const totalQty = items.reduce((acc, i) => acc + i.quantity, 0);

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
                        className="fixed inset-0 bg-mauve/30 backdrop-blur-sm z-[70]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-botanical-lg z-[80] flex flex-col border-l border-kraft/30"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-rose/20">
                            <div className="flex items-center gap-2.5">
                                <h2 className="font-serif text-xl text-mauve">Tu Carrito</h2>
                                {totalQty > 0 && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-gold/15 text-forest text-xs font-bold">
                                        {totalQty} {totalQty === 1 ? 'artículo' : 'artículos'}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={closeCart}
                                aria-label="Cerrar carrito"
                                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-rose/20 transition-colors text-mauve"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Items & Cross-Sell */}
                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {items.length === 0 ? (
                                <div className="py-6">
                                    <div className="text-center mb-6">
                                        <p className="text-5xl mb-3">🛍️</p>
                                        <p className="font-serif text-lg text-forest mb-1">Tu carrito está listo para ti</p>
                                        <p className="text-xs text-ink/60 mb-5">
                                            Envío asegurado GRATIS en pedidos mayores a $2,000 MXN
                                        </p>
                                        <Link
                                            to="/tienda"
                                            onClick={closeCart}
                                            className="btn btn-primary w-full"
                                        >
                                            Explorar Tienda Oficial
                                        </Link>
                                    </div>

                                    {emptyStateSuggestions.list.length > 0 && (
                                        <div className="mt-6 pt-5 border-t border-kraft/25">
                                            <p className="text-xs font-bold uppercase tracking-wider text-forest mb-3">
                                                {emptyStateSuggestions.title}
                                            </p>
                                            <div className="space-y-2.5">
                                                {emptyStateSuggestions.list.map((prod) => (
                                                    <div key={prod.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-cream/60 border border-kraft/20">
                                                        <Link to={`/producto/${prod.slug || prod.id}`} onClick={closeCart} className="shrink-0">
                                                            <img src={prod.image} alt={prod.name} className="w-14 h-14 rounded-lg object-cover bg-white" loading="lazy" />
                                                        </Link>
                                                        <div className="flex-1 min-w-0">
                                                            <Link to={`/producto/${prod.slug || prod.id}`} onClick={closeCart} className="text-xs font-semibold text-charcoal line-clamp-2 hover:text-forest">
                                                                {prod.name}
                                                            </Link>
                                                            <p className="text-xs font-bold text-forest mt-0.5">
                                                                ${prod.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => addItem(prod)}
                                                            className="min-h-[44px] px-3 rounded-lg bg-forest text-white text-xs font-semibold hover:bg-forest-light transition-colors shrink-0"
                                                        >
                                                            + Agregar
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-4 py-4 border-b border-kraft/25 last:border-0 relative pr-9">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    onError={(e) => {
                                                        if (!e.currentTarget.src.endsWith('/placeholder.webp')) {
                                                            e.currentTarget.src = '/placeholder.webp';
                                                        }
                                                    }}
                                                    className="w-20 h-20 object-cover rounded-lg bg-cream shadow-sm shrink-0"
                                                />
                                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                    <h3 className="font-medium text-sm text-mauve line-clamp-2">{item.name}</h3>
                                                    {(() => {
                                                        const isDistributor = userRole === 'DISTRIBUIDOR';
                                                        const activePrice = isDistributor && item.distributorPrice ? item.distributorPrice : item.price;
                                                        return (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <p className="text-rose-deep font-semibold text-sm">
                                                                    ${Number(activePrice || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                                </p>
                                                                {isDistributor && (
                                                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium uppercase tracking-wide">
                                                                        Distribuidor
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                    <div className="flex items-center gap-2 mt-2" data-qty-stepper="true">
                                                        <button
                                                            type="button"
                                                            data-qty-stepper="true"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            aria-label="Reducir cantidad"
                                                            className="w-11 h-11 rounded-full bg-white border border-rose/25 text-mauve hover:bg-rose/20 active:scale-95 flex items-center justify-center transition-all shadow-sm text-lg font-medium"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="min-w-[28px] text-center text-ink font-semibold text-sm">{item.quantity}</span>
                                                        <button
                                                            type="button"
                                                            data-qty-stepper="true"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            aria-label="Aumentar cantidad"
                                                            className="w-11 h-11 rounded-full bg-white border border-rose/25 text-mauve hover:bg-rose/20 active:scale-95 flex items-center justify-center transition-all shadow-sm text-lg font-medium"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    aria-label={`Eliminar ${item.name} del carrito`}
                                                    className="w-11 h-11 flex items-center justify-center text-charcoal/40 hover:text-red-600 transition-colors absolute top-2 right-0 rounded-full hover:bg-red-50"
                                                    title="Eliminar producto"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Smart 1-Click Cross-Sell */}
                                    {crossSellItems.length > 0 && (
                                        <div className="mt-5 pt-4 border-t border-kraft/25">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-forest mb-2.5">
                                                ✨ Completa tu Kit de Cabina
                                            </p>
                                            <div className="space-y-2">
                                                {crossSellItems.map((rec) => (
                                                    <div key={rec.id} className="flex items-center gap-3 p-2 rounded-xl bg-cream/60 border border-kraft/20">
                                                        <Link to={`/producto/${rec.slug || rec.id}`} onClick={closeCart} className="shrink-0">
                                                            <img src={rec.image} alt={rec.name} className="w-12 h-12 rounded-lg object-cover bg-white" loading="lazy" />
                                                        </Link>
                                                        <div className="flex-1 min-w-0">
                                                            <Link to={`/producto/${rec.slug || rec.id}`} onClick={closeCart} className="text-xs font-medium text-charcoal line-clamp-1 hover:text-forest">
                                                                {rec.name}
                                                            </Link>
                                                            <p className="text-xs font-bold text-forest">
                                                                ${rec.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => addItem(rec)}
                                                            className="min-h-[44px] px-3 rounded-lg bg-forest/90 text-white text-xs font-semibold hover:bg-forest transition-colors shrink-0"
                                                        >
                                                            + Sumar
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
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
                            <div className="px-6 py-5 border-t border-rose/20 bg-blush/50 rounded-bl-4xl">
                                {/* ── Cupón section ───────────────────────────────── */}
                                {userRole !== 'DISTRIBUIDOR' && (
                                    <div className="mb-3">
                                        {isCouponValid && appliedCoupon ? (
                                            <CouponCard
                                                code={appliedCoupon.code}
                                                discountType={appliedCoupon.discount_type}
                                                discountValue={appliedCoupon.discount_value}
                                                visualDesign={appliedCoupon.visual_design}
                                                onRemove={handleRemoveCoupon}
                                            />
                                        ) : (
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

                                <div className="space-y-1.5 mb-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-ink/70">Subtotal</span>
                                        <span className="text-ink">${promotion.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                                    </div>

                                    {userRole !== 'DISTRIBUIDOR' && promotion.discountAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-emerald-600 font-medium">Descuento ({promotion.discountPercent}%)</span>
                                            <span className="text-emerald-600 font-medium">-${promotion.discountAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                                        </div>
                                    )}

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

                                    <div className="flex justify-between text-sm">
                                        <span className="text-ink/70">Envío Asegurado FedEx</span>
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

                                {totalSavings > 0 && (
                                    <div className="mb-3 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-semibold text-center">
                                        ✨ Estás ahorrando ${totalSavings.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN en este pedido
                                    </div>
                                )}

                                {/* Total */}
                                <div className="flex justify-between pt-2 border-t border-rose/20 mb-3">
                                    <span className="text-ink font-semibold">Total (IVA inc.)</span>
                                    <span className="text-rose-deep font-bold text-xl">
                                        ${adjustedTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                    </span>
                                </div>

                                <Link
                                    to="/checkout"
                                    onClick={closeCart}
                                    className="btn btn-primary w-full min-h-[48px]"
                                >
                                    🔒 Finalizar Compra Segura
                                </Link>

                                <p className="text-[11px] text-center text-charcoal/55 mt-2.5 flex items-center justify-center gap-1.5 flex-wrap">
                                    <span>Mercado Pago</span>
                                    <span>·</span>
                                    <span>Visa / Mastercard</span>
                                    <span>·</span>
                                    <span>SPEI</span>
                                    <span>·</span>
                                    <span>OXXO</span>
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
