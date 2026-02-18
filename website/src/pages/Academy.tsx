import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Radio, Monitor, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAcademyCourses, getAcademyEvents, type AcademyCourse, type AcademyEvent } from '../lib/supabase';

export default function Academy() {
    const [courses, setCourses] = useState<AcademyCourse[]>([]);
    const [events, setEvents] = useState<AcademyEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [coursesData, eventsData] = await Promise.all([
                    getAcademyCourses(true), // Solo activos
                    getAcademyEvents(true)
                ]);
                setCourses(coursesData);
                setEvents(eventsData);
            } catch (error) {
                console.error('Error loading academy data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-400"></div>
            </div>
        );
    }

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
                        ACADEMIA J. DENIS · CERTIFICACIÓN DC-3 / STPS
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl lg:text-5xl text-cream mb-4"
                    >
                        Formación Profesional con Validez DC-3
                    </motion.h1>
                    <p className="text-cream/70 max-w-2xl mx-auto">
                        Cursos certificados ante la STPS con constancia DC-3 incluida.
                        Aprende de la Maestra Gabriela Elizalde, agente capacitador externo
                        con más de 50 años de experiencia y 5,000+ profesionales formados.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4 text-emerald-400 text-sm font-medium">
                        <Shield className="w-4 h-4" />
                        <span>Constancias DC-3 con validez oficial ante la Secretaría del Trabajo y Previsión Social</span>
                    </div>
                </div>
            </section>

            {/* Why Us */}
            <section className="py-12 section-kraft">
                <div className="container-luxury">
                    <div className="grid md:grid-cols-4 gap-6 text-center">
                        {[
                            '📜 Constancia DC-3 / STPS',
                            '👥 Grupos Reducidos',
                            '🧴 Kit de Productos Incluido',
                            '📍 Sede Lindavista, CDMX',
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
                    <h2 className="font-serif text-3xl text-forest text-center mb-4">Cursos con Certificación DC-3</h2>
                    <p className="text-charcoal/60 text-center max-w-2xl mx-auto mb-12">Todos nuestros cursos presenciales incluyen constancia DC-3 con validez ante la STPS, cumpliendo la normativa de capacitación laboral en México.</p>

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
                                                    <>
                                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                                            📍 PRESENCIAL
                                                        </span>
                                                        {course.dc3 && (
                                                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                                                                📜 DC-3 / STPS
                                                            </span>
                                                        )}
                                                    </>
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
                                            {course.next_date}
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
                                                {course.video_title || 'Video Tutorial'}
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

                                    {/* Course Images Gallery */}
                                    {course.images && course.images.length > 0 && (
                                        <div className="mb-6">
                                            <p className="text-sm font-medium text-forest mb-3 flex items-center gap-2">
                                                <span className="text-gold">📸</span>
                                                Información del Curso
                                            </p>
                                            <div className={`grid ${course.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                                                {course.images.map((img, i) => (
                                                    <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block overflow-hidden border border-kraft/30 hover:border-gold/50 transition-all">
                                                        <img
                                                            src={img}
                                                            alt={`${course.title} - Información ${i + 1}`}
                                                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </a>
                                                ))}
                                            </div>
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
                                            href={course.link}
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
                                key={event.id}
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
                                    'Agente capacitador certificado ante STPS',
                                    'Más de 5,000 constancias DC-3 emitidas',
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
                    <h2 className="font-serif text-3xl text-forest mb-4">¿Necesitas tu Constancia DC-3?</h2>
                    <p className="text-charcoal/60 max-w-xl mx-auto mb-8">
                        Contáctanos por WhatsApp para recibir asesoría sobre nuestros cursos
                        certificados ante la STPS. Obtén tu constancia DC-3 y cumple con
                        la normativa de capacitación laboral en estética profesional.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://api.whatsapp.com/send/?phone=525565116087&text=Hola%21+Quiero+inscribirme+al+curso%3A+Lash+Lifting+con+Cisteamina&type=phone_number&app_absent=0"
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
