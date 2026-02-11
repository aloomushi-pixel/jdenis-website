import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Radio } from 'lucide-react';

const courses = [
    {
        id: 1,
        title: 'Lash Lifting Profesional',
        duration: '2 días',
        price: 4500,
        description: 'Domina la técnica de levantamiento de pestañas con certificación oficial. Incluye práctica con Cisteamina Estabilizada.',
        topics: ['Anatomía del ojo', 'Selección de rodillos', 'Tiempos de procesamiento', 'Uso de Cisteamina'],
        nextDate: '3 de Marzo 2026',
    },
    {
        id: 2,
        title: 'Lifting Coreano (Korean Lash Lift)',
        duration: '1 día',
        price: 3800,
        description: 'Técnica avanzada de lifting con rizo abierto y natural. Incluye combo Cisteamina + Shot 1.5 Hidratante.',
        topics: ['Filosofía K-Beauty', 'Selección de molde plano', 'Combo Cisteamina + Shot 1.5', 'Rizo tipo J y L'],
        nextDate: '5 de Marzo 2026',
    },
    {
        id: 3,
        title: 'Extensiones de Pestañas Clásicas',
        duration: '3 días',
        price: 6500,
        description: 'Aprende la técnica 1:1 para extensiones naturales y duraderas.',
        topics: ['Selección de curvaturas', 'Aplicación de adhesivo', 'Diseño de mirada', 'Retiros seguros'],
        nextDate: '10 de Marzo 2026',
        video: '/videos/Mejora_de_video_con_pestañas_fijas.mp4',
        videoTitle: 'Tutorial: Extensiones Clásicas Paso a Paso',
    },
    {
        id: 4,
        title: 'Volumen Ruso Avanzado',
        duration: '2 días',
        price: 5500,
        description: 'Técnica de abanicos 2D a 6D para efectos dramáticos.',
        topics: ['Creación de abanicos', 'Volumen Mega', 'Corrección de errores', 'Diseño personalizado'],
        nextDate: '17 de Marzo 2026',
        video: '/videos/Modelo_Con_Pestañas_Naturales.mp4',
        videoTitle: 'Tutorial: Pestañas Naturales con Volumen Ruso',
    },
    {
        id: 5,
        title: 'Brow Henna & Laminado',
        duration: '1 día',
        price: 3500,
        description: 'Coloración y moldeado profesional de cejas. Los creadores del laminado de cejas en México.',
        topics: ['Preparación de henna', 'Mapeo de cejas', 'Laminado paso a paso', 'Aftercare'],
        nextDate: '24 de Marzo 2026',
        video: '/videos/Video_con_logo_J_DENIS.mp4',
        videoTitle: 'Técnica Brow Henna J. Denis',
    },
];

const events = [
    {
        title: 'Beauty Coat 2026',
        date: '15-16 de Febrero 2026',
        location: 'Centro de Convenciones, CDMX',
        description: 'J. Denis estará presente con Stands #64 y #72. Demostraciones en vivo de Cisteamina Estabilizada y Shot 1.5.',
        type: 'congreso' as const,
    },
    {
        title: 'Sesión en Vivo: Demo de Productos',
        date: '23 de Febrero 2026, 11:00 AM',
        location: 'Instagram @jdenismx',
        description: 'La Maestra Gaby resuelve dudas en directo. Demo del combo Cisteamina + Shot 1.5 y apertura de preguntas.',
        type: 'live' as const,
    },
];

