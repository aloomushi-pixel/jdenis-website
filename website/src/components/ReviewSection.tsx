import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    getApprovedReviews,
    hasUserPurchasedProduct,
    submitReview,
    type ProductReview,
} from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface ReviewSectionProps {
    productId: string;
    productName: string;
}

function StarRating({ rating, onRate, interactive = false }: {
    rating: number;
    onRate?: (r: number) => void;
    interactive?: boolean;
}) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onClick={() => onRate?.(star)}
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(0)}
                    className={`text-xl transition-transform ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
                    style={{ color: star <= (hover || rating) ? '#C9A96E' : '#D1D5DB' }}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

function AverageRatingBadge({ reviews }: { reviews: ProductReview[] }) {
    if (reviews.length === 0) return null;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return (
        <div className="flex items-center gap-3 mb-6 p-4 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #C9A96E10, #1B3B2D08)', border: '1px solid #C9A96E25' }}>
            <span className="text-3xl font-bold" style={{ color: '#C9A96E' }}>{avg.toFixed(1)}</span>
            <div>
                <StarRating rating={Math.round(avg)} />
                <p className="text-xs text-charcoal/50 mt-0.5">{reviews.length} reseña{reviews.length !== 1 ? 's' : ''} verificada{reviews.length !== 1 ? 's' : ''}</p>
            </div>
        </div>
    );
}

export default function ReviewSection({ productId, productName }: ReviewSectionProps) {
    const { user, isAuthenticated } = useAuthStore();
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [canReview, setCanReview] = useState(false);
    const [checkingPurchase, setCheckingPurchase] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    // Load reviews
    useEffect(() => {
        async function load() {
            try {
                const data = await getApprovedReviews(productId);
                setReviews(data);
            } catch (err) {
                console.error('Error loading reviews:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [productId]);

    // Check if user can review
    useEffect(() => {
        async function checkPurchase() {
            if (!isAuthenticated || !user) return;
            setCheckingPurchase(true);
            try {
                const purchased = await hasUserPurchasedProduct(user.id, productId);
                setCanReview(purchased);
            } catch (err) {
                console.error('Error checking purchase:', err);
            } finally {
                setCheckingPurchase(false);
            }
        }
        checkPurchase();
    }, [isAuthenticated, user, productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || rating === 0 || !comment.trim()) {
            setError('Por favor selecciona una calificación y escribe un comentario.');
            return;
        }

        setSubmitting(true);
        setError('');
        try {
            await submitReview(productId, user.id, user.fullName || user.name || 'Cliente', rating, comment.trim());
            setSubmitted(true);
            setShowForm(false);
        } catch (err) {
            console.error('Error submitting review:', err);
            setError('Error al enviar la reseña. Intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: '#C9A96E' }} />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h3 className="font-serif text-xl text-forest mb-5">Reseñas de clientes</h3>

            {/* Average Rating */}
            <AverageRatingBadge reviews={reviews} />

            {/* Review Form Area */}
            <div className="mb-8">
                {submitted ? (
                    <div className="p-5 rounded-xl text-center" style={{ background: '#1B3B2D10', border: '1px solid #1B3B2D20' }}>
                        <span className="text-3xl block mb-2">✅</span>
                        <p className="font-medium text-forest">¡Gracias por tu reseña!</p>
                        <p className="text-sm text-charcoal/60 mt-1">Tu comentario será revisado por nuestro equipo antes de publicarse.</p>
                    </div>
                ) : !isAuthenticated ? (
                    <div className="p-5 rounded-xl text-center" style={{ background: '#F5F0E8', border: '1px solid #C9A96E20' }}>
                        <span className="text-2xl block mb-2">🔒</span>
                        <p className="text-sm text-charcoal/70 mb-3">Inicia sesión para dejar una reseña</p>
                        <Link to="/login" className="inline-block px-6 py-2 text-sm font-medium rounded-lg transition-all hover:shadow-md"
                            style={{ background: 'linear-gradient(135deg, #C9A96E, #B8943D)', color: '#1B3B2D' }}>
                            Iniciar Sesión
                        </Link>
                    </div>
                ) : checkingPurchase ? (
                    <div className="p-5 rounded-xl text-center" style={{ background: '#F5F0E8' }}>
                        <p className="text-sm text-charcoal/60">Verificando tu compra...</p>
                    </div>
                ) : !canReview ? (
                    <div className="p-5 rounded-xl text-center" style={{ background: '#F5F0E8', border: '1px solid #C9A96E20' }}>
                        <span className="text-2xl block mb-2">🛒</span>
                        <p className="text-sm text-charcoal/70">Solo los compradores verificados de <strong>{productName}</strong> pueden escribir reseñas.</p>
                        <p className="text-xs text-charcoal/40 mt-2">Compra este producto para dejar tu opinión</p>
                    </div>
                ) : showForm ? (
                    <form onSubmit={handleSubmit} className="p-5 rounded-xl space-y-4" style={{ background: '#FFFFFF', border: '1px solid #C9A96E25', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <div>
                            <label className="block text-sm font-medium text-forest mb-2">Tu calificación</label>
                            <StarRating rating={rating} onRate={setRating} interactive />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-forest mb-2">Tu comentario</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                placeholder={`¿Qué te pareció ${productName}? Comparte tu experiencia...`}
                                className="w-full rounded-lg p-3 text-sm resize-none transition-colors focus:outline-none"
                                style={{ border: '1px solid #E8E0D4', background: '#FAFAF8' }}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={submitting || rating === 0}
                                className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-all hover:shadow-md disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg, #C9A96E, #B8943D)', color: '#1B3B2D' }}
                            >
                                {submitting ? 'Enviando...' : 'Enviar Reseña'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2.5 text-sm rounded-lg transition-colors hover:bg-gray-100"
                                style={{ color: '#666' }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full py-3 text-sm font-medium rounded-xl border-2 transition-all hover:shadow-md"
                        style={{ borderColor: '#C9A96E40', color: '#C9A96E' }}
                    >
                        ✍️ Escribir una reseña
                    </button>
                )}
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center py-8">
                    <span className="text-4xl block mb-3 opacity-30">💬</span>
                    <p className="text-charcoal/40 text-sm">Aún no hay reseñas para este producto.</p>
                    <p className="text-charcoal/30 text-xs mt-1">¡Sé el primero en compartir tu experiencia!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="p-5 rounded-xl transition-shadow hover:shadow-sm"
                            style={{ background: '#FFFFFF', border: '1px solid #E8E0D4' }}>
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                            style={{ background: '#C9A96E20', color: '#1B3B2D' }}>
                                            {review.user_name[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-forest">{review.user_name}</p>
                                            <p className="text-xs text-charcoal/40">
                                                {new Date(review.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <StarRating rating={review.rating} />
                                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                        style={{ background: '#1B3B2D10', color: '#1B3B2D' }}>
                                        ✓ Compra verificada
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-charcoal/80 leading-relaxed mt-3">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
