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
                    style={{ color: star <= (hover || rating) ? 'var(--color-gold, #D4AF37)' : '#D1D5DB' }}
                >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                </button>
            ))}
        </div>
    );
}

function AverageRatingBadge({ reviews }: { reviews: ProductReview[] }) {
    if (reviews.length === 0) return null;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return (
        <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-forest/5 border border-forest/10">
            <span className="text-3xl font-bold text-forest">{avg.toFixed(1)}</span>
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
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold" />
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
                    <div className="p-5 rounded-xl text-center" style={{ background: '#17204D10', border: '1px solid #17204D20' }}>
                        <svg className="w-8 h-8 mx-auto mb-2 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="font-medium text-forest">¡Gracias por tu reseña!</p>
                        <p className="text-sm text-charcoal/60 mt-1">Tu comentario será revisado por nuestro equipo antes de publicarse.</p>
                    </div>
                ) : !isAuthenticated ? (
                    <div className="p-5 rounded-xl text-center bg-forest/5 border border-forest/10">
                        <svg className="w-8 h-8 mx-auto mb-2 text-charcoal/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        <p className="text-sm text-charcoal/70 mb-3">Inicia sesión para dejar una reseña</p>
                        <Link to="/login" className="inline-block px-6 py-2 text-sm font-medium rounded-lg transition-all hover:shadow-md bg-gold text-forest hover:bg-gold-light">
                            Iniciar Sesión
                        </Link>
                    </div>
                ) : checkingPurchase ? (
                    <div className="p-5 rounded-xl text-center" style={{ background: '#F0F3FA' }}>
                        <p className="text-sm text-charcoal/60">Verificando tu compra...</p>
                    </div>
                ) : !canReview ? (
                    <div className="p-5 rounded-xl text-center bg-forest/5 border border-forest/10">
                        <svg className="w-8 h-8 mx-auto mb-2 text-charcoal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                        <p className="text-sm text-charcoal/70">Solo los compradores verificados de <strong>{productName}</strong> pueden escribir reseñas.</p>
                        <p className="text-xs text-charcoal/40 mt-2">Compra este producto para dejar tu opinión</p>
                    </div>
                ) : showForm ? (
                    <form onSubmit={handleSubmit} className="p-5 rounded-xl space-y-4 bg-white border border-forest/10 shadow-sm">
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
                                style={{ border: '1px solid #E0E4ED', background: '#FAFAFE' }}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={submitting || rating === 0}
                                className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-all hover:shadow-md disabled:opacity-50 bg-gold text-forest hover:bg-gold-light"
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
                        className="w-full py-3 text-sm font-medium rounded-xl border-2 transition-all hover:shadow-md border-gold/40 text-forest hover:border-gold hover:bg-gold/5"
                    >
                        <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg> Escribir una reseña
                    </button>
                )}
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center py-8">
                    <svg className="w-10 h-10 mx-auto mb-3 text-charcoal/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
                    <p className="text-charcoal/40 text-sm">Aún no hay reseñas para este producto.</p>
                    <p className="text-charcoal/30 text-xs mt-1">¡Sé el primero en compartir tu experiencia!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="p-5 rounded-xl transition-shadow hover:shadow-sm"
                            style={{ background: '#FFFFFF', border: '1px solid #E0E4ED' }}>
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gold/20 text-forest">
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
                                        style={{ background: '#17204D10', color: '#17204D' }}>
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
