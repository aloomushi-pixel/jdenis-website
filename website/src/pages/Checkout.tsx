import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function Checkout() {
    const navigate = useNavigate();
    const { items, total, clearCart } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);

    const SHIPPING_COST = 200;
    const subtotal = total();
    const grandTotal = subtotal + SHIPPING_COST;

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '',
        address: '',
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

        // Simular procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Aquí iría la integración real con backend
        clearCart();
        navigate('/mi-cuenta?pedido=exito');
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
                                    📦 Envío vía FedEx: <strong>$200 MXN</strong> a todo México
                                </p>
                            </div>

                            {/* Payment */}
                            <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                <h3 className="font-serif text-lg text-navy mb-4">3. Método de Pago</h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 'card', label: 'Tarjeta de Crédito/Débito', icon: '💳' },
                                        { id: 'mercadopago', label: 'Mercado Pago', icon: '🔵' },
                                        { id: 'deposito', label: 'Depósito Bancario', icon: '🏦' },
                                        { id: 'oxxo', label: 'Pago en OXXO', icon: '🏪' },
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
                                            <span className="text-xl">{method.icon}</span>
                                            <span className="font-medium text-navy">{method.label}</span>
                                            {paymentMethod === method.id && (
                                                <span className="ml-auto text-gold">✓</span>
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full py-4 text-lg disabled:opacity-50"
                            >
                                {loading ? 'Procesando...' : `Confirmar Pedido - $${grandTotal.toLocaleString()} MXN`}
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
