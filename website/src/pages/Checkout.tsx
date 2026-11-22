import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useCartPromotion } from '../hooks/useCartPromotion';
import CartPromoBanner from '../components/CartPromoBanner';
import CouponCard from '../components/CouponCard';
import { createMercadoPagoCheckout, markCartConverted, upsertAbandonedCart, validateCoupon } from '../lib/supabase';
import { trackEvent } from '../utils/telemetry';

const ESTADOS_MEXICO = [
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Chiapas',
    'Chihuahua',
    'Ciudad de México',
    'Coahuila',
    'Colima',
    'Durango',
    'Estado de México',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'Michoacán',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas',
];

function inferStateFromMexicanZip(zip: string): { state: string; defaultCity?: string } | null {
    if (!/^\d{5}$/.test(zip)) return null;
    const prefix = Number(zip.slice(0, 2));
    if (prefix >= 1 && prefix <= 16) return { state: 'Ciudad de México', defaultCity: 'Ciudad de México' };
    if (prefix === 20) return { state: 'Aguascalientes', defaultCity: 'Aguascalientes' };
    if (prefix >= 21 && prefix <= 22) return { state: 'Baja California' };
    if (prefix === 23) return { state: 'Baja California Sur' };
    if (prefix === 24) return { state: 'Campeche' };
    if (prefix >= 25 && prefix <= 27) return { state: 'Coahuila' };
    if (prefix === 28) return { state: 'Colima' };
    if (prefix >= 29 && prefix <= 30) return { state: 'Chiapas' };
    if (prefix >= 31 && prefix <= 33) return { state: 'Chihuahua' };
    if (prefix >= 34 && prefix <= 35) return { state: 'Durango' };
    if (prefix >= 36 && prefix <= 38) return { state: 'Guanajuato' };
    if (prefix >= 39 && prefix <= 41) return { state: 'Guerrero' };
    if (prefix >= 42 && prefix <= 43) return { state: 'Hidalgo' };
    if (prefix >= 44 && prefix <= 49) return { state: 'Jalisco' };
    if (prefix >= 50 && prefix <= 57) return { state: 'Estado de México' };
    if (prefix >= 58 && prefix <= 61) return { state: 'Michoacán' };
    if (prefix === 62) return { state: 'Morelos' };
    if (prefix === 63) return { state: 'Nayarit' };
    if (prefix >= 64 && prefix <= 67) return { state: 'Nuevo León' };
    if (prefix >= 68 && prefix <= 71) return { state: 'Oaxaca' };
    if (prefix >= 72 && prefix <= 75) return { state: 'Puebla' };
    if (prefix === 76) return { state: 'Querétaro', defaultCity: 'Querétaro' };
    if (prefix === 77) return { state: 'Quintana Roo' };
    if (prefix >= 78 && prefix <= 79) return { state: 'San Luis Potosí' };
    if (prefix >= 80 && prefix <= 82) return { state: 'Sinaloa' };
    if (prefix >= 83 && prefix <= 85) return { state: 'Sonora' };
    if (prefix === 86) return { state: 'Tabasco' };
    if (prefix >= 87 && prefix <= 89) return { state: 'Tamaulipas' };
    if (prefix === 90) return { state: 'Tlaxcala' };
    if (prefix >= 91 && prefix <= 96) return { state: 'Veracruz' };
    if (prefix === 97) return { state: 'Yucatán' };
    if (prefix >= 98 && prefix <= 99) return { state: 'Zacatecas' };
    return null;
}

