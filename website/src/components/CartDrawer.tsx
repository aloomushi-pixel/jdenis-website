import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore();

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
                        className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-charcoal/10">
                            <h2 className="font-serif text-xl text-navy">Tu Carrito</h2>
                            <button
                                onClick={closeCart}
                                className="p-2 rounded-lg hover:bg-charcoal/5 transition-colors"
                            >
                                <svg className="w-6 h-6 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                    <svg className="w-20 h-20 text-charcoal/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <p className="text-charcoal-light mb-4">Tu carrito está vacío</p>
                                    <button onClick={closeCart} className="btn btn-outline">
                                        Explorar Tienda
                                    </button>
                                </div>
                            ) : (
                                <div className="divide-y divide-charcoal/10">
                                    {items.map((item) => (
                                        <div key={item.id} className="cart-item">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-lg bg-blush"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-navy text-sm">{item.name}</h3>
                                                <p className="text-gold font-semibold">${item.price.toLocaleString()}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-full border border-charcoal/20 flex items-center justify-center hover:border-gold transition-colors"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-full border border-charcoal/20 flex items-center justify-center hover:border-gold transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="ml-auto text-charcoal/40 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-charcoal/10 p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-charcoal-light">Subtotal</span>
                                    <span className="font-serif text-xl text-navy font-semibold">
                                        ${total().toLocaleString()} MXN
                                    </span>
                                </div>
                                <p className="text-xs text-charcoal/50">
                                    Envío FedEx: $200 MXN (se calcula en checkout)
                                </p>
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
