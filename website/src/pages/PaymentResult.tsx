import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { getWebsiteOrderSummary, incrementCouponUsage, markCartConverted, type WebsiteOrder, type WebsiteOrderItem } from '../lib/supabase';
import { trackEvent } from '../utils/telemetry';

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const { clearCart, appliedCoupon, total, itemCount } = useCartStore();
    const hasIncremented = useRef(false);
    const hasTrackedResult = useRef(false);
    const [orderData, setOrderData] = useState<WebsiteOrder | null>(null);
    const whatsappPhone = '525565116087';

    const status = searchParams.get('collection_status') || searchParams.get('status') || 'unknown';
    const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id') || '';
    const externalRef = searchParams.get('external_reference') || '';
    const orderId = searchParams.get('order_id') || '';
    const methodParam = searchParams.get('method') || '';

    useEffect(() => {
        if (orderId) {
            getWebsiteOrderSummary(orderId).then((res) => {
                if (res) {
                    setOrderData(res);
                }
            }).catch(console.error);
        }
    }, [orderId]);

    useEffect(() => {
        if (!hasTrackedResult.current && status !== 'unknown') {
            hasTrackedResult.current = true;
            if (status === 'approved' || status === 'order_created') {
                trackEvent('purchase_complete', 'ecommerce', {
                    payment_id: paymentId || orderId,
                    external_reference: externalRef,
                    status,
                    payment_method: methodParam || 'mercadopago',
                    cart_total: total(),
                    items_count: itemCount(),
                });
            } else if (status === 'rejected') {
                trackEvent('payment_error', 'ecommerce', {
                    payment_id: paymentId,
                    external_reference: externalRef,
                    status: 'rejected_by_gateway',
                });
            }
        }

        if (status === 'approved' || status === 'order_created') {
            if (appliedCoupon && !hasIncremented.current && status === 'approved') {
                hasIncremented.current = true;
                incrementCouponUsage(appliedCoupon.id).catch(console.error);
            }

            import('../store/authStore').then(({ useAuthStore }) => {
                const user = useAuthStore.getState().user;
                if (user?.email) {
                    markCartConverted(user.email).catch(console.error);
                }
            });

            clearCart();
        }
    }, [status, clearCart, appliedCoupon, paymentId, orderId, externalRef, methodParam, total, itemCount]);

    const activeFolio = orderData?.order_number || externalRef || (orderId ? orderId.slice(0, 8).toUpperCase() : '');
    const activeMethod = orderData?.payment_method || methodParam || 'mercadopago';

    const methodLabels: Record<string, string> = {
        mercadopago: 'Tarjeta / Mercado Pago',
        transferencia: 'Transferencia Bancaria (SPEI)',
        efectivo: 'Depósito en OXXO / Efectivo',
    };

    const statusConfig: Record<string, { icon: string; title: string; message: string; color: string }> = {
        approved: {
            icon: '✅',
            title: '¡Pago Exitoso!',
            message: 'Tu pedido ha sido confirmado. Recibirás un correo de confirmación con los detalles de tu compra y el número de seguimiento de envío.',
            color: 'text-green-600',
        },
        order_created: {
            icon: '🎉',
            title: '¡Tu Pedido ha sido Registrado!',
            message: 'Hemos guardado tu pedido con éxito y enviado la confirmación a tu correo electrónico. Nuestro equipo de Atención a Clientes ya recibió tu orden para procesar tu pago y envío FedEx.',
            color: 'text-emerald-600',
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

    const parsedItems: WebsiteOrderItem[] = Array.isArray(orderData?.items)
        ? orderData.items
        : typeof orderData?.items === 'string'
            ? (() => { try { return JSON.parse(orderData.items); } catch { return []; } })()
            : [];

    const buildWhatsAppUrl = () => {
        if (!orderData && !activeFolio) {
            return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent('Hola, tengo una consulta sobre mi pedido en jdenis.store')}`;
        }
        const itemsText = parsedItems.length > 0
            ? parsedItems.map((i: WebsiteOrderItem) => `• ${i.quantity}x ${i.name} ($${(Number(i.price) * Number(i.quantity)).toLocaleString()} MXN)`).join('\n')
            : '';
        const buyerName = orderData?.buyer_info?.fullName || '';
        const buyerEmail = orderData?.buyer_info?.email || '';
        const msgLines = [
            `Hola J. Denis, acabo de registrar mi pedido *#${activeFolio}* en jdenis.store y deseo completar mi pago.`,
            buyerName ? `👤 *Cliente:* ${buyerName}` : '',
            buyerEmail ? `📧 *Correo:* ${buyerEmail}` : '',
            `💳 *Método elegido:* ${methodLabels[activeMethod] || activeMethod}`,
            orderData?.total ? `💰 *Total a pagar:* $${Number(orderData.total).toLocaleString()} MXN` : '',
            itemsText ? `\n📦 *Productos:*\n${itemsText}` : '',
            orderData?.shipping_address?.city
                ? `\n🚚 *Envío a:* ${orderData.shipping_address.address || ''}, ${orderData.shipping_address.city}, ${orderData.shipping_address.state || ''} CP ${orderData.shipping_address.zip || ''}`
                : '',
        ].filter(Boolean).join('\n');

        return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(msgLines)}`;
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-luxury p-8 md:p-10 max-w-xl w-full text-center border border-charcoal/5"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="text-6xl mb-4"
                >
                    {config.icon}
                </motion.div>

                <h1 className={`font-serif text-2xl md:text-3xl mb-3 ${config.color}`}>
                    {config.title}
                </h1>

                <p className="text-charcoal-light leading-relaxed mb-6 text-sm md:text-base">
                    {config.message}
                </p>

                {(activeFolio || paymentId) && (
                    <div className="bg-navy text-white rounded-2xl p-5 mb-6 text-left shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3 mb-3">
                            <div>
                                <span className="text-xs uppercase tracking-wider text-gold block">Folio de Pedido</span>
                                <span className="text-xl font-bold tracking-wide text-white">#{activeFolio}</span>
                            </div>
                            {orderData?.total !== undefined && (
                                <div className="text-right">
                                    <span className="text-xs uppercase tracking-wider text-white/70 block">Total</span>
                                    <span className="text-xl font-bold text-gold">${Number(orderData.total).toLocaleString()} MXN</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5 text-xs md:text-sm text-white/85">
                            {paymentId && (
                                <p><strong className="text-white">ID de Transacción:</strong> {paymentId}</p>
                            )}
                            <p><strong className="text-white">Método de Pago:</strong> {methodLabels[activeMethod] || activeMethod}</p>
                            {orderData?.buyer_info?.email && (
                                <p><strong className="text-white">Confirmación enviada a:</strong> {orderData.buyer_info.email}</p>
                            )}
                        </div>

                        {parsedItems.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-white/15">
                                <p className="text-xs uppercase tracking-wider text-gold mb-2 font-semibold">Resumen de Productos</p>
                                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                    {parsedItems.map((item: WebsiteOrderItem, idx: number) => (
                                        <div key={idx} className="flex justify-between text-xs text-white/90">
                                            <span className="truncate pr-2">{item.quantity}x {item.name}</span>
                                            <span className="font-semibold text-gold shrink-0">${(Number(item.price) * Number(item.quantity)).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {status === 'order_created' && (
                    <div className="bg-gold/10 border border-gold/30 rounded-2xl p-5 mb-6 text-left">
                        <p className="font-bold text-navy text-sm mb-2">
                            📌 ¿Cómo finalizar tu pago en 1 minuto?
                        </p>
                        <ol className="text-xs md:text-sm text-charcoal space-y-1.5 list-decimal list-inside">
                            <li>Haz clic en el botón verde de <strong>WhatsApp</strong> aquí abajo (tu folio <strong>#{activeFolio}</strong> ya está incluido).</li>
                            <li>
                                {activeMethod === 'transferencia'
                                    ? 'Recibirás al instante la CLABE SPEI oficial de J. Denis para realizar tu transferencia.'
                                    : activeMethod === 'efectivo'
                                        ? 'Recibirás tu referencia para depósito en OXXO o ventanilla bancaria.'
                                        : 'Recibirás tu liga segura de Mercado Pago para pagar con tarjeta de crédito o débito.'}
                            </li>
                            <li>En cuanto confirmemos tu pago, liberamos tu guía FedEx y te la enviamos por correo y WhatsApp.</li>
                        </ol>
                    </div>
                )}

                <div className="space-y-3">
                    {status === 'order_created' && (
                        <a
                            href={buildWhatsAppUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <span>💬 Confirmar Pago del Pedido #{activeFolio} por WhatsApp</span>
                        </a>
                    )}

                    {(status === 'approved' || status === 'order_created') && (
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

                    {status !== 'order_created' && (
                        <a
                            href={buildWhatsAppUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-gold hover:underline mt-4 font-medium"
                        >
                            ¿Necesitas ayuda? Contáctanos por WhatsApp
                        </a>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
