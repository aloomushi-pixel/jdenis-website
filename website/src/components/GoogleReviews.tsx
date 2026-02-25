import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Real reviews from Google Maps (JJD Oficina / J.Denis) ────────
interface GoogleReview {
    name: string;
    rating: number;
    text: string;
    date: string;
    isLocalGuide?: boolean;
    contributions?: number;
}

const REVIEWS: GoogleReview[] = [
    {
        name: 'Deny Sol',
        rating: 5,
        text: 'La mejor academia de México especialista en Cejas y Pestañas. Yo vine desde Perú a capacitarme en Cejas HD y son lo máximo... Soliciten a la profe Lorena es una Master en Cejas y Pestañas',
        date: 'Hace 6 años',
    },
    {
        name: 'Abraham Camacho',
        rating: 5,
        text: 'Buena atención buenos productos la calidad acorde a los precios y si algo sale mal la atención se vuelve personalizada eso te hace regresar',
        date: 'Hace 6 años',
    },
    {
        name: 'Jenn Alexa',
        rating: 5,
        text: 'Todo lo necesario para Lashistas, precios super accesibles! Además de que no hay compra mínima, puedes comprar desde una sola pieza y sigue siendo económico!',
        date: 'Hace 6 años',
    },
    {
        name: 'Guille Gomez Au.',
        rating: 5,
        text: 'Excelente lugar para comprar productos especializados en cejas y pestañas. Buena calidad y precios competitivos.',
        date: 'Hace 5 años',
    },
    {
        name: 'Angelica Sanchez',
        rating: 5,
        text: 'Llegar al lugar es complicado si es hora pico, pero la atención de las personas de la empresa es muy buena y eficiente. Hay buen lugar de estacionamiento.',
        date: 'Hace 3 años',
    },
    {
        name: 'Eduardo Hernandez',
        rating: 5,
        text: 'Muy atentos, muy buenos productos, muy buenos precios, me queda algo lejos pero la verdad vale mucho la pena',
        date: 'Hace 4 años',
    },
    {
        name: 'Antonio Tinoco de la Garza',
        rating: 5,
        text: 'Atención rápida y precisa. Personal muy profesional.',
        date: 'Hace 4 años',
    },
    {
        name: 'Martin Landeros',
        rating: 5,
        text: 'Excelente trato por parte de los que reciben',
        date: 'Hace 4 años',
    },
    {
        name: 'Sandra Lorena Soriano',
        rating: 5,
        text: 'Buen lugar, excelente atención y excelente productos',
        date: 'Hace 9 años',
        isLocalGuide: true,
        contributions: 12,
    },
    {
        name: 'Estela Alvarez',
        rating: 5,
        text: 'Hay muchas cosas y a excelentes precios',
        date: 'Hace 5 años',
    },
    {
        name: 'Guadalupe Muñoz Fernandez',
        rating: 5,
        text: 'Muy buen producto cosmético profesional',
        date: 'Hace 7 años',
        isLocalGuide: true,
        contributions: 45,
    },
    {
        name: 'Carlos Friki',
        rating: 5,
        text: 'Empresa en expansión de productos de belleza',
        date: 'Hace 8 años',
    },
    {
        name: 'Angel Respetado',
        rating: 5,
        text: 'La atención. Genial. Excelente !!!',
        date: 'Hace 8 años',
    },
    {
        name: 'Sonia Salazar',
        rating: 5,
        text: 'Excelente servicio',
        date: 'Hace 8 años',
    },
    {
        name: 'Cesar Barry',
        rating: 5,
        text: 'Actitud !!! Solo eso!',
        date: 'Hace 4 años',
    },
    {
        name: 'Ricardo Aguilar',
        rating: 5,
        text: 'Excelentes productos y buen servicio al cliente',
        date: 'Hace 7 años',
        isLocalGuide: true,
        contributions: 95,
    },
    {
        name: 'Cecilia Del Campo',
        rating: 5,
        text: 'Muy recomendable, excelente calidad en todos sus productos',
        date: 'Hace 7 años',
        isLocalGuide: true,
        contributions: 36,
    },
    {
        name: 'Ana Márquez',
        rating: 5,
        text: 'Buenos productos y atención rápida',
        date: 'Hace 7 años',
        isLocalGuide: true,
        contributions: 76,
    },
    {
        name: 'Jessica Vázquez',
        rating: 5,
        text: 'Excelente todo 😜',
        date: 'Hace 6 años',
    },
    {
        name: 'Berenice Mach',
        rating: 5,
        text: 'Muy buen lugar y excelentes precios',
        date: 'Hace 5 años',
    },
];

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/16NKbc3J7NHh5W2P6';
const OVERALL_RATING = 4.0;
const TOTAL_REVIEWS = 65;
const DISPLAY_COUNT = 10; // Show only this many reviews per page load

/** Fisher-Yates shuffle — returns a new shuffled copy */
function shuffleArray<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// ─── Google avatar color palette (same colors Google uses) ────────
const AVATAR_COLORS = [
    '#1A73E8', '#EA4335', '#FBBC04', '#34A853', '#FF6D01',
    '#46BDC6', '#7B1FA2', '#C2185B', '#00897B', '#3949AB',
];

function getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
}

