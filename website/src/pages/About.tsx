import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="min-h-screen bg-cream">
            {/* Hero */}
            <section className="bg-blush/50 py-16">
                <div className="container-luxury text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="section-title"
                    >
                        Nuestra Historia
                    </motion.h1>
                    <p className="text-charcoal-light max-w-2xl mx-auto">
                        25 años elevando la belleza profesional a una ciencia
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="section">
                <div className="container-luxury">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="badge badge-gold mb-4">DESDE 1998</span>
                            <h2 className="section-title">
                                La Visión de una Pionera
                            </h2>
                            <div className="space-y-4 text-charcoal-light leading-relaxed">
                                <p>
                                    <strong className="text-navy">J. Denis</strong> nace de la visión de la
                                    <strong className="text-navy"> Maestra Gabriela Elizalde</strong>, quien con más de
                                    50 años de experiencia en la industria de la belleza, identificó la necesidad de
                                    productos de laboratorio con calidad científica para profesionales exigentes.
                                </p>
                                <p>
                                    Desde nuestra sede en <strong className="text-navy">Lindavista, Ciudad de México</strong>,
                                    hemos desarrollado técnicas patentadas que revolucionaron el mercado de cejas y
                                    pestañas en Latinoamérica, formando a miles de especialistas que hoy lideran
                                    salones en toda la región.
                                </p>
                                <p>
                                    Nuestra filosofía es simple: <em>"La belleza es una ciencia, y merece productos
                                        diseñados con precisión de laboratorio"</em>.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury-lg">
                                <img
                                    src="/gaby-elizalde-fundadora.jpg"
                                    alt="Maestra Gabriela Elizalde, Fundadora de J. Denis"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-luxury max-w-xs">
                                <p className="font-serif text-navy italic">
                                    "Cada producto que creamos lleva el compromiso de transformar profesionales
                                    en artistas de la belleza."
                                </p>
                                <p className="text-sm text-gold mt-2">— Gabriela Elizalde</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section bg-navy">
                <div className="container-luxury">
                    <h2 className="font-serif text-3xl text-white text-center mb-12">
                        Nuestros Valores
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🔬',
                                title: 'Ciencia & Precisión',
                                description: 'Fórmulas desarrolladas con rigor científico y pruebas exhaustivas',
                            },
                            {
                                icon: '🇲🇽',
                                title: 'Orgullo Mexicano',
                                description: '100% manufactura nacional con ingredientes premium',
                            },
                            {
                                icon: '🎓',
                                title: 'Educación Continua',
                                description: 'Formamos a la siguiente generación de profesionales',
                            },
                        ].map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-8 rounded-2xl bg-white/5 border border-white/10"
                            >
                                <span className="text-4xl mb-4 block">{value.icon}</span>
                                <h3 className="font-serif text-xl text-white mb-2">{value.title}</h3>
                                <p className="text-white/70">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="section">
                <div className="container-luxury">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '25+', label: 'Años de experiencia' },
                            { value: '5,000+', label: 'Profesionales formadas' },
                            { value: '50+', label: 'Productos desarrollados' },
                            { value: '15', label: 'Países de exportación' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <p className="font-serif text-4xl lg:text-5xl text-gold font-bold">
                                    {stat.value}
                                </p>
                                <p className="text-charcoal-light mt-2">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Location */}
            <section className="section bg-blush/50">
                <div className="container-luxury">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="section-title">Visítanos</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">📍</span>
                                    <div>
                                        <p className="font-medium text-navy">Dirección</p>
                                        <p className="text-charcoal-light">
                                            Av. Montevideo #136, Col. Lindavista<br />
                                            Gustavo A. Madero, CDMX 07300
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">📞</span>
                                    <div>
                                        <p className="font-medium text-navy">Teléfono</p>
                                        <p className="text-charcoal-light">55 5781 3476</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">🕐</span>
                                    <div>
                                        <p className="font-medium text-navy">Horario</p>
                                        <p className="text-charcoal-light">
                                            Lunes a Viernes: 9:00 - 18:00<br />
                                            Sábados: 10:00 - 14:00
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex gap-4">
                                <a
                                    href="https://wa.me/525527271067"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn bg-green-500 text-white hover:bg-green-600"
                                >
                                    💬 WhatsApp
                                </a>
                                <Link to="/tienda" className="btn btn-primary">
                                    Ver Productos
                                </Link>
                            </div>
                        </div>

                        <div className="aspect-video rounded-2xl overflow-hidden shadow-luxury bg-charcoal/10">
                            <iframe
                                title="Ubicación J. Denis"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.2!2d-99.1!3d19.48!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI4JzQ4LjAiTiA5OcKwMDYnMDAuMCJX!5e0!3m2!1sen!2smx!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
