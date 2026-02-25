import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { getAllReviews, moderateReview, type ProductReview } from '../../lib/supabase';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: '#FEF3C7', text: '#92400E', label: 'Pendiente' },
    approved: { bg: '#D1FAE5', text: '#065F46', label: 'Aprobada' },
    rejected: { bg: '#FEE2E2', text: '#991B1B', label: 'Rechazada' },
};

export default function ReviewModeration() {
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterStatus>('pending');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllReviews(filter === 'all' ? undefined : filter);
            setReviews(data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleModerate = async (reviewId: string, status: 'approved' | 'rejected') => {
        setActionLoading(reviewId);
        try {
            await moderateReview(reviewId, status);
            // Update local state
            setReviews(prev => prev.map(r =>
                r.id === reviewId ? { ...r, status } : r
            ));
        } catch (err) {
            console.error('Error moderating review:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const pendingCount = reviews.filter(r => r.status === 'pending').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg> Moderación de Reseñas
                        {pendingCount > 0 && (
                            <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">
                                {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Revisa y aprueba las reseñas de productos antes de que sean visibles al público</p>
                </div>
                <button
                    onClick={fetchReviews}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>Actualizar
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {([
                    { value: 'pending', label: 'Pendientes', color: 'amber' },
                    { value: 'approved', label: 'Aprobadas', color: 'green' },
                    { value: 'rejected', label: 'Rechazadas', color: 'red' },
                    { value: 'all', label: 'Todas', color: 'gray' },
                ] as { value: FilterStatus; label: string; color: string }[]).map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === f.value
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200 border shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 border border-transparent'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500" />
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                    <span className="block mb-4"><svg className="w-12 h-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V18z" /></svg></span>
                    <p className="text-gray-400 text-lg">No hay reseñas {filter !== 'all' ? STATUS_COLORS[filter]?.label.toLowerCase() + 's' : ''}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => {
                        const statusInfo = STATUS_COLORS[review.status] || STATUS_COLORS.pending;
                        const isLoading = actionLoading === review.id;

                        return (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Left: Review Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                {review.user_name[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{review.user_name}</p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(review.created_at).toLocaleDateString('es-MX', {
                                                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <span key={s} className="text-base"><svg className="w-4 h-4 inline" fill={s <= review.rating ? '#F59E0B' : '#D1D5DB'} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></span>
                                                ))}
                                            </div>
                                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                style={{ background: statusInfo.bg, color: statusInfo.text }}>
                                                {statusInfo.label}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 px-2 py-2 rounded-lg bg-gray-50 mb-2">
                                            "{review.comment}"
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            <strong>Producto:</strong> {review.product_id}
                                        </p>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                        {review.status === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleModerate(review.id, 'approved')}
                                                    disabled={isLoading}
                                                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50 hover:shadow-md"
                                                    style={{ background: '#D1FAE5', color: '#065F46' }}
                                                >
                                                    {isLoading ? '...' : <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>Aprobar</>}
                                                </button>
                                                <button
                                                    onClick={() => handleModerate(review.id, 'rejected')}
                                                    disabled={isLoading}
                                                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50 hover:shadow-md"
                                                    style={{ background: '#FEE2E2', color: '#991B1B' }}
                                                >
                                                    {isLoading ? '...' : <><svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>Rechazar</>}
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleModerate(review.id, review.status === 'approved' ? 'rejected' : 'approved')}
                                                disabled={isLoading}
                                                className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            >
                                                {isLoading ? '...' : review.status === 'approved' ? '↩ Revocar' : '↩ Aprobar'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
