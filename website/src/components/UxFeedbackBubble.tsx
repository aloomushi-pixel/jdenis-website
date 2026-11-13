import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { trackEvent } from '../utils/telemetry';

const DIRECTIVE_ROLES = new Set(['ADMIN', 'SUPERVISOR', 'ADVISOR']);

export default function UxFeedbackBubble() {
    const location = useLocation();
    const isCartOpen = useCartStore((s) => s.isOpen);
    const user = useAuthStore((s) => s.user);
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState<'ux' | 'catalogo' | 'operacion'>('ux');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    if (isCartOpen) return null;

    const rawRole = (user?.role || 'VISITOR').toUpperCase();
    const governanceGroup = DIRECTIVE_ROLES.has(rawRole) ? 'GRUPO_A' : 'GRUPO_B';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = message.trim();
        if (!trimmed) return;

        trackEvent({
            event_name: 'ux_feedback',
            event_category: location.pathname.startsWith('/admin') ? 'operations' : 'ux_friction',
            path: location.pathname + location.search,
            element_text: trimmed.slice(0, 200),
            metadata: {
                feedback_type: category,
                message: trimmed.slice(0, 600),
                submitted_role: rawRole,
                governance_group: governanceGroup,
                user_email: user?.email || null,
            },
        });

        setSent(true);
        setMessage('');
        setTimeout(() => {
            setSent(false);
            setOpen(false);
        }, 1800);
    };

    return (
        <div className="fixed bottom-4 left-4 z-40 print:hidden">
            {open ? (
                <div className="w-[300px] sm:w-[320px] rounded-2xl bg-white border border-kraft/40 shadow-xl p-4 text-charcoal">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-forest">
                             Buzón de Mejora Continua
                        </span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Cerrar buzón de mejora"
                            className="w-11 h-11 -mr-2 -mt-2 flex items-center justify-center rounded-full text-charcoal/60 hover:bg-cream"
                        >
                            ✕
                        </button>
                    </div>
                    {sent ? (
                        <p className="text-sm text-emerald-700 font-medium py-3">
                            ¡Gracias! Tu sugerencia se registró para revisión continua.
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-2.5">
                            <div className="flex gap-1.5">
                                {([
                                    ['ux', 'Diseño / UX'],
                                    ['catalogo', 'Producto'],
                                    ['operacion', 'Sistema'],
                                ] as const).map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setCategory(key)}
                                        className={`flex-1 min-h-[38px] text-xs font-medium rounded-lg border transition-colors ${
                                            category === key
                                                ? 'bg-forest text-white border-forest'
                                                : 'bg-cream/60 text-charcoal/80 border-kraft/40 hover:bg-cream'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={3}
                                maxLength={500}
                                required
                                placeholder="¿Qué podemos mejorar en esta pantalla?"
                                className="w-full rounded-xl border border-kraft/50 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/45 focus:outline-none focus:border-forest"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="w-full min-h-[44px] rounded-xl bg-forest text-white text-xs font-semibold uppercase tracking-wider hover:bg-forest-light disabled:opacity-40 transition-colors"
                            >
                                Enviar Sugerencia
                            </button>
                        </form>
                    )}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Enviar sugerencia de experiencia"
                    title="¿Algo por mejorar en esta página?"
                    className="min-w-[44px] min-h-[44px] px-3.5 rounded-full bg-white/95 backdrop-blur border border-kraft/50 shadow-md hover:shadow-lg text-forest text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                    <span aria-hidden="true">💬</span>
                    <span className="hidden sm:inline">Mejora UX</span>
                </button>
            )}
        </div>
    );
}
