import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bestsellers } from '../data/products';
import { getReels, type SocialReel } from '../lib/supabase';

export default function Home() {
    const [reels, setReels] = useState<SocialReel[]>([]);
    const [thumbs, setThumbs] = useState<Record<string, string>>({});
    const [currentReel, setCurrentReel] = useState(0);
    const [isReelPaused, setIsReelPaused] = useState(false);

    useEffect(() => {
        getReels(true).then(setReels).catch(console.error);
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

    // Auto-rotate reels every 3 seconds
    useEffect(() => {
        if (reels.length <= 1 || isReelPaused) return;
        const timer = setInterval(() => {
            setCurrentReel(prev => (prev + 1) % reels.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [reels.length, isReelPaused]);

    const platformStyles: Record<string, { gradient: string; icon: React.ReactNode; label: string }> = {
        youtube: { gradient: 'from-red-600 to-red-800', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>, label: 'YouTube' },
        tiktok: { gradient: 'from-[#00f2ea] via-[#ff0050] to-[#7c3aed]', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>, label: 'TikTok' },
        instagram: { gradient: 'from-[#f09433] via-[#e6683c] to-[#bc1888]', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>, label: 'Instagram' },
    };

    function getThumbnailUrl(reel: SocialReel): string | null {
        if (reel.thumbnail_url) return reel.thumbnail_url;
        if (thumbs[reel.id]) return thumbs[reel.id];
        if (reel.platform === 'youtube') {
            const match = reel.url.match(/(?:shorts\/|watch\?v=|youtu\.be\/)([\w-]{11})/);
            if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
        }
        return null;
    }

    return (
        <div className="min-h-screen bg-cream">
            {/* HERO SECTION - BOTANICAL APOTHECARY */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
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
                {/* Stronger overlay for text readability */}
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/50 to-transparent" />
                {/* Subtle botanical pattern overlay */}
                <div className="absolute inset-0 botanical-pattern opacity-20" />

                <div className="hero-content relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <span className="hero-badge">Desde 1998</span>
                        <h1 className="hero-title">
                            El Arte de la<br />
                            <span className="text-gold">Mirada Perfecta</span>
                        </h1>
                        <p className="hero-subtitle">
                            Fórmulas de laboratorio con ingredientes naturales para profesionales
                            que buscan resultados extraordinarios.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/tienda" className="btn btn-secondary">
                                Ver Productos
                            </Link>
                            <Link to="/registro-distribuidor" className="btn btn-outline-light">
                                Registro Distribuidor
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* LEGACY STRIP */}
            <section className="legacy-strip">
                <div className="container-luxury">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                value: 'Desde 1998',
                                label: 'Pioneros en México',
                                description: 'Primera marca mexicana especializada en cejas y pestañas profesionales'
                            },
                            {
                                value: 'Patentes Propias',
                                label: 'Técnicas Certificadas',
                                description: 'Métodos exclusivos desarrollados y patentados por nuestro laboratorio'
                            },
                            {
                                value: '100% Mexicano',
                                label: 'Manufactura Nacional',
                                description: 'Control de calidad total en nuestras instalaciones de CDMX'
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="legacy-card"
                            >
                                <span className="text-gold text-xl font-serif font-semibold block">{stat.value}</span>
                                <p className="text-cream/80 text-sm font-medium mt-1 mb-2">{stat.label}</p>
                                <p className="text-cream/50 text-xs leading-relaxed">{stat.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BESTSELLERS - EDITORIAL GALLERY */}
            <section className="py-20 relative overflow-hidden bg-gradient-to-b from-cream via-cream-dark/30 to-cream">
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
                            <span className="section-badge">Los Más Buscados</span>
                            <h2 className="section-title">Favoritos de la Marca</h2>
                            <p className="section-subtitle max-w-2xl mx-auto">
                                Los productos que nos dieron la fama — resultados de salón en casa,
                                calidad profesional a precio accesible
                            </p>
                        </motion.div>
                    </div>

                    {/* Bento Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {bestsellers.map((product, index) => {
                            const isHero = index < 2;
                            const rankLabels = [
                                '#1 Más Vendido',
                                '#2 Top Favorito',
                                '#3 Imprescindible',
                                '#4 Profesional',
                                '#5 Trending',
                                '#6 Básico Pro',
                            ];
                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.08, duration: 0.5 }}
                                    className={isHero ? 'sm:col-span-1 lg:row-span-2' : ''}
                                >
                                    <Link
                                        to={`/producto/${product.id}`}
                                        className="group relative block overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 h-full"
                                    >
                                        {/* Image Container */}
                                        <div className={`relative overflow-hidden bg-cream-dark ${isHero ? 'aspect-[3/4]' : 'aspect-square'}`}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500" />

                                            {/* Rank Badge */}
                                            <div className="absolute top-3 left-3 z-10">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase shadow-lg ${index === 0
                                                    ? 'bg-gradient-to-r from-gold to-gold-light text-forest'
                                                    : 'bg-white/90 backdrop-blur-sm text-forest'
                                                    }`}>
                                                    {index === 0 && (
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                                    )}
                                                    {rankLabels[index]}
                                                </span>
                                            </div>

                                            {/* Category pill */}
                                            <div className="absolute top-3 right-3 z-10">
                                                <span className="px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase bg-black/30 backdrop-blur-sm text-white/90 rounded-full">
                                                    {product.category}
                                                </span>
                                            </div>

                                            {/* Product info overlay at bottom */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
                                                <h3 className={`font-serif text-white leading-tight mb-2 group-hover:text-gold transition-colors duration-300 ${isHero ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                                                    }`}>
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-gold font-semibold text-lg">
                                                        ${product.price.toLocaleString()} <span className="text-cream/50 text-xs font-normal">MXN</span>
                                                    </p>
                                                    <span className="inline-flex items-center gap-1 text-cream/70 text-xs group-hover:text-gold transition-colors">
                                                        Ver más
                                                        <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                        </svg>
                                                    </span>
                                                </div>
                                                {/* Short description for hero cards */}
                                                {isHero && product.description && (
                                                    <p className="text-cream/50 text-xs leading-relaxed mt-2 line-clamp-2 hidden sm:block">
                                                        {product.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-14">
                        <Link to="/tienda" className="btn btn-outline">
                            Ver Todo el Catálogo
                        </Link>
                    </div>
                </div>
            </section>

            {/* ACADEMY MODULE - DYNAMIC SECTION */}
            <section className="py-20 relative overflow-hidden bg-gradient-to-br from-cream via-cream-dark to-cream">
                {/* Dynamic pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-gold/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-forest/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gold/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
                </div>
                {/* Decorative lines */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <div className="container-luxury relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative aspect-[4/3] overflow-hidden bg-forest"
                        >
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            >
                                <source src="/videos/Video_con_logo_J_DENIS.mp4" type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <span className="inline-block px-3 py-1 bg-gold text-forest text-xs font-bold">
                                    +50 años de experiencia
                                </span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="section-badge">Academia J. Denis</span>
                            <h2 className="section-title mb-6">
                                Aprende de la Pionera
                            </h2>
                            <p className="text-charcoal/70 leading-relaxed mb-8">
                                La <strong className="text-forest">Maestra Gabriela Elizalde</strong>, con más de 50 años de experiencia,
                                ha formado a miles de profesionales en técnicas patentadas que revolucionaron
                                el mercado de cejas y pestañas en Latinoamérica.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Certificaciones oficiales con validez profesional',
                                    'Técnicas exclusivas: Lash Lifting, Laminado, Henna',
                                    'Grupos reducidos en sede Lindavista, CDMX',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-charcoal/80">
                                        <span className="w-6 h-6 flex items-center justify-center text-gold"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/academia" className="btn btn-primary">
                                Ver Próximos Cursos
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* REELS & TIKTOKS GALLERY */}
            {reels.length > 0 && (
                <section className="py-20 relative overflow-hidden bg-forest">
                    {/* Dynamic glow overlay */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 left-1/4 w-80 h-80 bg-gold/40 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                    <div className="container-luxury relative z-10">
                        <div className="section-header">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/40 text-gold text-xs tracking-[0.2em] uppercase mb-4">
                                    #J.DENIS
                                </span>
                                <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">
                                    Reels y TikToks
                                </h2>
                                <p className="text-cream/60 text-lg max-w-2xl mx-auto">
                                    Tutoriales, tips y tendencias en cejas y pestañas
                                </p>
                            </motion.div>
                        </div>

                        {/* Auto-rotating centered carousel */}
                        <div
                            className="flex flex-col items-center"
                            onMouseEnter={() => setIsReelPaused(true)}
                            onMouseLeave={() => setIsReelPaused(false)}
                        >
                            <div className="relative w-[260px] sm:w-[280px] md:w-[300px] aspect-[9/16]">
                                <AnimatePresence mode="wait">
                                    {reels.length > 0 && (() => {
                                        const reel = reels[currentReel];
                                        const style = platformStyles[reel.platform] || platformStyles.instagram;
                                        const thumb = getThumbnailUrl(reel);
                                        return (
                                            <motion.a
                                                key={reel.id}
                                                href={reel.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                                className="group absolute inset-0"
                                            >
                                                <div className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br ${style.gradient} shadow-2xl ring-2 ring-gold/30`}>
                                                    {/* Thumbnail image */}
                                                    {thumb && (
                                                        <img
                                                            src={thumb}
                                                            alt={reel.title}
                                                            className="absolute inset-0 w-full h-full object-cover"
                                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                        />
                                                    )}
                                                    {/* Gradient overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

                                                    {/* Play button */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 text-white">
                                                            {style.icon}
                                                        </div>
                                                    </div>

                                                    {/* Platform badge */}
                                                    <div className="absolute top-3 left-3">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-black/40 backdrop-blur-sm">
                                                            <span className="w-3 h-3">{style.icon}</span> {style.label}
                                                        </span>
                                                    </div>

                                                    {/* Title at bottom */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                                        <p className="text-white text-sm font-medium leading-snug line-clamp-2">
                                                            {reel.title}
                                                        </p>
                                                    </div>

                                                    {/* Progress bar */}
                                                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
                                                        <motion.div
                                                            className="h-full bg-gold"
                                                            initial={{ width: '0%' }}
                                                            animate={{ width: isReelPaused ? undefined : '100%' }}
                                                            transition={{ duration: 3, ease: 'linear' }}
                                                            key={`progress-${currentReel}`}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.a>
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

            {/* TESTIMONIALS - CREAM SECTION */}
            <section className="section section-cream">
                <div className="container-luxury">
                    <div className="section-header">
                        <span className="section-badge">Testimonios</span>
                        <h2 className="section-title">Lo que Dicen Nuestras Profesionales</h2>
                        <p className="section-subtitle">
                            Miles de especialistas confían en J. Denis
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'María González',
                                role: 'Lashista Certificada, Monterrey',
                                text: 'Los productos J. Denis me han permitido ofrecer resultados que mis clientas aman. La calidad es incomparable.',
                                avatar: 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=17204D&color=ffffff&size=128&bold=true&font-size=0.4'
                            },
                            {
                                name: 'Ana Martínez',
                                role: 'Dueña de Salón, CDMX',
                                text: 'Después de tomar el curso con la Maestra Gaby, mi técnica mejoró al 100%. Los kits son todo lo que necesitas.',
                                avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=1E2B5E&color=ffffff&size=128&bold=true&font-size=0.4'
                            },
                            {
                                name: 'Lucía Hernández',
                                role: 'Microblader Profesional, Guadalajara',
                                text: 'El Compass Silver Ratio revolucionó mi trabajo. Precisión perfecta en cada diseño de ceja.',
                                avatar: 'https://ui-avatars.com/api/?name=Lucia+Hernandez&background=1C50EF&color=ffffff&size=128&bold=true&font-size=0.4'
                            },
                        ].map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="testimonial-card"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <svg key={star} className="w-4 h-4 text-gold fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                    ))}
                                </div>
                                <p className="text-charcoal/70 italic mb-6 leading-relaxed">
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 object-cover border-2 border-gold/30"
                                    />
                                    <div>
                                        <p className="font-medium text-forest">{testimonial.name}</p>
                                        <p className="text-sm text-charcoal/50">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA FINAL - DYNAMIC SECTION */}
            <section className="py-20 relative overflow-hidden bg-forest">
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
