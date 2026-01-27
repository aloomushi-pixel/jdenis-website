import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { bestsellers } from '../data/products';

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* HERO SECTION */}
            <section className="hero">
                <div className="container-luxury">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="badge badge-gold mb-4">25 AÑOS DE EXCELENCIA</span>
                            <h1 className="hero-title text-balance">
                                Elevamos la Belleza Profesional a una <span className="gold-gradient">Ciencia</span>
                            </h1>
                            <p className="hero-subtitle">
                                25 años de innovación técnica y patentes mexicanas para la mirada.
                                Productos de laboratorio con calidad científica para profesionales exigentes.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-8">
                                <Link to="/tienda" className="btn btn-primary">
                                    Explorar Tienda
                                </Link>
                                <Link to="/academia" className="btn btn-outline">
                                    Ver Cursos
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-luxury-lg">
                                <img
                                    src="/hero-lash-lifting.jpg"
                                    alt="Técnica profesional de Lash Lifting"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
                            </div>
                            {/* Floating Badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-luxury"
                            >
                                <div className="text-center">
                                    <p className="text-3xl font-serif text-gold font-bold">50+</p>
                                    <p className="text-xs text-charcoal-light">Años de experiencia docente</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* LEGACY STRIP */}
            <section className="bg-navy py-6">
                <div className="container-luxury">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="text-white/90">
                            <span className="text-gold text-2xl font-serif">1998</span>
                            <p className="text-sm mt-1">Fundada en México</p>
                        </div>
                        <div className="text-white/90">
                            <span className="text-gold text-2xl font-serif">Patentes</span>
                            <p className="text-sm mt-1">Técnicas propias certificadas</p>
                        </div>
                        <div className="text-white/90">
                            <span className="text-gold text-2xl font-serif">100%</span>
                            <p className="text-sm mt-1">Manufactura mexicana</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BESTSELLERS */}
            <section className="section bg-cream">
                <div className="container-luxury">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="section-title"
                        >
                            Productos Estrella
                        </motion.h2>
                        <p className="section-subtitle mx-auto">
                            Los favoritos de los profesionales de la belleza
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bestsellers.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/tienda" className="btn btn-outline">
                            Ver Todo el Catálogo
                        </Link>
                    </div>
                </div>
            </section>

            {/* ACADEMY MODULE */}
            <section className="section bg-blush/50">
                <div className="container-luxury">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury"
                        >
                            <img
                                src="/gaby-elizalde-seminario.jpg"
                                alt="Maestra Gabriela Elizalde impartiendo seminario"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="badge badge-navy mb-4">ACADEMIA J. DENIS</span>
                            <h2 className="section-title">
                                Aprende de la Pionera
                            </h2>
                            <p className="text-charcoal-light leading-relaxed mb-6">
                                La <strong>Maestra Gabriela Elizalde</strong>, con más de 50 años de experiencia,
                                ha formado a miles de profesionales en técnicas patentadas que revolucionaron
                                el mercado de cejas y pestañas en Latinoamérica.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-charcoal">
                                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm">✓</span>
                                    Certificaciones oficiales con validez profesional
                                </li>
                                <li className="flex items-center gap-3 text-charcoal">
                                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm">✓</span>
                                    Técnicas exclusivas: Lash Lifting, Laminado, Henna
                                </li>
                                <li className="flex items-center gap-3 text-charcoal">
                                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm">✓</span>
                                    Grupos reducidos en sede Lindavista, CDMX
                                </li>
                            </ul>
                            <Link to="/academia" className="btn btn-primary">
                                Ver Próximos Cursos
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS / UGC */}
            <section className="section bg-cream">
                <div className="container-luxury">
                    <div className="text-center mb-12">
                        <h2 className="section-title">Lo que Dicen Nuestras Profesionales</h2>
                        <p className="section-subtitle mx-auto">
                            Miles de especialistas confían en J. Denis
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'María González',
                                role: 'Lashista Certificada, Monterrey',
                                text: 'Los productos J. Denis me han permitido ofrecer resultados que mis clientas aman. La calidad es incomparable.',
                            },
                            {
                                name: 'Ana Martínez',
                                role: 'Dueña de Salón, CDMX',
                                text: 'Después de tomar el curso con la Maestra Gaby, mi técnica mejoró al 100%. Los kits son todo lo que necesitas.',
                            },
                            {
                                name: 'Lucía Hernández',
                                role: 'Microblader Profesional, Guadalajara',
                                text: 'El Compass Silver Ratio revolucionó mi trabajo. Precisión perfecta en cada diseño de ceja.',
                            },
                        ].map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-luxury"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span key={star} className="text-gold">★</span>
                                    ))}
                                </div>
                                <p className="text-charcoal-light italic mb-6">"{testimonial.text}"</p>
                                <div>
                                    <p className="font-medium text-navy">{testimonial.name}</p>
                                    <p className="text-sm text-charcoal-light">{testimonial.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="bg-navy py-16">
                <div className="container-luxury text-center">
                    <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
                        ¿Lista para elevar tu carrera profesional?
                    </h2>
                    <p className="text-white/70 max-w-xl mx-auto mb-8">
                        Únete a la comunidad de especialistas que confían en J. Denis
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/tienda" className="btn btn-primary">
                            Comprar Ahora
                        </Link>
                        <a
                            href="https://wa.me/525527271067"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn bg-green-500 text-white hover:bg-green-600"
                        >
                            💬 WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
