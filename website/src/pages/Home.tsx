import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { bestsellers } from '../data/products';
import { getReels, type SocialReel } from '../lib/supabase';

export default function Home() {
    const [reels, setReels] = useState<SocialReel[]>([]);

    useEffect(() => {
        getReels(true).then(setReels).catch(console.error);
    }, []);

    const platformStyles: Record<string, { gradient: string; icon: string; label: string }> = {
        youtube: { gradient: 'from-red-600 to-red-800', icon: '▶️', label: 'YouTube' },
        tiktok: { gradient: 'from-[#00f2ea] via-[#ff0050] to-[#7c3aed]', icon: '🎵', label: 'TikTok' },
        instagram: { gradient: 'from-[#f09433] via-[#e6683c] to-[#bc1888]', icon: '📸', label: 'Instagram' },
    };

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

            {/* BESTSELLERS - CREAM SECTION */}
            <section className="section section-cream">
                <div className="container-luxury">
                    <div className="section-header">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="section-badge">Productos Signature</span>
                            <h2 className="section-title">Los Favoritos de las Profesionales</h2>
                            <p className="section-subtitle">
                                Fórmulas exclusivas desarrolladas con la más alta calidad científica
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bestsellers.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>

                    <div className="text-center mt-12">
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
                                        <span className="w-6 h-6 flex items-center justify-center text-gold">✓</span>
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
                                    Síguenos
                                </span>
                                <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">
                                    Nuestros Reels & TikToks
                                </h2>
                                <p className="text-cream/60 text-lg max-w-2xl mx-auto">
                                    Tutoriales, tips y tendencias en cejas y pestañas
                                </p>
                            </motion.div>
                        </div>

                        {/* Horizontal scrollable carousel */}
                        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
                            {reels.map((reel, i) => {
                                const style = platformStyles[reel.platform] || platformStyles.instagram;
                                return (
                                    <motion.a
                                        key={reel.id}
                                        href={reel.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group flex-shrink-0 snap-start w-[200px] sm:w-[220px]"
                                    >
                                        <div className={`relative aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-br ${style.gradient} shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.03]`}>
                                            {/* Shimmer overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                                            {/* Play button */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                                                    <span className="text-3xl ml-1">{style.icon}</span>
                                                </div>
                                            </div>

                                            {/* Platform badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold text-white bg-black/40 backdrop-blur-sm">
                                                    {style.icon} {style.label}
                                                </span>
                                            </div>

                                            {/* Title at bottom */}
                                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                                <p className="text-white text-xs font-medium leading-snug line-clamp-2">
                                                    {reel.title}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.a>
                                );
                            })}
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
                                avatar: 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=1a2f23&color=f5f0e8&size=128&bold=true&font-size=0.4'
                            },
                            {
                                name: 'Ana Martínez',
                                role: 'Dueña de Salón, CDMX',
                                text: 'Después de tomar el curso con la Maestra Gaby, mi técnica mejoró al 100%. Los kits son todo lo que necesitas.',
                                avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=2d4a3a&color=f5f0e8&size=128&bold=true&font-size=0.4'
                            },
                            {
                                name: 'Lucía Hernández',
                                role: 'Microblader Profesional, Guadalajara',
                                text: 'El Compass Silver Ratio revolucionó mi trabajo. Precisión perfecta en cada diseño de ceja.',
                                avatar: 'https://ui-avatars.com/api/?name=Lucia+Hernandez&background=b8965a&color=1a2f23&size=128&bold=true&font-size=0.4'
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
                                        <span key={star} className="text-gold">★</span>
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
                            💬 ¿Dudas? <a href="https://wa.me/525527271067" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Escríbenos por WhatsApp</a>
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
