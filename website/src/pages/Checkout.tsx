import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useCartPromotion } from '../hooks/useCartPromotion';
import CartPromoBanner from '../components/CartPromoBanner';
import { createMercadoPagoCheckout, supabase } from '../lib/supabase';

export default function Checkout() {
    const { items } = useCartStore();
    const { user } = useAuthStore();
    const promotion = useCartPromotion();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subtotal = promotion.subtotal;
    const shippingCost = promotion.shippingCost;
    const discountAmount = promotion.discountAmount;
    const grandTotal = promotion.grandTotal;

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        references: '',
        city: '',
        state: '',
        zip: '',
        notes: '',
    });

    // Guardado y actualización automática del carrito (para recuperar)
    useEffect(() => {
        if (!formData.email || !formData.email.includes('@') || items.length === 0 || loading) return;

        const syncCart = async () => {
            try {
                // Verificar si ya existe carrito "pending" de este email
                const { data } = await supabase.from('abandoned_carts')
                    .select('id')
                    .eq('email', formData.email)
                    .eq('status', 'pending')
                    .maybeSingle();

                if (data) {
                    await supabase.from('abandoned_carts').update({
                        name: formData.fullName || formData.email.split('@')[0],
                        cart_state: items,
                        last_updated: new Date().toISOString()
                    }).eq('id', data.id);
                } else {
                    await supabase.from('abandoned_carts').insert({
                        email: formData.email,
                        name: formData.fullName || formData.email.split('@')[0],
                        cart_state: items,
                        status: 'pending'
                    });
                }
            } catch (err) {
                console.error('Failed to sync abandoned cart:', err);
            }
        };

        const timeoutId = setTimeout(syncCart, 2000); // Debounce de 2 segundos
        return () => clearTimeout(timeoutId);
    }, [formData.email, formData.fullName, items, loading]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // All payments go through Mercado Pago now
            const checkoutData = {
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                })),
                buyer: {
                    userId: user?.id,
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                },
                shipping: {
                    address: formData.address,
                    references: formData.references,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                },
                total: grandTotal,
                discount: discountAmount,
                shipping_cost: shippingCost,
            };

            const result = await createMercadoPagoCheckout(checkoutData);

            // Al crear la orden exitosamente en nuestra plataforma y enviarlo a MPago, 
            // marcamos el carrito pendiente como completado para ya no recordárselo
            try {
                await supabase.from('abandoned_carts')
                    .update({ status: 'completed' })
                    .eq('email', formData.email)
                    .eq('status', 'pending');
            } catch(e) { /* silent fail logging sync issue */ }

            // Redirect to Mercado Pago checkout
            window.location.href = result.checkout_url;
            return;

        } catch (err) {
            console.error('Error processing payment:', err);
            setError(err instanceof Error ? err.message : 'Error al procesar el pago. Intenta de nuevo.');
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <h2 className="section-title mb-4">Tu carrito está vacío</h2>
                    <Link to="/tienda" className="btn btn-primary">
                        Ir a la Tienda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="container-luxury">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="section-title text-center mb-8"
                >
                    Finalizar Compra
                </motion.h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Contact Info */}
                            <div className="bg-white rounded-2xl p-8 shadow-luxury border border-charcoal/5">
                                <h3 className="font-serif text-xl text-navy mb-6 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-bold">1</span>
                                    Información de Contacto
                                </h3>

                                {!user && (
                                    <div className="mb-6 p-4 rounded-xl bg-charcoal/5 flex items-center justify-between">
                                        <p className="text-sm text-charcoal flex-1">
                                            ¿Ya tienes cuenta? Inicia sesión para guardar tu información.
                                        </p>
                                        <Link to="/login" className="text-gold font-medium hover:underline text-sm whitespace-nowrap">
                                            Iniciar sesión
                                        </Link>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-navy/80 mb-2">Nombre Completo</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-4 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all text-base bg-white shadow-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-navy/80 mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-4 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all text-base bg-white shadow-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-navy/80 mb-2">Teléfono / WhatsApp</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-4 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all text-base bg-white shadow-sm"
                                            placeholder="55 1234 5678"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping */}
                            <div className="bg-white rounded-2xl p-8 shadow-luxury border border-charcoal/5">
                                <h3 className="font-serif text-xl text-navy mb-6 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-bold">2</span>
                                    Dirección de Envío
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-navy/80 mb-2">Dirección Completa</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-4 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all text-base bg-white shadow-sm"
                                            placeholder="Calle, número exterior/interior, colonia"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-navy/80 mb-2">
                                            Referencias de entrega
                                            <span className="text-rose-deep ml-1">*</span>
                                        </label>
                                        <textarea
                                            name="references"
                                            value={formData.references}
                                            onChange={handleInputChange}
                                            required
                                            rows={2}
                                            className="w-full px-5 py-4 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all text-base bg-white shadow-sm resize-none"
                                            placeholder="Ej: Entre calle Roble y calle Pino, fachada azul, portón negro, frente a la tienda OXXO"
                                        />
                                        <p className="text-xs text-charcoal-light mt-2 flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                                            Indica entre qué calles se encuentra, color de fachada, referencias cercanas, etc.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-navy/80 mb-2">Ciudad</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-4 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all text-base bg-white shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-navy/80 mb-2">Estado</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-4 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all text-base bg-white shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-navy/80 mb-2">Código Postal</label>
                                        <input
                                            type="text"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-4 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all text-base bg-white shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 p-5 bg-navy/5 rounded-xl border border-navy/10 flex items-start gap-4">
                                    <svg className="w-6 h-6 text-navy mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                                    <div>
                                        <p className="font-semibold text-navy text-base">Método de Envío</p>
                                        <p className="text-sm text-charcoal-light mt-1">
                                            {promotion.isFreeShipping ? (
                                                <><strong className="text-emerald-600">¡Envío GRATIS vía FedEx!</strong> <span className="line-through text-charcoal-light/50 ml-2">$200 MXN</span></>
                                            ) : (
                                                <>Envío Estándar vía FedEx: <strong>$200 MXN</strong> a todo México</>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="bg-white rounded-2xl p-8 shadow-luxury border border-charcoal/5">
                                <h3 className="font-serif text-xl text-navy mb-6 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-bold">3</span>
                                    Método de Pago
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-5 rounded-xl border-2 border-gold bg-gold/5 cursor-default relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full -mr-12 -mt-12 pointer-events-none"></div>
                                        <span className="w-8 h-8 text-forest shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <svg className="w-5 h-5 text-[#009EE3]" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                                            </svg>
                                        </span>
                                        <div>
                                            <span className="block font-bold text-navy text-lg">Mercado Pago</span>
                                            <p className="text-sm text-charcoal-light mt-0.5">
                                                Tarjetas, Transferencia (SPEI) y Efectivo (OXXO)
                                            </p>
                                        </div>
                                        <svg className="ml-auto w-6 h-6 text-gold relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="bg-white rounded-2xl p-8 shadow-luxury border border-charcoal/5">
                                <label className="block text-sm font-medium text-navy/80 mb-3">Notas del pedido (opcional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-5 py-4 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all text-base bg-white shadow-sm resize-none"
                                    placeholder="Instrucciones especiales, horarios de entrega, etc."
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full py-4 text-lg disabled:opacity-50"
                            >
                                {loading
                                    ? 'Procesando...'
                                    : `Pagar con Mercado Pago - $${grandTotal.toLocaleString()} MXN`
                                }
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-8 shadow-luxury border border-charcoal/5 sticky top-24">
                            <h3 className="font-serif text-xl text-navy mb-6">Resumen del Pedido</h3>

                            <div className="space-y-5 mb-8">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 rounded-xl object-cover bg-blush shadow-sm"
                                        />
                                        <div className="flex-1 flex flex-col justify-center">
                                            <p className="font-medium text-navy line-clamp-2 leading-snug">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-charcoal-light mt-1">
                                                Cant: {item.quantity}
                                            </p>
                                            <p className="text-base text-gold font-bold mt-1">
                                                ${(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Promotion Banner */}
                            <div className="mb-6">
                                <CartPromoBanner promotion={promotion} />
                            </div>

                            <div className="bg-charcoal/5 h-px w-full my-6"></div>

                            <div className="space-y-4 text-base">
                                <div className="flex justify-between items-center">
                                    <span className="text-charcoal-light">Subtotal</span>
                                    <span className="font-medium text-navy">${subtotal.toLocaleString()}</span>
                                </div>

                                {/* Descuento (si aplica) */}
                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-emerald-600 font-medium">Descuento ({promotion.discountPercent}%)</span>
                                        <span className="text-emerald-600 font-medium whitespace-nowrap">-${discountAmount.toLocaleString()}</span>
                                    </div>
                                )}

                                {/* Envío */}
                                <div className="flex justify-between items-center">
                                    <span className="text-charcoal-light">Envío FedEx</span>
                                    {promotion.isFreeShipping ? (
                                        <span className="font-medium whitespace-nowrap">
                                            <span className="text-emerald-600">GRATIS</span>{' '}
                                            <span className="line-through text-charcoal-light/40 text-sm ml-1">$200</span>
                                        </span>
                                    ) : (
                                        <span className="font-medium text-navy">${shippingCost}</span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-charcoal/5 h-px w-full my-6"></div>

                            <div className="flex justify-between items-end">
                                <span className="text-lg font-medium text-navy">Total</span>
                                <div className="text-right">
                                    <span className="block text-3xl font-bold text-gold leading-none">${grandTotal.toLocaleString()}</span>
                                    <span className="text-xs text-charcoal-light block mt-1">MXN (IVA incluido)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
