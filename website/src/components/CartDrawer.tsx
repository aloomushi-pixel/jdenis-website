import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCartPromotion } from '../hooks/useCartPromotion';
import { useCartStore } from '../store/cartStore';
import CartPromoBanner from './CartPromoBanner';

export default function CartDrawer() {
    const { isOpen, closeCart, items, removeItem, updateQuantity } = useCartStore();
    const promotion = useCartPromotion();

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
                                                <p className="text-rose-deep font-semibold">${item.price}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-full bg-white text-mauve hover:bg-rose/20 flex items-center justify-center transition-colors shadow-sm"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="text-ink font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-full bg-white text-mauve hover:bg-rose/20 flex items-center justify-center transition-colors shadow-sm"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
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
                        {items.length > 0 && (
                            <div className="px-6">
                                <CartPromoBanner promotion={promotion} />
                            </div>
                        )}

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-rose/20 bg-blush/50 rounded-bl-4xl">
                                <div className="space-y-2 mb-4">
                                    {/* Subtotal */}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-ink/70">Subtotal</span>
                                        <span className="text-ink">${promotion.subtotal.toLocaleString()} MXN</span>
                                    </div>

                                    {/* Descuento (si aplica) */}
                                    {promotion.discountAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-emerald-600 font-medium">Descuento ({promotion.discountPercent}%)</span>
                                            <span className="text-emerald-600 font-medium">-${promotion.discountAmount.toLocaleString()} MXN</span>
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
                                        ${promotion.grandTotal.toLocaleString()} MXN
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