export default function Checkout() {
    const navigate = useNavigate();
    const { items, updateQuantity, removeItem, appliedCoupon, applyCoupon, removeCoupon } = useCartStore();
    const { user } = useAuthStore();
    const promotion = useCartPromotion();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'transferencia' | 'efectivo'>('mercadopago');
    const [couponInput, setCouponInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
    const [showNotesField, setShowNotesField] = useState(false);
    const trackedStartRef = useRef(false);
    const trackedStepsRef = useRef<Set<string>>(new Set());

    const isDistributor = user?.role === 'DISTRIBUIDOR';
    const isCouponValid = appliedCoupon && promotion.subtotal >= appliedCoupon.min_purchase;

    const rawCouponDiscount = appliedCoupon
        ? (appliedCoupon.discount_type === 'percentage'
            ? Math.round((promotion.subtotal * appliedCoupon.discount_value) / 100 * 100) / 100
            : Math.min(appliedCoupon.discount_value, promotion.subtotal))
        : 0;

    const couponDiscount = isCouponValid ? rawCouponDiscount : 0;

    const subtotal = promotion.subtotal;
    const shippingCost = promotion.shippingCost;
    const promoDiscountAmount = promotion.discountAmount;
    const totalDiscountAmount = promoDiscountAmount + couponDiscount;
    const finalTotal = Math.max(0, promotion.grandTotal - couponDiscount);

    const [formData, setFormData] = useState(() => {
        try {
            const saved = typeof window !== 'undefined' ? sessionStorage.getItem('jdenis_checkout_form') : null;
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    fullName: user?.fullName || parsed.fullName || '',
                    email: user?.email || parsed.email || '',
                    phone: parsed.phone || '',
                    address: parsed.address || '',
                    references: parsed.references || '',
                    city: parsed.city || '',
                    state: parsed.state || '',
                    zip: parsed.zip || '',
                    notes: parsed.notes || '',
                };
            }
        } catch {
            // ignore
        }
        return {
            fullName: user?.fullName || '',
            email: user?.email || '',
            phone: '',
            address: '',
            references: '',
            city: '',
            state: '',
            zip: '',
            notes: '',
        };
    });

    useEffect(() => {
        try {
            sessionStorage.setItem('jdenis_checkout_form', JSON.stringify(formData));
        } catch {
            // ignore
        }
    }, [formData]);

    const handleApplyCheckoutCoupon = async () => {
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
    };

    // Track checkout_start once
    useEffect(() => {
        if (items.length > 0 && !trackedStartRef.current) {
            trackedStartRef.current = true;
            trackEvent('checkout_start', 'ecommerce', {
                items_count: promotion.itemCount,
                subtotal,
                final_total: finalTotal,
                free_shipping: promotion.isFreeShipping,
            });
        }
    }, [items.length, promotion.itemCount, subtotal, finalTotal, promotion.isFreeShipping]);

    // Track checkout_step progression
    useEffect(() => {
        if (formData.fullName && formData.email.includes('@') && formData.phone.length >= 8) {
            if (!trackedStepsRef.current.has('contact_info')) {
                trackedStepsRef.current.add('contact_info');
                trackEvent('checkout_step', 'ecommerce', {
                    step: 1,
                    step_name: 'contact_info_completed',
                });
            }
        }
        if (formData.address && formData.city && formData.state && formData.zip.length >= 4) {
            if (!trackedStepsRef.current.has('shipping_address')) {
                trackedStepsRef.current.add('shipping_address');
                trackEvent('checkout_step', 'ecommerce', {
                    step: 2,
                    step_name: 'shipping_address_completed',
                    state: formData.state,
                });
            }
        }
    }, [formData]);

    // Guardado y actualización automática del carrito (para recuperar)
    useEffect(() => {
        if (!formData.email || !formData.email.includes('@') || items.length === 0 || loading) return;

        const timeoutId = setTimeout(() => {
            upsertAbandonedCart(
                formData.email.trim().toLowerCase(),
                formData.fullName || formData.email.split('@')[0],
                items
            ).catch(console.error);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [formData.email, formData.fullName, items, loading]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'zip') {
            const cleanZip = value.replace(/\D/g, '').slice(0, 5);
            const inferred = inferStateFromMexicanZip(cleanZip);
            setFormData((prev) => ({
                ...prev,
                zip: cleanZip,
                state: inferred ? inferred.state : prev.state,
                city: !prev.city && inferred?.defaultCity ? inferred.defaultCity : prev.city,
            }));
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        trackEvent('payment_attempt', 'ecommerce', {
            items_count: promotion.itemCount,
            subtotal,
            shipping_cost: shippingCost,
            discount: totalDiscountAmount,
            final_total: finalTotal,
            coupon_code: isCouponValid && appliedCoupon ? appliedCoupon.code : null,
            provider: paymentMethod,
        });

        try {
            const checkoutData = {
                items: items.map(item => {
                    const activePrice = isDistributor && item.distributorPrice ? item.distributorPrice : item.price;
                    return {
                        id: item.id,
                        name: item.name,
                        price: activePrice,
                        quantity: item.quantity,
                        image: item.image,
                    };
                }),
                buyer: {
                    userId: user?.id,
                    fullName: formData.fullName.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                },
                shipping: {
                    address: formData.address.trim(),
                    references: formData.references.trim(),
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    zip: formData.zip.trim(),
                },
                subtotal,
                total: finalTotal,
                discount: totalDiscountAmount,
                shipping_cost: shippingCost,
                coupon_code: isCouponValid && appliedCoupon ? appliedCoupon.code : null,
                notes: formData.notes.trim(),
                payment_method: paymentMethod,
            };

            const result = await createMercadoPagoCheckout(checkoutData);

            if (!result?.checkout_url || result.checkout_url === 'undefined' || result.checkout_url.endsWith('/undefined')) {
                throw new Error('No se pudo generar la ruta de confirmación del pedido. Por favor intenta nuevamente.');
            }

            await markCartConverted(formData.email.trim().toLowerCase());

            if (result.checkout_url.startsWith('/')) {
                navigate(result.checkout_url);
            } else {
                window.location.href = result.checkout_url;
            }
            return;

        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error al procesar el pago. Intenta de nuevo.';
            console.error('Error processing payment:', err);
            trackEvent('payment_error', 'ecommerce', {
                error_message: errorMsg,
                final_total: finalTotal,
                items_count: promotion.itemCount,
            });
            setError(errorMsg);
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-cream pt-24 flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="section-title mb-4">Tu carrito está vacío</h2>
                    <Link to="/tienda" className="btn btn-primary">
                        Ir a la Tienda
                    </Link>
                </div>
            </div>
        );
    }

    const inputClass =
        'w-full px-4 py-3.5 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all text-base text-navy placeholder:text-navy/40 bg-white shadow-sm';

    const renderOrderItemsList = () => (
        <div className="space-y-4">
            {items.map((item) => {
                const unitPrice = isDistributor && item.distributorPrice ? item.distributorPrice : item.price;
                return (
                    <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-charcoal/10 last:border-0 last:pb-0">
                        <img
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            loading="lazy"
                            className="w-16 h-16 rounded-lg object-cover bg-blush shadow-sm shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-navy line-clamp-2 leading-snug">
                                {item.name}
                            </p>
                            <div className="flex items-center justify-between gap-2 mt-1.5" data-qty-stepper="true">
                                <div className="inline-flex items-center border border-charcoal/15 rounded-full bg-cream/50">
                                    <button
                                        type="button"
                                        data-qty-stepper="true"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        aria-label="Reducir cantidad"
                                        className="w-8 h-8 min-w-[36px] min-h-[36px] flex items-center justify-center text-navy hover:text-gold font-semibold"
                                    >
                                        −
                                    </button>
                                    <span className="px-2 text-xs font-semibold text-navy">{item.quantity}</span>
                                    <button
                                        type="button"
                                        data-qty-stepper="true"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        aria-label="Aumentar cantidad"
                                        className="w-8 h-8 min-w-[36px] min-h-[36px] flex items-center justify-center text-navy hover:text-gold font-semibold"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-gold font-bold whitespace-nowrap">
                                    ${(unitPrice * item.quantity).toLocaleString('es-MX')}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Quitar ${item.name}`}
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center text-charcoal/35 hover:text-red-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                );
            })}
        </div>
    );

    const ctaLabel = loading
        ? 'Procesando tu pedido...'
        : paymentMethod === 'mercadopago'
        ? `Pagar $${finalTotal.toLocaleString('es-MX')} MXN →`
        : paymentMethod === 'transferencia'
        ? `Confirmar Pedido por SPEI — $${finalTotal.toLocaleString('es-MX')} MXN →`
        : `Confirmar Pedido OXXO — $${finalTotal.toLocaleString('es-MX')} MXN →`;

    return (
        <div className="min-h-screen bg-cream pt-24 sm:pt-28 pb-16">
            <div className="container-luxury max-w-6xl">
                {/* Breadcrumb sin obstrucción */}
                <nav aria-label="Migas de pan" className="text-xs uppercase tracking-wider mb-4 flex flex-wrap items-center justify-between gap-2 text-charcoal/55">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="hover:text-gold transition-colors">Inicio</Link>
                        <span className="text-charcoal/25">/</span>
                        <Link to="/tienda" className="hover:text-gold transition-colors">Tienda</Link>
                        <span className="text-charcoal/25">/</span>
                        <span className="text-forest font-semibold">Finalizar Compra</span>
                    </div>
                    <Link to="/tienda" className="text-forest hover:text-gold font-medium normal-case tracking-normal">
                        ← Seguir comprando
                    </Link>
                </nav>

                <div className="mb-6">
                    <h1 className="font-serif text-2xl sm:text-3xl text-navy font-bold">Finalizar Compra</h1>
                    <p className="text-sm text-charcoal/70 mt-1">
                        Completa tus datos en menos de un minuto para enviar tu pedido.
                    </p>
                </div>

                {/* Resumen rápido desplegable en Móvil (arriba del formulario) */}
                <div className="lg:hidden mb-6 bg-white rounded-2xl border border-charcoal/10 shadow-sm overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
                        aria-expanded={mobileSummaryOpen}
                        className="w-full min-h-[52px] px-4 py-3.5 flex items-center justify-between text-left"
                    >
                        <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                            <span>🛍️ {mobileSummaryOpen ? 'Ocultar resumen' : 'Ver resumen del pedido'} ({promotion.itemCount})</span>
                            <svg
                                className={`w-4 h-4 text-charcoal/60 transition-transform ${mobileSummaryOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <span className="text-base font-bold text-gold">
                            ${finalTotal.toLocaleString('es-MX')} MXN
                        </span>
                    </button>
                    {mobileSummaryOpen && (
                        <div className="px-4 pb-4 pt-2 border-t border-charcoal/10 bg-cream/30">
                            {renderOrderItemsList()}
                        </div>
                    )}
                </div>

                <div className="grid lg:grid-cols-12 gap-7 items-start">
                    {/* Columna Principal: Formulario Simplificado */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Paso 1: Datos de Contacto */}
                            <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-luxury border border-charcoal/5">
                                <div className="flex items-center justify-between gap-2 mb-5">
                                    <h2 className="font-serif text-lg sm:text-xl text-navy flex items-center gap-2.5">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-forest text-white text-xs font-bold">1</span>
                                        Tus Datos
                                    </h2>
                                    {!user && (
                                        <Link to="/login" className="text-xs text-gold font-semibold hover:underline">
                                            ¿Ya tienes cuenta? Inicia sesión
                                        </Link>
                                    )}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="checkout-fullName" className="block text-xs font-semibold uppercase tracking-wide text-navy/75 mb-1.5">
                                            Nombre y Apellido *
                                        </label>
                                        <input
                                            id="checkout-fullName"
                                            type="text"
                                            name="fullName"
                                            autoComplete="name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ej. María Fernanda López"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="checkout-phone" className="block text-xs font-semibold uppercase tracking-wide text-navy/75 mb-1.5">
                                            Teléfono / WhatsApp *
                                        </label>
                                        <input
                                            id="checkout-phone"
                                            type="tel"
                                            name="phone"
                                            inputMode="tel"
                                            autoComplete="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="55 1234 5678"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="checkout-email" className="block text-xs font-semibold uppercase tracking-wide text-navy/75 mb-1.5">
                                            Correo Electrónico *
                                        </label>
                                        <input
                                            id="checkout-email"
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="tucorreo@ejemplo.com"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Paso 2: Dirección de Envío (con autocompletado automático de Estado por CP) */}
                            <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-luxury border border-charcoal/5">
                                <div className="flex items-center justify-between gap-2 mb-5">
                                    <h2 className="font-serif text-lg sm:text-xl text-navy flex items-center gap-2.5">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-forest text-white text-xs font-bold">2</span>
                                        ¿A dónde enviamos tu pedido?
                                    </h2>
                                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                                        {promotion.isFreeShipping ? 'Envío GRATIS' : `Envío $${shippingCost} MXN`}
                                    </span>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="checkout-zip" className="block text-xs font-semibold uppercase tracking-wide text-navy/75 mb-1.5">
                                            Código Postal *
                                        </label>
                                        <input
                                            id="checkout-zip"
                                            type="text"
                                            name="zip"
                                            inputMode="numeric"
                                            autoComplete="postal-code"
                                            maxLength={5}
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ej. 07300"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="checkout-state" className="block text-xs font-semibold uppercase tracking-wide text-navy/75 mb-1.5">
                                            Estado *
                                        </label>
                                        <select
                                            id="checkout-state"
                                            name="state"
                                            autoComplete="address-level1"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            className={inputClass}
                                        >
                                            <option value="">Selecciona...</option>
                                            {ESTADOS_MEXICO.map((edo) => (
                                                <option key={edo} value={edo}>
                                                    {edo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="checkout-city" className="block text-xs font-semibold uppercase tracking-wide text-navy/75 mb-1.5">
                                            Ciudad / Municipio *
                                        </label>
                                        <input
                                            id="checkout-city"
                                            type="text"
                                            name="city"
                                            autoComplete="address-level2"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ciudad o alcaldía"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="checkout-address" className="block text-xs font-semibold uppercase tracking-wide text-navy/75 mb-1.5">
                                            Calle, Número y Colonia *
                                        </label>
                                        <input
                                            id="checkout-address"
                                            type="text"
                                            name="address"
                                            autoComplete="street-address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ej. Av. Montevideo 136 Int. 2, Col. Lindavista"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="checkout-references" className="block text-xs font-semibold uppercase tracking-wide text-navy/75 mb-1.5">
                                            Referencias de ubicación <span className="text-charcoal/45 font-normal normal-case">(opcional)</span>
                                        </label>
                                        <input
                                            id="checkout-references"
                                            type="text"
                                            name="references"
                                            value={formData.references}
                                            onChange={handleInputChange}
                                            placeholder="Entre qué calles está, color de fachada o punto cercano"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    {!showNotesField && !formData.notes ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowNotesField(true)}
                                            className="min-h-[38px] text-xs font-semibold text-forest hover:text-gold transition-colors"
                                        >
                                            + Agregar nota o instrucción especial de entrega (opcional)
                                        </button>
                                    ) : (
                                        <div className="mt-2">
                                            <label htmlFor="checkout-notes" className="block text-xs font-semibold uppercase tracking-wide text-navy/75 mb-1.5">
                                                Nota del pedido (opcional)
                                            </label>
                                            <textarea
                                                id="checkout-notes"
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                rows={2}
                                                placeholder="Ej. Entregar en recepción de 9am a 6pm"
                                                className={`${inputClass} resize-none`}
                                            />
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Paso 3: Método de Pago */}
                            <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-luxury border border-charcoal/5">
                                <h2 className="font-serif text-lg sm:text-xl text-navy mb-4 flex items-center gap-2.5">
                                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-forest text-white text-xs font-bold">3</span>
                                    ¿Cómo prefieres pagar?
                                </h2>

                                <div className="space-y-3">
                                    {/* Opción 1: Tarjeta / Mercado Pago */}
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('mercadopago')}
                                        className={`w-full text-left flex items-center gap-3.5 p-4 rounded-xl border-2 transition-all ${
                                            paymentMethod === 'mercadopago'
                                                ? 'border-gold bg-gold/5 shadow-sm'
                                                : 'border-charcoal/15 bg-white hover:border-gold/50'
                                        }`}
                                    >
                                        <span className="w-10 h-10 shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm border border-charcoal/10">
                                            <svg className="w-5 h-5 text-[#009EE3]" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                                            </svg>
                                        </span>
                                        <div className="flex-1">
                                            <span className="block font-bold text-navy text-sm sm:text-base">
                                                Tarjeta de Crédito / Débito o Mercado Pago
                                            </span>
                                            <p className="text-xs text-charcoal/65 mt-0.5">
                                                Visa, Mastercard, American Express o saldo Mercado Pago (acreditación inmediata)
                                            </p>
                                        </div>
                                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                            paymentMethod === 'mercadopago' ? 'border-gold bg-gold text-white' : 'border-charcoal/30'
                                        }`}>
                                            {paymentMethod === 'mercadopago' && (
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>

                                    {/* Opción 2: SPEI */}
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('transferencia')}
                                        className={`w-full text-left flex items-center gap-3.5 p-4 rounded-xl border-2 transition-all ${
                                            paymentMethod === 'transferencia'
                                                ? 'border-gold bg-gold/5 shadow-sm'
                                                : 'border-charcoal/15 bg-white hover:border-gold/50'
                                        }`}
                                    >
                                        <span className="w-10 h-10 shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm border border-charcoal/10">
                                            <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </span>
                                        <div className="flex-1">
                                            <span className="block font-bold text-navy text-sm sm:text-base">
                                                Transferencia Bancaria (SPEI)
                                            </span>
                                            <p className="text-xs text-charcoal/65 mt-0.5">
                                                Obtén al instante los datos CLABE y tu número de folio sin comisiones
                                            </p>
                                        </div>
                                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                            paymentMethod === 'transferencia' ? 'border-gold bg-gold text-white' : 'border-charcoal/30'
                                        }`}>
                                            {paymentMethod === 'transferencia' && (
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>

                                    {/* Opción 3: Efectivo OXXO / WhatsApp */}
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('efectivo')}
                                        className={`w-full text-left flex items-center gap-3.5 p-4 rounded-xl border-2 transition-all ${
                                            paymentMethod === 'efectivo'
                                                ? 'border-gold bg-gold/5 shadow-sm'
                                                : 'border-charcoal/15 bg-white hover:border-gold/50'
                                        }`}
                                    >
                                        <span className="w-10 h-10 shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm border border-charcoal/10">
                                            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </span>
                                        <div className="flex-1">
                                            <span className="block font-bold text-navy text-sm sm:text-base">
                                                Efectivo en OXXO / Atención por WhatsApp
                                            </span>
                                            <p className="text-xs text-charcoal/65 mt-0.5">
                                                Genera tu folio y recibe tu referencia de depósito por WhatsApp y correo
                                            </p>
                                        </div>
                                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                            paymentMethod === 'efectivo' ? 'border-gold bg-gold text-white' : 'border-charcoal/30'
                                        }`}>
                                            {paymentMethod === 'efectivo' && (
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </section>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm" role="alert">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full min-h-[54px] py-4 text-base sm:text-lg font-bold shadow-md hover:shadow-lg disabled:opacity-50"
                            >
                                {ctaLabel}
                            </button>
                        </form>
                    </div>

                    {/* Columna Derecha: Resumen del Pedido */}
                    <aside className="lg:col-span-5">
                        <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-luxury border border-charcoal/5 sticky top-24">
                            <h2 className="font-serif text-xl text-navy mb-5">Resumen de tu Pedido</h2>

                            <div className="hidden lg:block mb-6 max-h-[320px] overflow-y-auto pr-1">
                                {renderOrderItemsList()}
                            </div>

                            {!isDistributor && (
                                <div className="mb-4">
                                    <CartPromoBanner promotion={promotion} />
                                </div>
                            )}

                            {!isDistributor && (
                                <div className="mb-5">
                                    {isCouponValid && appliedCoupon ? (
                                        <CouponCard
                                            code={appliedCoupon.code}
                                            discountType={appliedCoupon.discount_type}
                                            discountValue={appliedCoupon.discount_value}
                                            visualDesign={appliedCoupon.visual_design}
                                            onRemove={() => removeCoupon()}
                                        />
                                    ) : (
                                        <div className="coupon-input-wrap">
                                            <p className="coupon-input-label">¿Tienes un código promocional?</p>
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
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleApplyCheckoutCoupon();
                                                        }
                                                    }}
                                                    maxLength={30}
                                                    disabled={couponLoading}
                                                    aria-label="Código promocional"
                                                />
                                                <button
                                                    type="button"
                                                    className="coupon-apply-btn min-h-[44px]"
                                                    onClick={handleApplyCheckoutCoupon}
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

                            <div className="border-t border-charcoal/10 pt-4 space-y-3 text-sm sm:text-base">
                                <div className="flex justify-between items-center">
                                    <span className="text-charcoal-light">Subtotal</span>
                                    <span className="font-medium text-navy">${subtotal.toLocaleString('es-MX')} MXN</span>
                                </div>

                                {promoDiscountAmount > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-emerald-600 font-medium">Descuento ({promotion.discountPercent}%)</span>
                                        <span className="text-emerald-600 font-medium whitespace-nowrap">-${promoDiscountAmount.toLocaleString('es-MX')} MXN</span>
                                    </div>
                                )}

                                {isCouponValid && appliedCoupon && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-emerald-600 font-medium">
                                            Cupón {appliedCoupon.code}
                                            {appliedCoupon.discount_type === 'percentage'
                                                ? ` (${appliedCoupon.discount_value}%)`
                                                : ''}
                                        </span>
                                        <span className="text-emerald-600 font-medium whitespace-nowrap">
                                            -${couponDiscount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-charcoal-light">Envío a domicilio</span>
                                    {promotion.isFreeShipping ? (
                                        <span className="font-medium whitespace-nowrap">
                                            <span className="text-emerald-600">GRATIS</span>{' '}
                                            <span className="line-through text-charcoal-light/40 text-xs ml-1">$200</span>
                                        </span>
                                    ) : (
                                        <span className="font-medium text-navy">${shippingCost} MXN</span>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-charcoal/10 my-4 pt-4 flex justify-between items-end">
                                <span className="text-base sm:text-lg font-semibold text-navy">Total</span>
                                <div className="text-right">
                                    <span className="block text-2xl sm:text-3xl font-bold text-gold leading-none">
                                        ${finalTotal.toLocaleString('es-MX')}
                                    </span>
                                    <span className="text-xs text-charcoal-light block mt-1">MXN (IVA incluido)</span>
                                </div>
                            </div>

                            <a
                                href="https://wa.me/525527271067?text=Hola!%20Tengo%20una%20duda%20antes%20de%20finalizar%20mi%20pedido%20en%20jdenis.store"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 min-h-[44px] flex items-center justify-center gap-1.5 text-xs text-forest font-semibold hover:text-gold transition-colors"
                            >
                                💬 ¿Dudas con tu compra? Escríbenos por WhatsApp →
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