export default function Academy() {
    return (
        <div className="min-h-screen bg-cream">
            {/* Hero */}
            <section className="pt-32 pb-16 bg-forest relative overflow-hidden">
                <div className="absolute inset-0 botanical-pattern opacity-20" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                <div className="container-luxury text-center relative z-10">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-block px-4 py-2 bg-gold/20 border border-gold/40 text-gold text-sm font-medium mb-4"
                    >
                        ACADEMIA J. DENIS
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl lg:text-5xl text-cream mb-4"
                    >
                        Formación Profesional
                    </motion.h1>
                    <p className="text-cream/70 max-w-2xl mx-auto">
                        Aprende de la Maestra Gabriela Elizalde y su equipo de especialistas
                        con más de 50 años de experiencia combinada.
                    </p>
                </div>
            </section>

            {/* Why Us */}
            <section className="py-12 section-kraft">
                <div className="container-luxury">
                    <div className="grid md:grid-cols-4 gap-6 text-center">
                        {[
                            'Certificación Oficial',
                            'Grupos Reducidos',
                            'Kit de Productos Incluido',
                            'Sede Lindavista, CDMX',
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-center">
                                <span className="font-medium text-forest">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Courses */}
            <section className="section section-cream">
                <div className="container-luxury">
                    <h2 className="font-serif text-3xl text-forest text-center mb-12">Próximos Cursos</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {courses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white border border-kraft/30 overflow-hidden hover:border-gold/50 transition-all"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-serif text-xl text-forest">
                                                {course.title}
                                            </h3>
                                            <p className="text-charcoal/60 text-sm">
                                                Duración: {course.duration}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-gold/20 border border-gold/40 text-gold text-sm">
                                            {course.nextDate}
                                        </span>
                                    </div>

                                    <p className="text-charcoal/70 mb-4">
                                        {course.description}
                                    </p>

                                    <div className="mb-6">
                                        <p className="text-sm font-medium text-forest mb-2">Temario:</p>
                                        <ul className="grid grid-cols-2 gap-2">
                                            {course.topics.map((topic, i) => (
                                                <li key={i} className="text-sm text-charcoal/60 flex items-center gap-2">
                                                    <span className="text-gold">•</span>
                                                    {topic}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {course.video && (
                                        <div className="mb-6 p-4 bg-cream border border-kraft/30">
                                            <p className="text-sm font-medium text-forest mb-3 flex items-center gap-2">
                                                <span className="text-gold">▶</span>
                                                {course.videoTitle || 'Video Tutorial'}
                                            </p>
                                            <video
                                                controls
                                                className="w-full"
                                                poster=""
                                            >
                                                <source src={course.video} type="video/mp4" />
                                                Tu navegador no soporta el elemento de video.
                                            </video>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-kraft/30">
                                        <div>
                                            <p className="text-2xl font-serif text-gold font-semibold">
                                                ${course.price.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-charcoal/50">MXN / persona</p>
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

            {/* Events */}
            <section className="section section-kraft">
                <div className="container-luxury">
                    <h2 className="font-serif text-3xl text-forest text-center mb-12">Próximos Eventos</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {events.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white border border-kraft/30 overflow-hidden hover:border-gold/50 transition-all p-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 ${event.type === 'live' ? 'bg-red-500/10 text-red-500' : 'bg-gold/20 text-gold'}`}>
                                        {event.type === 'live' ? <Radio className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                                    </div>
                                    <span className={`text-sm font-medium ${event.type === 'live' ? 'text-red-500' : 'text-gold'}`}>
                                        {event.type === 'live' ? '🔴 EN VIVO' : '📍 PRESENCIAL'}
                                    </span>
                                </div>

                                <h3 className="font-serif text-xl text-forest mb-2">{event.title}</h3>
                                <p className="text-charcoal/70 text-sm mb-4">{event.description}</p>

                                <div className="space-y-2 pt-4 border-t border-kraft/30">
                                    <div className="flex items-center gap-2 text-sm text-charcoal/60">
                                        <Calendar className="w-4 h-4 text-gold" />
                                        {event.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-charcoal/60">
                                        <MapPin className="w-4 h-4 text-gold" />
                                        {event.location}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Instructor */}
            <section className="section section-forest">
                <div className="container-luxury">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="aspect-square max-w-md mx-auto lg:mx-0 overflow-hidden">
                            <img
                                src="/gaby-elizalde-instructora.jpg"
                                alt="Maestra Gabriela Elizalde"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/40 text-gold text-sm font-medium mb-4">
                                INSTRUCTORA PRINCIPAL
                            </span>
                            <h2 className="font-serif text-3xl text-cream mb-4">
                                Maestra Gabriela Elizalde
                            </h2>
                            <p className="text-cream/70 leading-relaxed mb-6">
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
                                    <li key={i} className="flex items-center gap-3 text-cream/80">
                                        <span className="w-6 h-6 bg-gold/30 flex items-center justify-center text-gold text-sm">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="https://youtube.com/@JDenismexico"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn bg-red-600 text-white border-red-600 hover:bg-red-700"
                            >
                                ▶️ Ver Tutoriales en YouTube
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section section-cream">
                <div className="container-luxury text-center">
                    <h2 className="font-serif text-3xl text-forest mb-4">¿Dudas sobre nuestros cursos?</h2>
                    <p className="text-charcoal/60 max-w-xl mx-auto mb-8">
                        Contáctanos por WhatsApp para recibir asesoría personalizada sobre
                        el programa ideal para tu nivel.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://wa.me/525527271067"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn bg-green-600 text-white border-green-600 hover:bg-green-700"
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
