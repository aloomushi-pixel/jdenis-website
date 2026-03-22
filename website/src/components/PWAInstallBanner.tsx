import { AnimatePresence, motion } from 'framer-motion';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
    /** Show the banner — typically set to true after login/register */
    show: boolean;
}

export default function PWAInstallBanner({ show }: PWAInstallBannerProps) {
    const { status, install, dismiss } = usePWAInstall();

    // Only show when the parent says so AND we have something to offer
    const visible = show && (status === 'installable' || status === 'ios');

    const handleInstall = async () => {
        if (status === 'installable') {
            await install();
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 120, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 120, opacity: 0 }}
                    transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                    className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-[360px] z-50"
                >
                    <div className="bg-navy text-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                            <img
                                src="/logo-new.jpeg"
                                alt="J. Denis"
                                className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm leading-tight">J. Denis</p>
                                <p className="text-white/70 text-xs mt-0.5 leading-tight">
                                    Instala la app gratis — acceso rápido sin navegador
                                </p>
                            </div>
                            <button
                                onClick={dismiss}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
                                aria-label="Cerrar"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Benefits */}
                        <div className="px-4 pb-3 flex gap-3 text-xs text-white/70">
                            {['⚡ Carga instantánea', '📦 Pedidos fáciles', '🔕 Sin spam'].map((b) => (
                                <span key={b} className="flex-1 text-center bg-white/8 rounded-lg py-1.5 px-1">{b}</span>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="px-4 pb-4">
                            {status === 'installable' ? (
                                <button
                                    onClick={handleInstall}
                                    className="w-full bg-gold hover:bg-gold/90 text-navy font-bold text-sm py-2.5 rounded-xl transition-colors"
                                >
                                    📲 Instalar App
                                </button>
                            ) : (
                                /* Safari iOS — manual instructions */
                                <div className="bg-white/10 rounded-xl p-3 text-xs text-white/80 leading-relaxed">
                                    <p className="font-semibold text-white mb-1.5">Para instalar en Safari:</p>
                                    <p>1. Toca el ícono de <strong>compartir</strong> (<span className="text-base">□↑</span>) en la barra inferior</p>
                                    <p>2. Selecciona <strong>"Agregar a pantalla de inicio"</strong></p>
                                    <p>3. Toca <strong>"Agregar"</strong></p>
                                    <button
                                        onClick={dismiss}
                                        className="mt-2 w-full text-center text-white/50 hover:text-white/80 transition-colors py-1"
                                    >
                                        Entendido
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
