import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function RegistroDistribuidor() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        businessName: '',
        city: '',
        state: '',
        hasExperience: '',
        interests: [] as string[],
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: dbError } = await supabase
                .from('distributor_applications')
                .insert({
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    business_name: formData.businessName,
                    city: formData.city,
                    state: formData.state,
                    has_experience: formData.hasExperience === 'yes',
                    interests: formData.interests,
                    message: formData.message,
                    status: 'pending'
                });

            if (dbError) throw dbError;
            setSuccess(true);
        } catch (err) {
            setError('Hubo un error al enviar tu solicitud. Intenta nuevamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInterestChange = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    if (success) {
        return (
            <div className="min-h-screen bg-forest flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-lg"
                >
                    <div className="w-20 h-20 bg-gold/20 flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl text-gold">✓</span>
                    </div>
                    <h1 className="font-serif text-3xl text-cream mb-4">¡Solicitud Enviada!</h1>
                    <p className="text-cream/70 mb-8">
                        Gracias por tu interés en ser distribuidor J. Denis.
                        Nuestro equipo revisará tu solicitud y te contactará en un plazo de 24-48 horas hábiles.
                    </p>
                    <Link to="/" className="btn btn-secondary">
                        Volver al Inicio
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden bg-forest">
                <div className="absolute inset-0 botanical-pattern opacity-20" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                <div className="container-luxury relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/40 text-gold text-sm font-medium mb-6">
                            Únete a la Red de Distribuidores
                        </span>
                        <h1 className="font-serif text-4xl lg:text-5xl text-cream mb-6 leading-tight">
                            Conviértete en Distribuidor <span className="text-gold">J. Denis</span>
                        </h1>
                        <p className="text-cream/70 text-lg mb-8">
                            Proveedores de productos cosméticos profesionales para cejas y pestañas.
                            Accede a precios mayoreo, capacitación gratuita y el respaldo de 25 años de experiencia.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Benefits + Form Grid */}
            <section className="section section-cream -mt-8">
                <div className="container-luxury">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Benefits Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="font-serif text-2xl text-forest mb-8">
                                ¿Por qué ser Distribuidor J. Denis?
                            </h2>

                            <div className="space-y-6">
                                {[
                                    {
                                        icon: '💰',
                                        title: 'Precios Preferenciales',
                                        desc: 'Accede a descuentos exclusivos de hasta 40% en toda la línea de productos profesionales.'
                                    },
                                    {
                                        icon: '🎓',
                                        title: 'Capacitación Incluida',
                                        desc: 'Cursos gratuitos con la Maestra Gabriela Elizalde para ti y tu equipo de trabajo.'
                                    },
                                    {
                                        icon: '📦',
                                        title: 'Envíos Prioritarios',
                                        desc: 'Entregas en 24-48 horas y sin costo en pedidos mayores a $3,000 MXN.'
                                    },
                                    {
                                        icon: '🏆',
                                        title: '25 Años de Respaldo',
                                        desc: 'Representa la marca líder en México con patentes propias y manufactura nacional.'
                                    },
                                    {
                                        icon: '📈',
                                        title: 'Material de Marketing',
                                        desc: 'Catálogos digitales, banners y contenido para redes sociales listos para usar.'
                                    },
                                ].map((benefit, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-4 p-4 bg-white border border-kraft/30 hover:border-gold/50 transition-colors"
                                    >
                                        <span className="text-2xl">{benefit.icon}</span>
                                        <div>
                                            <h3 className="font-medium text-forest mb-1">{benefit.title}</h3>
                                            <p className="text-charcoal/60 text-sm">{benefit.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Form Column */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-white border border-kraft/30 p-8">
                                <h2 className="font-serif text-2xl text-forest mb-6">
                                    Solicita tu Registro
                                </h2>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-pearl/60 text-sm mb-2">Nombre Completo *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.fullName}
                                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                className="w-full px-4 py-3 bg-noir/50 border border-pearl/10 rounded-lg text-pearl focus:border-rose-gold focus:outline-none transition-colors"
                                                placeholder="Tu nombre"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-pearl/60 text-sm mb-2">Email *</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-noir/50 border border-pearl/10 rounded-lg text-pearl focus:border-rose-gold focus:outline-none transition-colors"
                                                placeholder="tu@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-pearl/60 text-sm mb-2">Teléfono / WhatsApp *</label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-3 bg-noir/50 border border-pearl/10 rounded-lg text-pearl focus:border-rose-gold focus:outline-none transition-colors"
                                                placeholder="55 1234 5678"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-pearl/60 text-sm mb-2">Nombre del Negocio</label>
                                            <input
                                                type="text"
                                                value={formData.businessName}
                                                onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                                className="w-full px-4 py-3 bg-noir/50 border border-pearl/10 rounded-lg text-pearl focus:border-rose-gold focus:outline-none transition-colors"
                                                placeholder="Salón / Estética"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-pearl/60 text-sm mb-2">Ciudad *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-4 py-3 bg-noir/50 border border-pearl/10 rounded-lg text-pearl focus:border-rose-gold focus:outline-none transition-colors"
                                                placeholder="Ciudad de México"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-pearl/60 text-sm mb-2">Estado *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.state}
                                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                                className="w-full px-4 py-3 bg-noir/50 border border-pearl/10 rounded-lg text-pearl focus:border-rose-gold focus:outline-none transition-colors"
                                                placeholder="CDMX"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-pearl/60 text-sm mb-2">¿Tienes experiencia en el ramo de belleza? *</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="experience"
                                                    value="yes"
                                                    checked={formData.hasExperience === 'yes'}
                                                    onChange={e => setFormData({ ...formData, hasExperience: e.target.value })}
                                                    className="w-4 h-4 accent-rose-gold"
                                                />
                                                <span className="text-pearl/70">Sí</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="experience"
                                                    value="no"
                                                    checked={formData.hasExperience === 'no'}
                                                    onChange={e => setFormData({ ...formData, hasExperience: e.target.value })}
                                                    className="w-4 h-4 accent-rose-gold"
                                                />
                                                <span className="text-pearl/70">No, pero me interesa</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-pearl/60 text-sm mb-2">¿Qué te interesa? (selecciona uno o más)</label>
                                        <div className="flex flex-wrap gap-3">
                                            {['Productos', 'Cursos', 'Distribución', 'Todo'].map(interest => (
                                                <label
                                                    key={interest}
                                                    className={`px-4 py-2 rounded-full border cursor-pointer transition-colors ${formData.interests.includes(interest)
                                                        ? 'bg-rose-gold/20 border-rose-gold text-rose-gold'
                                                        : 'border-pearl/20 text-pearl/60 hover:border-pearl/40'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={formData.interests.includes(interest)}
                                                        onChange={() => handleInterestChange(interest)}
                                                    />
                                                    {interest}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-pearl/60 text-sm mb-2">Mensaje adicional (opcional)</label>
                                        <textarea
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-noir/50 border border-pearl/10 rounded-lg text-pearl focus:border-rose-gold focus:outline-none transition-colors resize-none"
                                            placeholder="Cuéntanos más sobre tu negocio o intereses..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full btn bg-rose-gold text-noir font-bold hover:bg-champagne transition-colors py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Enviando...' : 'Enviar Solicitud'}
                                    </button>

                                    <p className="text-pearl/40 text-xs text-center">
                                        Al enviar este formulario aceptas nuestros términos y condiciones.
                                        Te contactaremos en máximo 48 horas hábiles.
                                    </p>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SEO Section */}
            <section className="section section-dark">
                <div className="container-luxury">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-serif text-2xl text-champagne mb-6">
                            Proveedor de Productos Cosméticos Profesionales en México
                        </h2>
                        <p className="text-pearl/50 leading-relaxed mb-6">
                            J. Denis es el proveedor líder de productos para cejas y pestañas en México desde 1998.
                            Ofrecemos precios competitivos para estéticas, salones de belleza y profesionales independientes.
                            Nuestros cursos certificados te preparan para ofrecer servicios de Lash Lifting, Laminado de Cejas,
                            Henna para Cejas y más técnicas con alta demanda.
                        </p>
                        <p className="text-pearl/50 leading-relaxed">
                            Únete a más de 5,000 profesionales que ya distribuyen nuestros productos en todo el país.
                            Manufactura 100% mexicana, patentes propias y el respaldo de la Maestra Gabriela Elizalde,
                            pionera del mercado de cejas y pestañas en Latinoamérica.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
