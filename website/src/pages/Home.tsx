import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleReviews from '../components/GoogleReviews';
import { getFeaturedProducts, getReels, type Product, type SocialReel } from '../lib/supabase';
import { usePageMeta } from '../hooks/usePageMeta';

const platformStyles: Record<string, { gradient: string; icon: React.ReactNode; label: string }> = {
    youtube: { gradient: 'from-red-600 to-red-800', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>, label: 'YouTube' },
    tiktok: { gradient: 'from-[#00f2ea] via-[#ff0050] to-[#7c3aed]', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>, label: 'TikTok' },
    instagram: { gradient: 'from-[#f09433] via-[#e6683c] to-[#bc1888]', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>, label: 'Instagram' },
};

function getThumbnailUrl(reel: SocialReel, thumbs: Record<string, string>): string | null {
    if (reel.thumbnail_url) return reel.thumbnail_url;
    if (thumbs[reel.id]) return thumbs[reel.id];
    if (reel.platform === 'youtube') {
        const match = reel.url.match(/(?:shorts\/|watch\?v=|youtu\.be\/)([\w-]{11})/);
        if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
    return null;
}

function ReelCard({
    reel,
    thumb,
    isReelsInView,
    isReelPaused,
    onNextReel,
    currentReelIndex
}: {
    reel: SocialReel;
    thumb: string | null;
    isReelsInView: boolean;
    isReelPaused: boolean;
    onNextReel: () => void;
    currentReelIndex: number;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const style = platformStyles[reel.platform] || platformStyles.instagram;
    const [isMuted, setIsMuted] = useState(true);
    const [isManualPaused, setIsManualPaused] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let playPromise: Promise<void> | undefined;

        if (isReelsInView && !isManualPaused) {
            // Extreme Autoplay Bypasses for strict Production Environments
            video.muted = isMuted;
            video.defaultMuted = true;
            if (isMuted) {
                video.setAttribute('muted', '');
            }

            playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch((e) => {
                    if (e.name !== 'AbortError') {
                        console.log("Autoplay prevented:", e.message);
                    }
                });
            }
        } else if (isManualPaused) {
            // Only pause if the user explicitly requested it
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    video.pause();
                }).catch(() => {
                    video.pause();
                });
            } else {
                video.pause();
            }
        }
    }, [isReelsInView, isManualPaused, currentReelIndex, isMuted]);

    return (
        <motion.div
            key={reel.id}
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="group absolute inset-0 cursor-pointer"
        >
            <div className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br ${style.gradient} shadow-2xl ring-2 ring-gold/30`}>
                {reel.video_url ? (
                    <>
                        <video
                            key={`video-${reel.id}-${currentReelIndex}`}
                            ref={(el) => {
                                // Assign to ref and strictly fix loop property on mount
                                (videoRef as any).current = el;
                                if (el) {
                                    el.loop = false;
                                    el.removeAttribute('loop');
                                    // Aggressively enforce muted for strict production autoplay policies
                                    el.muted = isMuted;
                                    el.defaultMuted = true;
                                    if (isMuted) el.setAttribute('muted', '');

                                    el.onended = () => {
                                        if (!el.dataset.ended) {
                                            el.dataset.ended = "true";
                                            onNextReel();
                                        }
                                    };
                                }
                            }}
                            src={reel.video_url}
                            playsInline
                            muted={isMuted}
                            autoPlay
                            loop={false}
                            crossOrigin="anonymous"
                            onTimeUpdate={(e) => {
                                const v = e.currentTarget;
                                // Limit reels to either their actual duration or 15 seconds max
                                const actualDuration = v.duration || 15;
                                const maxAllowed = Math.min(actualDuration, 15);

                                if (v.currentTime >= maxAllowed - 0.2 && !v.dataset.ended) {
                                    v.dataset.ended = "true";
                                    v.pause();
                                    onNextReel();
                                }
                            }}
                            className="reel-video absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 flex flex-col gap-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMuted(!isMuted); }}
                                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                            >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsManualPaused(!isManualPaused); }}
                                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                            >
                                {isManualPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {thumb && (
                            <img
                                src={thumb}
                                alt={reel.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
                        <a href={reel.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 text-white shadow-lg">
                                {style.icon}
                            </div>
                        </a>
                    </>
                )}

                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-black/40 backdrop-blur-sm">
                        <span className="w-3 h-3">{style.icon}</span> {style.label}
                    </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium leading-snug line-clamp-2">
                        {reel.title}
                    </p>
                </div>

                {!reel.video_url && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
                        <motion.div
                            className="h-full bg-gold"
                            initial={{ width: '0%' }}
                            animate={{ width: isReelPaused ? undefined : '100%' }}
                            transition={{ duration: 5, ease: 'linear' }}
                            key={`progress-${currentReelIndex}`}
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default function Home() {
    const [reels, setReels] = useState<SocialReel[]>([]);
    const [thumbs, setThumbs] = useState<Record<string, string>>({});
    const [currentReel, setCurrentReel] = useState(0);
    const [isReelPaused, setIsReelPaused] = useState(false);

    const reelsRef = useRef<HTMLDivElement>(null);
    const isReelsInView = useInView(reelsRef, { amount: 0.1 });

    // SEO: meta tags + JSON-LD Website + BreadcrumbList
    usePageMeta({
        title: 'J. Denis México | Academia y Tienda Profesional de Cejas y Pestañas',
        description: 'Formación profesional, insumos de laboratorio y técnicas avanzadas para lash lifting, extensiones y microblading. Más de 25 años de experiencia - J. Denis desde 1998.',
        canonical: 'https://jdenis.store',
        type: 'website',
        jsonLd: {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'WebSite',
                    '@id': 'https://jdenis.store/#website',
                    'url': 'https://jdenis.store',
                    'name': 'J. Denis México',
                    'description': 'Academia y tienda profesional de cejas y pestañas',
                    'potentialAction': {
                        '@type': 'SearchAction',
                        'target': 'https://jdenis.store/tienda?q={search_term_string}',
                        'query-input': 'required name=search_term_string',
                    },
                },
                {
                    '@type': 'Organization',
                    '@id': 'https://jdenis.store/#organization',
                    'name': 'J. Denis México',
                    'url': 'https://jdenis.store',
                    'foundingDate': '1998',
                    'description': 'Líderes en formación e insumos profesionales para cejas y pestañas en México.',
                    'sameAs': [
                        'https://www.instagram.com/jdenisoficial',
                        'https://www.facebook.com/jdenisoficial',
                    ],
                },
            ],
        },
    });

    // Bestsellers from Supabase
    const [bestsellers, setBestsellers] = useState<Product[]>([]);

    // Safari/Production Autoplay MEI (Media Engagement Index) Global Override
    // This monkey-patches the play method globally so the browser always sees "muted=true"
    // before evaluating its internal strict autoplay policies.
    useEffect(() => {
        const originalPlay = HTMLVideoElement.prototype.play;
        HTMLVideoElement.prototype.play = function () {
            this.muted = true;
            this.defaultMuted = true;
            this.setAttribute('muted', '');
            this.setAttribute('playsinline', '');
            return originalPlay.apply(this, arguments as any);
        };
        return () => {
            HTMLVideoElement.prototype.play = originalPlay;
        };
    }, []);

    // Favorites carousel state
    const [favSlide, setFavSlide] = useState(0);
    const [favPaused, setFavPaused] = useState(false);
    const favTotal = bestsellers.length;

    // Auto-rotate favorites every 4s
    useEffect(() => {
        if (favPaused || favTotal <= 1) return;
        const timer = setInterval(() => {
            setFavSlide(prev => (prev + 1) % favTotal);
        }, 4000);
        return () => clearInterval(timer);
    }, [favPaused, favTotal]);

    useEffect(() => {
        getReels(true).then(setReels).catch(console.error);
        getFeaturedProducts(12)
            .then(products => {
                const inStock = products.filter((p: Product) => p.stock === null || p.stock === undefined || p.stock >= 1);
                setBestsellers(inStock);
            })
            .catch(console.error);
    }, []);

    // Fetch oEmbed thumbnails for TikTok/Instagram reels
    useEffect(() => {
        if (reels.length === 0) return;
        const fetchThumbs = async () => {
            const map: Record<string, string> = {};
            await Promise.all(reels.map(async (reel) => {
                // Skip if already has thumbnail_url or is YouTube (handled statically)
                if (reel.thumbnail_url || reel.platform === 'youtube') return;
                try {
                    if (reel.platform === 'tiktok') {
                        const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(reel.url)}`);
                        if (res.ok) {
                            const data = await res.json();
                            if (data.thumbnail_url) map[reel.id] = data.thumbnail_url;
                        }
                    } else if (reel.platform === 'instagram') {
                        const res = await fetch(`https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(reel.url)}&access_token=public`);
                        if (res.ok) {
                            const data = await res.json();
                            if (data.thumbnail_url) map[reel.id] = data.thumbnail_url;
                        }
                    }
                } catch { /* silently skip failed fetches */ }
            }));
            if (Object.keys(map).length > 0) setThumbs(map);
        };
        fetchThumbs();
    }, [reels]);

    // Auto-rotate reels every 5 seconds (only for external link reels)
    useEffect(() => {
        if (reels.length <= 1 || isReelPaused || !isReelsInView) return;

        const currentHasVideo = reels[currentReel]?.video_url;
        if (currentHasVideo) return; // Wait for onEnded event of the video

        const timer = setInterval(() => {
            setCurrentReel(prev => (prev + 1) % reels.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [reels.length, isReelPaused, isReelsInView, currentReel, reels]);

    // Removed top-level querySelectorAll video playback effect; handled in ReelCard component now.



    return (
        <div className="min-h-screen bg-cream">
            {/* HERO SECTION - ACADEMIA FOCUS */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background Video */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/hero-products.jpg"
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/videos/Video_con_logo_J_DENIS.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/40 to-transparent" />
                <div className="absolute inset-0 botanical-pattern opacity-20" />

                <div className="hero-content relative z-10 pt-28 md:pt-40">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        {/* Badge pill */}
                        <span className="hero-badge">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block flex-shrink-0" />
                            Academia J. Denis — Desde 1998
                        </span>

                        {/* Headline — Perandory / Cormorant Garamond */}
                        <h1
                            className="hero-title"
                            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                        >
                            Certifícate con la
                            <br />
                            <span className="text-gold">Pionera de México</span>
                        </h1>

                        {/* Subtitle — simple, no jargon */}
                        <p className="hero-subtitle">
                            Cursos de cejas y pestañas con técnica profesional,
                            constancia oficial y grupos reducidos en CDMX.
                        </p>

                        {/* Credential chips */}
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10 text-cream/75 text-sm font-sans">
                            {['+5,000 certificadas', 'CDMX · grupos pequeños', 'Cert. oficial STPS'].map((s) => (
                                <span key={s} className="flex items-center gap-1.5">
                                    <span className="w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center bg-gold rounded-full">
                                        <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    {s}
                                </span>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/academia" className="btn btn-secondary group">
                                Ver Próximos Cursos
                                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link to="/tienda" className="btn btn-outline-light">
                                Ver Tienda
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CATEGORY EXPLORER */}
            <section
                aria-label="Explorador de categorías de tienda"
                className="py-8 relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #f8f9fc 0%, #ffffff 60%, #f0f4fa 100%)', borderTop: '1px solid rgba(10,24,71,0.08)', borderBottom: '1px solid rgba(10,24,71,0.08)' }}
            >
                <div className="container-luxury">
                    {/* Header */}
                    <div className="mb-4">
                        <h2 className="font-serif text-xl leading-tight" style={{ color: '#0a1847' }}>Explora por Categoría</h2>
                    </div>

                    {/* max-h: mobile 38px×3+10px×2=134, 4ª fila en 144 → usamos 140. desktop 42px×3+10×2=146, 4ª en 156 → usamos 152 */}
                    <div
                        className="flex flex-wrap justify-center gap-2.5 overflow-hidden max-h-[140px] md:max-h-[152px]"
                    >
                        {[
                            { id: 'lash-lifting',      name: 'Lash Lifting',      icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
                            { id: 'brow-henna',          name: 'Brow Henna',        icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z' },
                            { id: 'cejas',               name: 'Diseño de Cejas',   icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42' },
                            { id: 'extensiones',         name: 'Extensiones',       icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' },
                            { id: 'microblading',        name: 'Microblading',      icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10' },
                            { id: 'pigmentos',           name: 'Pigmentos',         icon: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z' },
                            { id: 'lash-curling',        name: 'Lash Curling',      icon: 'M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3' },
                            { id: 'pestanas-en-tira',    name: 'Pestañas en Tira',  icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
                            { id: 'adhesivos',           name: 'Adhesivos',         icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 5.608a2.25 2.25 0 01-2.024 2.842 47.28 47.28 0 01-6.178.326 47.28 47.28 0 01-6.178-.326 2.25 2.25 0 01-2.024-2.842L5 14.5' },
                            { id: 'tratamientos',        name: 'Tratamientos',      icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
                            { id: 'herramientas',        name: 'Herramientas',      icon: 'M11.42 15.17l-5.384 5.384a2.625 2.625 0 01-3.712-3.712l5.384-5.384M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.025 1.193-.14 1.743' },
                            { id: 'accesorios',          name: 'Accesorios',        icon: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18' },
                            { id: 'higiene',             name: 'Higiene',           icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
                        ].map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/tienda?cat=${cat.id}`}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full font-sans font-medium transition-all duration-200 group hover:shadow-md"
                                style={{ background: '#ffffff', border: '1px solid rgba(10,24,71,0.12)', color: '#0a1847', whiteSpace: 'nowrap' }}
                            >
                                <svg className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: '#1a3a8a' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                                </svg>
                                <span className="text-xs md:text-sm">{cat.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Ver todas — link SEO debajo */}
                    <div className="mt-4">
                        <Link
                            to="/tienda"
                            className="inline-flex items-center gap-1.5 text-xs font-sans transition-opacity hover:opacity-60"
                            style={{ color: '#1a3a8a' }}
                        >
                            Ver todas las categorías de la tienda
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>


            {/* DISTRIBUIDORES CTA */}

            {/* DISTRIBUIDORES CTA — Blue premium */}
            <section className="section relative overflow-hidden min-h-screen flex flex-col justify-center" style={{ background: 'linear-gradient(145deg, #0a1f5c 0%, #1a3a8a 35%, #1e4499 65%, #0f2660 100%)' }}>
                {/* Background image soft overlay */}
                <div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{ backgroundImage: 'url(/hero-products.jpg)', opacity: 0.08 }}
                />
                {/* Gradient overlays for premium depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f5c]/80 via-transparent to-[#0a1f5c]/40" />
                {/* Radial sky-blue glow center */}
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(58,163,216,0.15) 0%, transparent 70%)' }} />
                {/* Gold accent lines */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4a832]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4a832]/60 to-transparent" />

                <div className="container-luxury relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        {/* Badge */}
                        <span className="hero-badge badge-light inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/30 text-white/80 text-[11px] font-sans font-semibold tracking-[0.22em] uppercase mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a832] inline-block flex-shrink-0" />
                            Fabricante de Cosméticos
                        </span>

                        {/* Headline */}
                        <h2
                            className="text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.08] font-bold mb-6 text-white tracking-[-0.02em]"
                            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                        >
                            Registro para ser distribuidor{' '}
                            <span style={{
                                background: 'linear-gradient(90deg, #d4a832 0%, #f5d281 50%, #d4a832 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>de cosméticos</span>
                        </h2>

                        {/* Subtitle */}
                        <p className="text-white/65 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto font-sans">
                            Lleva J. Denis a tu ciudad. Obtén precios de mayoreo, material
                            de apoyo y el respaldo de una marca con{' '}
                            <strong className="text-white/90 font-semibold">+25 años en el mercado</strong>.
                        </p>

                        {/* Benefits inline chips */}
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-12 text-white/65 text-sm font-sans">
                            {[
                                'Precios de mayoreo exclusivos',
                                '+80 productos certificados',
                                'Soporte de ventas incluido',
                                'Sin cuota mensual fija',
                            ].map((item) => (
                                <span key={item} className="flex items-center gap-2">
                                    <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center bg-[#d4a832] rounded-full">
                                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    {item}
                                </span>
                            ))}
                        </div>

                        {/* Single CTA Button */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/registro-distribuidor"
                                className="group inline-flex items-center gap-3 px-10 py-[14px] rounded-full font-semibold text-white text-[15px] tracking-wide transition-all duration-300 hover:scale-[1.03]"
                                style={{
                                    background: 'linear-gradient(135deg, #1e4499 0%, #3aa3d8 100%)',
                                    boxShadow: '0 4px 24px rgba(58,163,216,0.40)'
                                }}
                            >
                                Quiero ser Distribuidor
                                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* BESTSELLERS - ROTATING GALLERY */}

            <section className="section py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-cream via-cream-dark/30 to-cream">
                {/* Decorative accents */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute top-1/3 left-0 w-48 h-48 bg-forest/5 rounded-full blur-3xl -translate-x-1/2" />

                <div className="container-luxury relative z-10">
                    <div className="section-header mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="section-title">Favoritos de la Marca</h2>
                        </motion.div>
                    </div>

                    {/* Rotating Carousel */}
                    <div
                        className="relative"
                        onMouseEnter={() => setFavPaused(true)}
                        onMouseLeave={() => setFavPaused(false)}
                    >
                        {/* Prev / Next arrows */}
                        <button
                            onClick={() => setFavSlide(prev => (prev - 1 + favTotal) % favTotal)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 shadow-lg backdrop-blur-sm flex items-center justify-center text-forest hover:bg-gold hover:text-forest transition-all duration-300 hover:scale-110"
                            aria-label="Anterior"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setFavSlide(prev => (prev + 1) % favTotal)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 shadow-lg backdrop-blur-sm flex items-center justify-center text-forest hover:bg-gold hover:text-forest transition-all duration-300 hover:scale-110"
                            aria-label="Siguiente"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>

                        {/* Carousel track */}
                        <div className="overflow-hidden mx-6 sm:mx-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={favSlide}
                                    initial={{ opacity: 0, x: 80 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -80 }}
                                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                                    className="w-full"
                                >
                                    {(() => {
                                        const product = bestsellers[favSlide];
                                        if (!product) return (
                                            <div className="max-w-4xl mx-auto bg-white/50 animate-pulse rounded-lg h-[420px] flex items-center justify-center">
                                                <p className="text-charcoal/40 text-sm">Cargando favoritos…</p>
                                            </div>
                                        );
                                        const rankLabels = [
                                            '#1 Más Vendido',
                                            '#2 Top Favorito',
                                            '#3 Imprescindible',
                                            '#4 Profesional',
                                            '#5 Trending',
                                            '#6 Básico Pro',
                                        ];
                                        return (
                                            <Link
                                                to={`/producto/${product.id}`}
                                                className="group relative block overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 max-w-4xl mx-auto"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2">
                                                    {/* Image side */}
                                                    <div className="relative overflow-hidden bg-cream-dark aspect-square md:aspect-auto md:min-h-[420px]">
                                                        <img
                                                            src={product.image_url || '/placeholder.webp'}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                        {/* Gradient overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-forest/30" />

                                                        {/* Rank Badge */}
                                                        <div className="absolute top-4 left-4 z-10">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase shadow-lg ${favSlide === 0
                                                                ? 'bg-gradient-to-r from-gold to-gold-light text-forest'
                                                                : 'bg-white/90 backdrop-blur-sm text-forest'
                                                                }`}>
                                                                {favSlide === 0 && (
                                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                                                )}
                                                                {rankLabels[favSlide]}
                                                            </span>
                                                        </div>

                                                        {/* Category pill */}
                                                        <div className="absolute top-4 right-4 z-10">
                                                            <span className="px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase bg-black/30 backdrop-blur-sm text-white/90 rounded-full">
                                                                {product.category}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Info side */}
                                                    <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                                                        <span className="text-[11px] text-charcoal/40 uppercase tracking-[0.2em] mb-2 block">{product.category}</span>
                                                        <h3 className="font-serif text-2xl md:text-3xl text-forest leading-tight mb-4 group-hover:text-gold transition-colors duration-300">
                                                            {product.name}
                                                        </h3>
                                                        {product.description && (
                                                            <p className="text-charcoal/60 text-sm leading-relaxed mb-6 line-clamp-3">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-kraft/20">
                                                            <p className="text-forest font-semibold text-2xl">
                                                                ${product.price.toLocaleString()} <span className="text-charcoal/40 text-sm font-normal">MXN</span>
                                                            </p>
                                                            <span className="inline-flex items-center gap-2 text-gold text-sm font-medium group-hover:gap-3 transition-all">
                                                                Ver producto
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Dots navigation */}
                        <div className="flex items-center justify-center gap-2 mt-8">
                            {bestsellers.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setFavSlide(i)}
                                    className={`transition-all duration-300 rounded-full ${i === favSlide
                                        ? 'w-8 h-2.5 bg-gold shadow-md'
                                        : 'w-2.5 h-2.5 bg-charcoal/20 hover:bg-charcoal/40'
                                        }`}
                                    aria-label={`Producto ${i + 1}`}
                                />
                            ))}
                        </div>

                        {/* Counter */}
                        <p className="text-charcoal/30 text-xs mt-3 tracking-wider text-center">
                            {favSlide + 1} / {favTotal}
                        </p>
                    </div>

                    <div className="text-center mt-14">
                        <Link to="/tienda" className="btn btn-outline">
                            Ver Todo el Catálogo
                        </Link>
                    </div>
                </div>
            </section>

            {/* REELS & TIKTOKS GALLERY */}
            {reels.length > 0 && (
                <section ref={reelsRef} className="section relative overflow-hidden min-h-screen flex flex-col justify-center" style={{ background: 'linear-gradient(160deg, #0b1847 0%, #0d1e55 35%, #112068 65%, #0a1640 100%)' }}>
                    {/* Grain / cinematic texture overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.35] pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                            backgroundSize: '200px 200px',
                        }}
                    />
                    {/* Subtle vignette */}
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
                    {/* Very subtle gold top line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a832]/30 to-transparent" />

                    <div className="container-luxury relative z-10">
                        <div className="section-header">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="font-serif text-3xl md:text-4xl text-cream mb-3">
                                    Tendencias <span className="text-[#d4a832]">#JDenis</span>
                                </h2>
                                <p className="text-cream/50 text-sm uppercase tracking-[0.2em] font-sans">
                                    Tutoriales, tips y tendencias en cejas y pestañas
                                </p>
                            </motion.div>
                        </div>

                        {/* Auto-rotating centered carousel + touch swipe */}
                        <div
                            className="flex flex-col items-center"
                            onMouseEnter={() => setIsReelPaused(true)}
                            onMouseLeave={() => setIsReelPaused(false)}
                            onTouchStart={(e) => {
                                const touch = e.touches[0];
                                (e.currentTarget as HTMLDivElement & { _swipeStartX?: number })._swipeStartX = touch.clientX;
                            }}
                            onTouchEnd={(e) => {
                                const startX = (e.currentTarget as HTMLDivElement & { _swipeStartX?: number })._swipeStartX;
                                if (startX === undefined) return;
                                const deltaX = e.changedTouches[0].clientX - startX;
                                if (Math.abs(deltaX) > 50) {
                                    if (deltaX < 0) {
                                        setCurrentReel(prev => (prev + 1) % reels.length);
                                    } else {
                                        setCurrentReel(prev => (prev - 1 + reels.length) % reels.length);
                                    }
                                }
                            }}
                        >
                            <div className="relative w-[370px] sm:w-[430px] md:w-[500px] aspect-[9/16]">
                                <AnimatePresence mode="wait">
                                    {reels.length > 0 && (() => {
                                        const reel = reels[currentReel];
                                        const thumb = getThumbnailUrl(reel, thumbs);
                                        return (
                                            <ReelCard
                                                key={`${reel.id}-${currentReel}`}
                                                reel={reel}
                                                thumb={thumb}
                                                isReelsInView={isReelsInView}
                                                isReelPaused={isReelPaused}
                                                currentReelIndex={currentReel}
                                                onNextReel={() => {
                                                    setCurrentReel(prev => (prev + 1) % reels.length);
                                                }}
                                            />
                                        );
                                    })()}
                                </AnimatePresence>
                            </div>

                            {/* Navigation dots */}
                            <div className="flex items-center gap-2 mt-6">
                                {reels.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentReel(i)}
                                        className={`transition-all duration-300 rounded-full ${i === currentReel
                                            ? 'w-8 h-2 bg-gold'
                                            : 'w-2 h-2 bg-cream/30 hover:bg-cream/50'
                                            }`}
                                        aria-label={`Ver reel ${i + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Counter */}
                            <p className="text-cream/40 text-xs mt-3 tracking-wider">
                                {currentReel + 1} / {reels.length}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* GOOGLE REVIEWS */}
            <GoogleReviews />

            {/* CTA FINAL - DYNAMIC SECTION */}
            <section className="section relative overflow-hidden bg-forest">
                {/* Dynamic pattern overlay */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gold/40 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/30 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
                    <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gold/20 rounded-full blur-2xl" />
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                <div className="container-luxury relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/40 text-gold text-sm font-medium mb-6">
                            Únete a +5,000 profesionales
                        </span>
                        <h2 className="font-serif text-4xl lg:text-5xl text-cream mb-6 leading-tight">
                            ¿Lista para elevar tu carrera profesional?
                        </h2>
                        <p className="text-cream/60 text-lg max-w-xl mx-auto mb-10">
                            Accede a productos premium con precios especiales para profesionales
                            y distribuye la marca líder en tu zona.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/tienda" className="btn btn-secondary">
                                Ver Productos
                            </Link>
                            <Link to="/registro-distribuidor" className="btn btn-outline-light">
                                Registro Distribuidor
                            </Link>
                        </div>
                        <p className="text-cream/40 text-sm mt-8">
                            <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg> ¿Dudas? <a href="https://wa.me/525527271067" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Escríbenos por WhatsApp</a>
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
