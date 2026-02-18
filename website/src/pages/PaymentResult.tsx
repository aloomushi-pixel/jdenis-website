import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const { clearCart } = useCartStore();

    const status = searchParams.get('collection_status') || searchParams.get('status') || 'unknown';
    const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id') || '';
    const externalRef = searchParams.get('external_reference') || '';

    useEffect(() => {
        if (status === 'approved') {
            clearCart();
        }
    }, [status, clearCart]);

    const statusConfig: Record<string, { icon: string; title: string; message: string; color: string }> = {
        approved: {
            icon: '✅',
            title: '¡Pago Exitoso!',
            message: 'Tu pedido ha sido confirmado. Recibirás un correo de confirmación con los detalles de tu compra y el número de seguimiento de envío.',
            color: 'text-green-600',
        },
        pending: {
            icon: '⏳',
            title: 'Pago Pendiente',
            message: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme. Si pagaste en OXXO, recuerda que puede tomar hasta 2 horas hábiles.',
            color: 'text-amber-600',
        },
        in_process: {
            icon: '⏳',
            title: 'Pago en Proceso',
            message: 'Tu pago está siendo procesado por Mercado Pago. Te notificaremos cuando se confirme la transacción.',
            color: 'text-amber-600',
        },
        rejected: {
            icon: '❌',
            title: 'Pago Rechazado',
            message: 'Tu pago no pudo ser procesado. Por favor, intenta nuevamente con otro método de pago o contacta a tu banco.',
            color: 'text-red-600',
        },
        unknown: {
            icon: '❓',
            title: 'Estado Desconocido',
            message: 'No pudimos determinar el estado de tu pago. Si realizaste el pago, por favor contáctanos por WhatsApp.',
            color: 'text-charcoal',
        },
    };

    const config = statusConfig[status] || statusConfig.unknown;

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-luxury p-8 md:p-12 max-w-lg w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="text-6xl mb-6"
                >
                    {config.icon}
                </motion.div>

                <h1 className={`font-serif text-2xl md:text-3xl mb-4 ${config.color}`}>
                    {config.title}
                </h1>

                <p className="text-charcoal-light leading-relaxed mb-6">
                    {config.message}
                </p>

                {paymentId && (
                    <div className="bg-blush rounded-xl p-4 mb-6 text-sm">
                        <p className="text-charcoal-light">
                            <span className="font-medium text-navy">ID de Pago:</span> {paymentId}
                        </p>
                        {externalRef && (
                            <p className="text-charcoal-light mt-1">
                                <span className="font-medium text-navy">Ref. Pedido:</span> {externalRef}
                            </p>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    {status === 'approved' && (
                        <Link to="/mi-cuenta" className="btn btn-primary w-full">
                            Ver Mis Pedidos
                        </Link>
                    )}

                    {(status === 'rejected' || status === 'unknown') && (
                        <Link to="/checkout" className="btn btn-primary w-full">
                            Intentar de Nuevo
                        </Link>
                    )}

                    <Link to="/tienda" className="btn btn-ghost w-full">
                        Seguir Comprando
                    </Link>

                    <a
                        href="https://wa.me/525565116087?text=Hola%2C%20tengo%20una%20consulta%20sobre%20mi%20pedido"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-gold hover:underline mt-4"
                    >
                        ¿Necesitas ayuda? Contáctanos por WhatsApp
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
