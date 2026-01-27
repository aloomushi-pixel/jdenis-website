import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const courses = [
    {
        id: 1,
        title: 'Lash Lifting Profesional',
        duration: '2 días',
        price: 4500,
        description: 'Domina la técnica de levantamiento de pestañas con certificación oficial.',
        topics: ['Anatomía del ojo', 'Selección de rodillos', 'Tiempos de procesamiento', 'Casos especiales'],
        nextDate: '15 de Febrero 2025',
    },
    {
        id: 2,
        title: 'Extensiones de Pestañas Clásicas',
        duration: '3 días',
        price: 6500,
        description: 'Aprende la técnica 1:1 para extensiones naturales y duraderas.',
        topics: ['Selección de curvaturas', 'Aplicación de adhesivo', 'Diseño de mirada', 'Retiros seguros'],
        nextDate: '22 de Febrero 2025',
    },
    {
        id: 3,
        title: 'Volumen Ruso Avanzado',
        duration: '2 días',
        price: 5500,
        description: 'Técnica de abanicos 2D a 6D para efectos dramáticos.',
        topics: ['Creación de abanicos', 'Volumen Mega', 'Corrección de errores', 'Diseño personalizado'],
        nextDate: '1 de Marzo 2025',
    },
    {
        id: 4,
        title: 'Brow Henna & Laminado',
        duration: '1 día',
        price: 3500,
        description: 'Coloración y moldeado profesional de cejas.',
        topics: ['Preparación de henna', 'Mapeo de cejas', 'Laminado paso a paso', 'Aftercare'],
        nextDate: '8 de Marzo 2025',
    },
];

export default function Academy() {
    return (
        <div className="min-h-screen bg-cream">
            {/* Hero */}
            <section className="bg-navy py-16">
                <div className="container-luxury text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="badge bg-gold/20 text-gold border-gold/30 mb-4"
                    >
                        ACADEMIA J. DENIS
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl lg:text-5xl text-white mb-4"
                    >
                        Formación Profesional
                    </motion.h1>
                    <p className="text-white/70 max-w-2xl mx-auto">
                        Aprende de la Maestra Gabriela Elizalde y su equipo de especialistas
                        con más de 50 años de experiencia combinada.
                    </p>
                </div>
            </section>

            {/* Why Us */}
            <section className="py-12 bg-blush/50">
                <div className="container-luxury">
                    <div className="grid md:grid-cols-4 gap-6 text-center">
                        {[
                            { icon: '🏆', text: 'Certificación Oficial' },
                            { icon: '👩‍🏫', text: 'Grupos Reducidos' },
                            { icon: '🧪', text: 'Kit de Productos Incluido' },
                            { icon: '📍', text: 'Sede Lindavista, CDMX' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <span className="font-medium text-navy">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Courses */}
            <section className="section">
                <div className="container-luxury">
                    <h2 className="section-title text-center mb-12">Próximos Cursos</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {courses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-serif text-xl text-navy">
                                                {course.title}
                                            </h3>
                                            <p className="text-charcoal-light text-sm">
                                                Duración: {course.duration}
                                            </p>
                                        </div>
                                        <span className="badge badge-gold">
                                            {course.nextDate}
                                        </span>
                                    </div>

                                    <p className="text-charcoal-light mb-4">
                                        {course.description}
                                    </p>

                                    <div className="mb-6">
                                        <p className="text-sm font-medium text-navy mb-2">Temario:</p>
                                        <ul className="grid grid-cols-2 gap-2">
                                            {course.topics.map((topic, i) => (
                                                <li key={i} className="text-sm text-charcoal-light flex items-center gap-2">
                                                    <span className="text-gold">•</span>
                                                    {topic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-charcoal/10">
                                        <div>
                                            <p className="text-2xl font-serif text-gold font-semibold">
                                                ${course.price.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-charcoal-light">MXN / persona</p>
                                        </div>
                                        <a
                                            href={`https://wa.me/525527271067?text=Hola! Quiero información sobre el curso: ${course.title}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary"
                                        >
                                            Inscribirme
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Instructor */}
            <section className="section bg-navy">
                <div className="container-luxury">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="aspect-square max-w-md mx-auto lg:mx-0 rounded-3xl overflow-hidden">
                            <img
                                src="/gaby-elizalde-instructora.jpg"
                                alt="Maestra Gabriela Elizalde"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <span className="badge bg-gold/20 text-gold border-gold/30 mb-4">
                                INSTRUCTORA PRINCIPAL
                            </span>
                            <h2 className="font-serif text-3xl text-white mb-4">
                                Maestra Gabriela Elizalde
                            </h2>
                            <p className="text-white/70 leading-relaxed mb-6">
                                Con más de 50 años en la industria de la belleza, la Maestra Gaby es
                                pionera en técnicas de cejas y pestañas en México. Ha formado a más de
                                5,000 profesionales y desarrollado patentes que revolucionaron el mercado
                                latinoamericano.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    'Fundadora de J. Denis (1998)',
                                    'Creadora de técnicas patentadas',
                                    'Formadora de formadores',
                                    'Referente en el gremio nacional',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white/80">
                                        <span className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://youtube.com/@JDenismexico"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn bg-red-600 text-white hover:bg-red-700"
                            >
                                ▶️ Ver Tutoriales en YouTube
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section bg-cream">
                <div className="container-luxury text-center">
                    <h2 className="section-title mb-4">¿Dudas sobre nuestros cursos?</h2>
                    <p className="text-charcoal-light max-w-xl mx-auto mb-8">
                        Contáctanos por WhatsApp para recibir asesoría personalizada sobre
                        el programa ideal para tu nivel.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://wa.me/525527271067"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn bg-green-500 text-white hover:bg-green-600"
                        >
                            💬 WhatsApp Directo
                        </a>
                        <Link to="/tienda" className="btn btn-outline">
                            Ver Productos
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