// ─── Star Rating ──────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
    return (
        <div className="google-reviews__stars" aria-label={`${count} de 5 estrellas`}>
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} viewBox="0 0 24 24" className={`google-reviews__star ${i <= count ? 'google-reviews__star--filled' : ''}`}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    );
}

// ─── Google "G" logo SVG ──────────────────────────────────────────
function GoogleLogo() {
    return (
        <svg viewBox="0 0 24 24" className="google-reviews__google-logo">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

// ─── Overall rating display with partial star fill ────────────────
function OverallStars({ rating }: { rating: number }) {
    return (
        <div className="google-reviews__overall-stars">
            {[1, 2, 3, 4, 5].map(i => {
                const fill = Math.min(1, Math.max(0, rating - (i - 1)));
                return (
                    <svg key={i} viewBox="0 0 24 24" className="google-reviews__overall-star">
                        <defs>
                            <linearGradient id={`star-grad-${i}`}>
                                <stop offset={`${fill * 100}%`} stopColor="#FBBC04" />
                                <stop offset={`${fill * 100}%`} stopColor="#DADCE0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            fill={`url(#star-grad-${i})`}
                        />
                    </svg>
                );
            })}
        </div>
    );
}

// ─── Review Card ──────────────────────────────────────────────────
function ReviewCard({ review }: { review: GoogleReview }) {
    const color = getAvatarColor(review.name);
    return (
        <div className="google-reviews__card">
            {/* Header */}
            <div className="google-reviews__card-header">
                <div className="google-reviews__avatar" style={{ backgroundColor: color }}>
                    {getInitial(review.name)}
                </div>
                <div className="google-reviews__card-meta">
                    <span className="google-reviews__reviewer-name">{review.name}</span>
                    {review.isLocalGuide && (
                        <span className="google-reviews__local-guide">
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="#1A73E8">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            Local Guide · {review.contributions} opiniones
                        </span>
                    )}
                </div>
            </div>
            {/* Rating + date */}
            <div className="google-reviews__rating-row">
                <Stars count={review.rating} />
                <span className="google-reviews__date">{review.date}</span>
            </div>
            {/* Review text */}
            <p className="google-reviews__text">{review.text}</p>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────
export default function GoogleReviews() {
    // Pick a random subset of DISPLAY_COUNT reviews once per mount
    const displayReviews = useMemo(
        () => shuffleArray(REVIEWS).slice(0, DISPLAY_COUNT),
        [] // only on mount — each page load gets a fresh random set
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [cardsPerView, setCardsPerView] = useState(3);
    const trackRef = useRef<HTMLDivElement>(null);

    // Responsive cards per view
    useEffect(() => {
        const updateCards = () => {
            if (window.innerWidth < 640) setCardsPerView(1);
            else if (window.innerWidth < 1024) setCardsPerView(2);
            else setCardsPerView(3);
        };
        updateCards();
        window.addEventListener('resize', updateCards);
        return () => window.removeEventListener('resize', updateCards);
    }, []);

    // Auto-scroll every 5s
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % displayReviews.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isPaused, displayReviews.length]);

    // Build the visible window (with wrap-around for infinite loop)
    const getVisibleReviews = () => {
        const visible: { review: GoogleReview; index: number }[] = [];
        for (let i = 0; i < cardsPerView; i++) {
            const idx = (currentIndex + i) % displayReviews.length;
            visible.push({ review: displayReviews[idx], index: idx });
        }
        return visible;
    };

    return (
        <section
            className="google-reviews"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="google-reviews__container">
                {/* ── Header Bar ────────────────────────── */}
                <div className="google-reviews__header">
                    <div className="google-reviews__header-left">
                        <GoogleLogo />
                        <div className="google-reviews__header-info">
                            <h2 className="google-reviews__title">Reseñas en Google</h2>
                            <div className="google-reviews__summary">
                                <span className="google-reviews__rating-number">{OVERALL_RATING.toFixed(1)}</span>
                                <OverallStars rating={OVERALL_RATING} />
                                <a
                                    href={GOOGLE_MAPS_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="google-reviews__count-link"
                                >
                                    {TOTAL_REVIEWS} reseñas
                                </a>
                            </div>
                        </div>
                    </div>
                    <a
                        href={GOOGLE_MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="google-reviews__write-btn"
                    >
                        Escribir una reseña
                    </a>
                </div>

                {/* ── Carousel ──────────────────────────── */}
                <div className="google-reviews__carousel" ref={trackRef}>
                    <AnimatePresence mode="popLayout">
                        <div className="google-reviews__track" key={currentIndex}>
                            {getVisibleReviews().map(({ review, index }) => (
                                <motion.div
                                    key={`${index}-${currentIndex}`}
                                    className="google-reviews__slide"
                                    initial={{ opacity: 0, x: 80 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -80 }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                >
                                    <ReviewCard review={review} />
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                </div>

                {/* ── Dots ──────────────────────────────── */}
                <div className="google-reviews__dots">
                    {displayReviews.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`google-reviews__dot ${i === currentIndex ? 'google-reviews__dot--active' : ''}`}
                            aria-label={`Ir a reseña ${i + 1}`}
                        />
                    ))}
                </div>

                {/* ── Powered by Google ─────────────────── */}
                <div className="google-reviews__powered">
                    <GoogleLogo />
                    <span>Reseñas verificadas de Google</span>
                </div>
            </div>
        </section>
    );
}
