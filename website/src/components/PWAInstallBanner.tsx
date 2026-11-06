import { useEffect, useRef } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { trackEvent } from '../utils/telemetry';

interface PWAInstallBannerProps {
    /** Show the banner — typically set to true after login/register or engagement */
    show: boolean;
}

export default function PWAInstallBanner({ show }: PWAInstallBannerProps) {
    const { status, install, dismiss } = usePWAInstall();
    const promptTrackedRef = useRef(false);

    // Only show when the parent says so AND we have something to offer
    const visible = show && (status === 'installable' || status === 'ios');

    useEffect(() => {
        if (visible && !promptTrackedRef.current) {
            promptTrackedRef.current = true;
            trackEvent('pwa_prompt_shown', 'pwa', {
                platform_status: status,
            });
        }
    }, [visible, status]);

    const handleInstall = async () => {
        if (status === 'installable') {
            await install();
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-[360px] z-50">
            <div className="bg-navy text-white rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 pt-3.5 pb-2.5">
                    <img
                        src="/logo-new.jpeg"
                        alt="J. Denis"
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm leading-tight">J. Denis Cosméticos</p>
                        <p className="text-white/70 text-xs mt-0.5 leading-tight">
                            Instala la app gratis — pedidos y recompra rápida sin navegador
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={dismiss}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors flex-shrink-0"
                        aria-label="Cerrar aviso de instalación"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Benefits */}
                <div className="px-4 pb-2.5 flex gap-2 text-[11px] text-white/75">
                    {['⚡ Carga instantánea', '📦 Pedidos fáciles', '🔕 Sin spam'].map((b) => (
                        <span key={b} className="flex-1 text-center bg-white/8 rounded-lg py-1.5 px-1">{b}</span>
                    ))}
                </div>

                {/* CTA */}
                <div className="px-4 pb-3.5">
                    {status === 'installable' ? (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleInstall}
                                className="flex-1 bg-gold hover:bg-gold/90 text-navy font-bold text-sm py-2.5 rounded-xl transition-colors"
                            >
                                📲 Instalar App
                            </button>
                            <button
                                type="button"
                                onClick={dismiss}
                                className="px-3.5 bg-white/10 hover:bg-white/20 text-white/80 text-xs font-medium rounded-xl transition-colors"
                            >
                                Ahora no
                            </button>
                        </div>
                    ) : (
                        /* Safari iOS — manual instructions: entire card is clickable to dismiss so iOS users never get stuck */
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={dismiss}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') dismiss();
                            }}
                            className="bg-white/10 hover:bg-white/15 rounded-xl p-3 text-xs text-white/85 leading-relaxed cursor-pointer transition-colors"
                        >
                            <p className="font-semibold text-white mb-1">Para instalar en iPhone / Safari:</p>
                            <p>1. Toca el ícono <strong>Compartir</strong> (<span className="text-sm">□↑</span>) en la barra inferior de Safari</p>
                            <p>2. Elige <strong>«Agregar a pantalla de inicio»</strong></p>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dismiss();
                                }}
                                className="mt-2.5 w-full bg-gold/90 hover:bg-gold text-navy font-bold text-xs rounded-lg py-2 transition-colors"
                            >
                                Entendido · Continuar navegando
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
