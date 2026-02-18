import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { createWebsiteOrder, createMercadoPagoCheckout } from '../lib/supabase';

export default function Checkout() {
    const navigate = useNavigate();
    const { items, total, clearCart } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const SHIPPING_COST = 200;
    const subtotal = total();
    const grandTotal = subtotal + SHIPPING_COST;

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Mercado Pago payments (card + mercadopago)
            if (paymentMethod === 'card' || paymentMethod === 'mercadopago') {
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
                    shipping_cost: SHIPPING_COST,
                };

                const result = await createMercadoPagoCheckout(checkoutData);

                // Redirect to Mercado Pago checkout
                window.location.href = result.checkout_url;
                return;
            }

            // Depósito bancario / OXXO — keep existing flow
            if (isAuthenticated && user) {
                const orderItems = items.map(item => ({
                    product_id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                }));
                await createWebsiteOrder(user.id, user.email, orderItems, grandTotal);
            }

            clearCart();
            navigate('/mi-cuenta?pedido=exito');
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
                            <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                <h3 className="font-serif text-lg text-navy mb-4">1. Información de Contacto</h3>

                                {!isAuthenticated && (
                                    <p className="text-sm text-charcoal-light mb-4">
                                        ¿Ya tienes cuenta?{' '}
                                        <Link to="/login" className="text-gold hover:underline">
                                            Inicia sesión
                                        </Link>
                                    </p>
                                )}

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Nombre Completo</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="input"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="label">Teléfono / WhatsApp</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="input"
                                            placeholder="55 1234 5678"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping */}
                            <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                <h3 className="font-serif text-lg text-navy mb-4">2. Dirección de Envío</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="label">Dirección</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            className="input"
                                            placeholder="Calle, número, colonia"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="label">
                                            Referencias de entrega
                                            <span className="text-rose-deep ml-1">*</span>
                                        </label>
                                        <textarea
                                            name="references"
                                            value={formData.references}
                                            onChange={handleInputChange}
                                            required
                                            rows={2}
                                            className="input"
                                            placeholder="Ej: Entre calle Roble y calle Pino, fachada azul, portón negro, frente a la tienda OXXO"
                                        />
                                        <p className="text-xs text-charcoal-light mt-1 flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                                            Indica entre qué calles se encuentra, color de fachada, referencias cercanas, etc.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="label">Ciudad</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Estado</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Código Postal</label>
                                        <input
                                            type="text"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            required
                                            className="input"
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-charcoal-light mt-4">
                                    <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" /></svg> Envío vía FedEx: <strong>$200 MXN</strong> a todo México
                                </p>
                            </div>

                            {/* Payment */}
                            <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                <h3 className="font-serif text-lg text-navy mb-4">3. Método de Pago</h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 'card', label: 'Tarjeta de Crédito/Débito', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg> },
                                        { id: 'mercadopago', label: 'Mercado Pago', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                                        { id: 'deposito', label: 'Depósito Bancario', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg> },
                                        { id: 'oxxo', label: 'Pago en OXXO', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg> },
                                    ].map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === method.id
                                                ? 'border-gold bg-gold/5'
                                                : 'border-charcoal/20 hover:border-gold/50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="sr-only"
                                            />
                                            <span className="w-6 h-6 text-forest">{method.icon}</span>
                                            <span className="font-medium text-navy">{method.label}</span>
                                            {paymentMethod === method.id && (
                                                <svg className="ml-auto w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </label>
                                    ))}
                                </div>

                                {paymentMethod === 'deposito' && (
                                    <div className="mt-4 p-4 bg-blush rounded-lg text-sm">
                                        <p className="font-medium text-navy mb-2">Datos para depósito:</p>
                                        <p>BBVA: 0123 4567 8901 2345</p>
                                        <p>CLABE: 012 123 012345678901</p>
                                        <p className="mt-2 text-charcoal-light">
                                            Envía tu comprobante por WhatsApp al finalizar
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                <label className="label">Notas del pedido (opcional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="input"
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
                                    : (paymentMethod === 'card' || paymentMethod === 'mercadopago')
                                        ? `Pagar con Mercado Pago - $${grandTotal.toLocaleString()} MXN`
                                        : `Confirmar Pedido - $${grandTotal.toLocaleString()} MXN`
                                }
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-luxury sticky top-24">
                            <h3 className="font-serif text-lg text-navy mb-4">Resumen del Pedido</h3>

                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover bg-blush"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-navy line-clamp-1">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-charcoal-light">
                                                Cant: {item.quantity}
                                            </p>
                                            <p className="text-sm text-gold font-medium">
                                                ${(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-charcoal/10 my-4" />

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-charcoal-light">Subtotal</span>
                                    <span>${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-charcoal-light">Envío FedEx</span>
                                    <span>${SHIPPING_COST}</span>
                                </div>
                            </div>

                            <hr className="border-charcoal/10 my-4" />

                            <div className="flex justify-between text-lg font-semibold">
                                <span className="text-navy">Total</span>
                                <span className="text-gold">${grandTotal.toLocaleString()} MXN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
