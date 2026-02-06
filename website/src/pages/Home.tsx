import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { bestsellers } from '../data/products';

export default function Home() {
    return (
        <div className="min-h-screen bg-noir">
            {/* HERO SECTION - GLAMOUR NOIR */}
            <section className="hero">
                {/* Animated Circle */}
                <div className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] border border-rose-gold/20 rounded-full animate-pulse-soft" />
                <div className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] border border-rose-gold/10 rounded-full animate-pulse-soft" style={{ animationDelay: '1s' }} />

                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="hero-badge">25 Años de Excelencia</span>
                        <h1 className="hero-title">
                            El Arte de la<br />
                            <span className="gold-gradient">Mirada Perfecta</span>
                        </h1>
                        <p className="hero-subtitle">
                            Productos de laboratorio con calidad científica para profesionales
                            que buscan resultados extraordinarios.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/tienda" className="btn btn-primary">
                                Ver Productos
                            </Link>
                            <Link to="/registro-distribuidor" className="btn btn-outline border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-noir">
                                Registro Distribuidor
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* LEGACY STRIP - REDESIGNED */}
            <section className="bg-gradient-to-r from-charcoal via-noir to-charcoal py-12 border-y border-rose-gold/10">
                <div className="container-luxury">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🏆',
                                value: 'Desde 1998',
                                label: 'Pioneros en México',
                                description: 'Primera marca mexicana especializada en cejas y pestañas profesionales'
                            },
                            {
                                icon: '🔬',
                                value: 'Patentes Propias',
                                label: 'Técnicas Certificadas',
                                description: 'Métodos exclusivos desarrollados y patentados por nuestro laboratorio'
                            },
                            {
                                icon: '🇲🇽',
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
                                className="text-center p-6 rounded-lg bg-noir/50 border border-pearl/5 hover:border-rose-gold/30 transition-colors"
                            >
                                <span className="text-4xl mb-4 block">{stat.icon}</span>
                                <span className="text-rose-gold text-2xl font-serif font-bold block">{stat.value}</span>
                                <p className="text-champagne text-sm font-medium mt-1 mb-2">{stat.label}</p>
                                <p className="text-pearl/50 text-xs leading-relaxed">{stat.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BESTSELLERS */}
            <section className="section section-noir">
                <div className="container-luxury">
                    <div className="section-header">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="section-badge">Productos Signature</span>
                            <h2 className="section-title">Los Favoritos de las Profesionales</h2>
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

            {/* ACADEMY MODULE */}
            <section className="section section-dark">
                <div className="container-luxury">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative aspect-[4/3] overflow-hidden rounded-lg"
                        >
                            <img
                                src="/gaby-elizalde-seminario.jpg"
                                alt="Maestra Gabriela Elizalde impartiendo seminario"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-noir/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <span className="inline-block px-3 py-1 bg-rose-gold text-noir text-xs font-bold rounded-full">
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
                            <p className="text-pearl/60 leading-relaxed mb-8">
                                La <strong className="text-champagne">Maestra Gabriela Elizalde</strong>, con más de 50 años de experiencia,
                                ha formado a miles de profesionales en técnicas patentadas que revolucionaron
                                el mercado de cejas y pestañas en Latinoamérica.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Certificaciones oficiales con validez profesional',
                                    'Técnicas exclusivas: Lash Lifting, Laminado, Henna',
                                    'Grupos reducidos en sede Lindavista, CDMX',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-pearl/80">
                                        <span className="w-6 h-6 flex items-center justify-center text-rose-gold">✓</span>
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

            {/* TESTIMONIALS WITH AVATARS */}
            <section className="section section-noir">
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
                                avatar: 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=d4a574&color=1a1a1a&size=128&bold=true&font-size=0.4'
                            },
                            {
                                name: 'Ana Martínez',
                                role: 'Dueña de Salón, CDMX',
                                text: 'Después de tomar el curso con la Maestra Gaby, mi técnica mejoró al 100%. Los kits son todo lo que necesitas.',
                                avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=c9967a&color=1a1a1a&size=128&bold=true&font-size=0.4'
                            },
                            {
                                name: 'Lucía Hernández',
                                role: 'Microblader Profesional, Guadalajara',
                                text: 'El Compass Silver Ratio revolucionó mi trabajo. Precisión perfecta en cada diseño de ceja.',
                                avatar: 'https://ui-avatars.com/api/?name=Lucia+Hernandez&background=b8956a&color=1a1a1a&size=128&bold=true&font-size=0.4'
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
                                <div className="flex gap-1 mb-4 relative z-10">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span key={star} className="text-rose-gold">★</span>
                                    ))}
                                </div>
                                <p className="text-pearl/70 italic mb-6 relative z-10 leading-relaxed">
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center gap-4 relative z-10">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-rose-gold/30"
                                    />
                                    <div>
                                        <p className="font-medium text-champagne">{testimonial.name}</p>
                                        <p className="text-sm text-pearl/50">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA FINAL - SOPHISTICATED DESIGN */}
            <section className="relative py-24 overflow-hidden">
                {/* Premium Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/20 via-noir to-charcoal" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-gold/10 via-transparent to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-gold/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-gold/50 to-transparent" />

                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-rose-gold/5 blur-3xl" />
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-champagne/5 blur-3xl" />

                <div className="container-luxury relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <span className="inline-block px-4 py-2 bg-rose-gold/10 border border-rose-gold/30 rounded-full text-rose-gold text-sm font-medium mb-6">
                            Únete a +5,000 profesionales
                        </span>
                        <h2 className="font-serif text-4xl lg:text-5xl text-champagne mb-6 leading-tight">
                            ¿Lista para elevar tu carrera profesional?
                        </h2>
                        <p className="text-pearl/60 text-lg max-w-xl mx-auto mb-10">
                            Accede a productos premium con precios especiales para profesionales
                            y distribuye la marca líder en tu zona.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/tienda"
                                className="btn bg-rose-gold text-noir font-bold hover:bg-champagne transition-colors px-8 py-4 text-lg"
                            >
                                Ver Productos
                            </Link>
                            <Link
                                to="/registro-distribuidor"
                                className="btn bg-transparent border-2 border-rose-gold text-rose-gold font-bold hover:bg-rose-gold/10 transition-colors px-8 py-4 text-lg"
                            >
                                Registro Distribuidor
                            </Link>
                        </div>
                        <p className="text-pearl/40 text-sm mt-8">
                            💬 ¿Dudas? <a href="https://wa.me/525527271067" target="_blank" rel="noopener noreferrer" className="text-rose-gold hover:underline">Escríbenos por WhatsApp</a>
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

