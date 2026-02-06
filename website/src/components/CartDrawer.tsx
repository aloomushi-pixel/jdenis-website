import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function CartDrawer() {
    const { isOpen, closeCart, items, removeItem, updateQuantity, total } = useCartStore();

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
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-cream shadow-soft-xl z-50 flex flex-col rounded-l-4xl"
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
                                        <div key={item.id} className="flex gap-4 p-4 bg-blush rounded-2xl">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-xl bg-white"
                                            />
                                            <div className="flex-1">
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
                                                className="text-mauve/40 hover:text-rose-deep transition-colors"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-rose/20 bg-blush/50 rounded-bl-4xl">
                                <div className="flex justify-between mb-4">
                                    <span className="text-ink font-medium">Subtotal</span>
                                    <span className="text-rose-deep font-bold text-xl">${total().toLocaleString()} MXN</span>
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
