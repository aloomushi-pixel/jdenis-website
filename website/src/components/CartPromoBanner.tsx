import { AnimatePresence, motion } from 'framer-motion';
import type { CartPromotion } from '../hooks/useCartPromotion';

interface CartPromoBannerProps {
    promotion: CartPromotion;
}

/**
 * Banner animado que muestra el estado de la promoción del carrito.
 * - Cuando la promo está activa: banner celebratorio verde/dorado
 * - Cuando falta poco: barra de progreso motivacional
 */
export default function CartPromoBanner({ promotion }: CartPromoBannerProps) {
    const { isActive, progressText, progressPercent, promoMessage, subtotal } = promotion;

    // No mostrar nada si el carrito está vacío
    if (subtotal === 0) return null;

    return (
        <div className="px-1 py-2">
            <AnimatePresence mode="wait">
                {isActive ? (
                    <motion.div
                        key="promo-active"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="rounded-2xl p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60"
                    >
                        <div className="flex items-start gap-3">
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                                className="text-2xl flex-shrink-0"
                            >
                                🎉
                            </motion.span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-emerald-800 leading-snug">
                                    {promoMessage}
                                </p>
                            </div>
                        </div>

                        {/* Barra completa */}
                        <div className="mt-3 h-1.5 bg-emerald-200/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: '80%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                            />
                        </div>
                    </motion.div>
                ) : progressText ? (
                    <motion.div
                        key="promo-progress"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-2xl p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60"
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-xl flex-shrink-0">🚚</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-amber-800 leading-snug">
                                    {progressText}
                                </p>
                            </div>
                        </div>

                        {/* Barra de progreso */}
                        <div className="mt-3 h-1.5 bg-amber-200/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                            />
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
