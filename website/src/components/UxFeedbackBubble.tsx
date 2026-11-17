import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { trackEvent, flushQueue } from '../utils/telemetry';

export default function UxFeedbackBubble() {
    const location = useLocation();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const user = useAuthStore((s) => s.user);
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState<'ux' | 'catalogo' | 'operacion'>('ux');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const rawRole = (user?.role || '').toUpperCase();

    // Uso exclusivo en el Backend Administrativo (/admin) con sesión activa de Administrador
    if (!isAuthenticated || rawRole !== 'ADMIN' || !location.pathname.startsWith('/admin')) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = message.trim();
        if (!trimmed) return;

        trackEvent({
            event_name: 'ux_feedback',
            event_category: 'operations',
            path: location.pathname + location.search,
            element_text: trimmed.slice(0, 200),
            metadata: {
                feedback_type: category,
                message: trimmed.slice(0, 600),
                submitted_role: rawRole,
                governance_group: 'GRUPO_A',
                user_email: user?.email || null,
            },
        });
        await flushQueue();

        setSent(true);
        setMessage('');
        window.dispatchEvent(new CustomEvent('jdenis:ux-feedback-submitted'));
        setTimeout(() => {
            setSent(false);
            setOpen(false);
        }, 1800);
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 print:hidden">
            {open ? (
                <div className="w-[300px] sm:w-[340px] rounded-2xl bg-white border border-gray-200 shadow-2xl p-4 text-gray-900">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            Mejora UX · Uso Administrativo
                        </span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Cerrar buzón de mejora"
                            className="w-9 h-9 -mr-1.5 -mt-1.5 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    {sent ? (
                        <p className="text-sm text-emerald-700 font-medium py-3">
                            Directiva registrada en el panel administrativo.
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-2.5">
                            <div className="flex gap-1.5">
                                {([
                                    ['ux', 'Diseño / UX'],
                                    ['catalogo', 'Catálogo'],
                                    ['operacion', 'Operación'],
                                ] as const).map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setCategory(key)}
                                        className={`flex-1 min-h-[38px] text-xs font-medium rounded-lg border transition-colors ${
                                            category === key
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
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
                                placeholder="Registrar observación o directiva interna..."
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="w-full min-h-[42px] rounded-xl bg-indigo-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                            >
                                Guardar Directiva UX
                            </button>
                        </form>
                    )}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Abrir buzón administrativo de Mejora UX"
                    title="Buzón interno exclusivo para Administradores"
                    className="min-w-[44px] min-h-[44px] px-4 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg text-white text-xs font-semibold flex items-center gap-2 transition-all"
                >
                    <span aria-hidden="true">💬</span>
                    <span>Mejora UX</span>
                </button>
            )}
        </div>
    );
}
