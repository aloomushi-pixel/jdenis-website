import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Radio, Monitor } from 'lucide-react';

const courses = [
    // ── PRESENCIALES (basados en redes sociales) ──
    {
        id: 1,
        title: 'Lash Lifting con Cisteamina',
        duration: '2 días',
        price: 4500,
        description: 'Domina la técnica de lifting con Cisteamina Estabilizada. El sistema más seguro del mercado, sin ácido tioglicólico. Incluye práctica con modelo real.',
        topics: ['Cisteamina vs. Tioglicólico', 'Shot 1.5 Hidratante', 'Selección de pads', 'Práctica con modelo'],
        nextDate: '3 de Marzo 2026',
        badge: 'presencial',
    },
    {
        id: 2,
        title: 'Lifting Coreano (Korean Lash Lift)',
        duration: '1 día',
        price: 3800,
        description: 'La técnica de 51K reproducciones en nuestro directo. Rizo abierto y natural con Cisteamina + Shot 1.5. Incluye kit de práctica.',
        topics: ['Filosofía K-Beauty', 'Molde plano vs. nube', 'Combo Cisteamina + Shot 1.5', 'Rizo tipo J y L'],
        nextDate: '5 de Marzo 2026',
        badge: 'presencial',
    },
    {
        id: 3,
        title: 'Laminado de Cejas Profesional',
        duration: '1 día',
        price: 3500,
        description: 'Aprende de los creadores del laminado de cejas en México. Técnica completa de moldeo, fijación y coloración con Brow Henna.',
        topics: ['Mapeo y diseño de cejas', 'Laminado paso a paso', 'Brow Henna tono a tono', 'Aftercare'],
        nextDate: '10 de Marzo 2026',
        badge: 'presencial',
        video: '/videos/Video_con_logo_J_DENIS.mp4',
        videoTitle: 'Técnica Brow Henna J. Denis',
    },

    // ── EN LÍNEA / EN VIVO (basados en Facebook Lives) ──
    {
        id: 4,
        title: 'Business Pro 2026 by Gaby Cisneros',
        duration: '2 horas',
        price: 0,
        description: '¡GRATIS! "Evolución de los Colorantes en Cejas" impartido por Gabriela Elizalde, CEO de J. Denis. Acceso vía WhatsApp.',
        topics: ['Historia de los colorantes', 'Henna vs. tinturas tópicas', 'Tendencias 2026', 'Sesión de preguntas'],
        nextDate: '23 de Febrero 2026, 6:00 PM',
        badge: 'online',
    },
    {
        id: 5,
        title: 'Masterclass: Lifting Coreano & Cisteamina',
        duration: '1.5 horas',
        price: 0,
        description: '¡GRATIS! Reprise del Live más visto (+51K reproducciones). La Maestra Gaby explica paso a paso el nuevo sistema de lifting coreano con Cisteamina.',
        topics: ['¿Qué es Cisteamina?', 'Etanolamina explicada', 'Demo en vivo del combo', 'Resolución de dudas'],
        nextDate: 'Disponible en replay',
        badge: 'replay',
    },
    {
        id: 6,
        title: 'Glue Less Powder: Técnica sin Adhesivo',
        duration: '45 min',
        price: 0,
        description: '¡GRATIS! Aprende a utilizar el revolucionario adhesivo en polvo para lifting de pestañas. Ideal para pieles sensibles.',
        topics: ['Aplicación del polvo', 'Ventajas vs. adhesivo líquido', 'Pieles sensibles', 'Tips de la Maestra Gaby'],
        nextDate: 'Disponible en replay',
        badge: 'replay',
    },
];

const events = [
    {
        title: 'A la Belleza Profesional',
        date: '15-16 de Febrero 2026',
        location: 'Stands #64 y #72, Centro de Convenciones, CDMX',
        description: 'J. Denis estará presente con demostraciones en vivo de Cisteamina Estabilizada, Shot 1.5 y el nuevo sistema Glue Less Powder.',
        type: 'congreso' as const,
    },
    {
        title: 'Business Pro 2026 — Gaby Cisneros',
        date: '23 de Febrero 2026, 6:00 PM',
        location: 'Online vía WhatsApp (acceso gratuito)',
        description: '"Evolución de los Colorantes en Cejas" por la CEO Gabriela Elizalde. Sigue elevando tu conocimiento profesional desde donde estés.',
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
                                            <div className="flex items-center gap-2 mb-1">
                                                {course.badge === 'online' && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                                                        <Monitor className="w-3 h-3" /> ONLINE
                                                    </span>
                                                )}
                                                {course.badge === 'replay' && (
                                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                                                        <Radio className="w-3 h-3" /> REPLAY
                                                    </span>
                                                )}
                                                {course.badge === 'presencial' && (
                                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                                        📍 PRESENCIAL
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-serif text-xl text-forest">
                                                {course.title}
                                            </h3>
                                            <p className="text-charcoal/60 text-sm">
                                                Duración: {course.duration}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-gold/20 border border-gold/40 text-gold text-sm shrink-0">
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
                                            {course.price > 0 ? (
                                                <>
                                                    <p className="text-2xl font-serif text-gold font-semibold">
                                                        ${course.price.toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-charcoal/50">MXN / persona</p>
                                                </>
                                            ) : (
                                                <p className="text-2xl font-serif text-emerald-600 font-semibold">
                                                    GRATIS
                                                </p>
                                            )}
                                        </div>
                                        <a
                                            href={`https://wa.me/525527271067?text=Hola! Quiero información sobre el curso: ${course.title}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary"
                                        >
                                            {course.badge === 'presencial' ? 'Inscribirme' : course.badge === 'replay' ? 'Ver Replay' : 'Acceso Gratuito'}
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
