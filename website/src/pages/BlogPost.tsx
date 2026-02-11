import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, BookmarkPlus, Eye, Sparkles, BookOpen, AlertTriangle, CheckCircle, XCircle, FlaskConical, Droplets, Star, Zap } from 'lucide-react';

// Blog content data
const blogContent: Record<string, {
    title: string;
    category: string;
    readTime: string;
    gradient: string;
    content: React.ReactNode;
}> = {
    'cisteamina-estabilizada': {
        title: 'Cisteamina Estabilizada: La Revolución del Lifting Seguro',
        category: 'Innovación',
        readTime: '7 min',
        gradient: 'from-teal-500 to-emerald-600',
        content: <CisteaminaContent />
    },
    'shot-hidratante-1-5': {
        title: 'Shot 1.5 Hidratante: El Secreto del Paso 2',
        category: 'Producto Estrella',
        readTime: '6 min',
        gradient: 'from-cyan-500 to-blue-600',
        content: <ShotHidratanteContent />
    },
    'historia-laminado-cejas': {
        title: 'Historia del Laminado de Cejas en México: Los Pioneros de J. Denis',
        category: 'Historia',
        readTime: '8 min',
        gradient: 'from-amber-500 to-orange-600',
        content: <HistoriaLaminadoContent />
    },
    'lifting-coreano-vs-clasico': {
        title: 'Lifting Coreano vs. Lifting Clásico: ¿Cuál Elegir?',
        category: 'Comparativa',
        readTime: '9 min',
        gradient: 'from-rose-500 to-pink-600',
        content: <LiftingCoreanoContent />
    },
    'glue-less-powder': {
        title: 'Glue Less Powder: La Tecnología de Fijación sin Pegamento',
        category: 'Innovación',
        readTime: '5 min',
        gradient: 'from-violet-500 to-purple-600',
        content: <GlueLessPowderContent />
    },
    'semaforo-salud-capilar': {
        title: 'Semáforo de Salud Capilar: Guía de Diagnóstico para Pestañas',
        category: 'Guía de Diagnóstico',
        readTime: '8 min',
        gradient: 'from-emerald-500 to-teal-600',
        content: <SemaforoContent />
    },
    'laminado-vs-microblading': {
        title: 'Laminado vs. Microblading: Por Qué Tu Mirada Prefiere la Química Inteligente',
        category: 'Comparativa',
        readTime: '10 min',
        gradient: 'from-purple-500 to-pink-600',
        content: <LaminadoContent />
    },
    'pad-nube-vs-plano': {
        title: 'Pad Nube vs. Pad Plano: Guía Técnica para Profesionales',
        category: 'Tutorial Técnico',
        readTime: '5 min',
        gradient: 'from-blue-500 to-indigo-600',
        content: <PadContent />
    }
};

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const post = slug ? blogContent[slug] : null;

    if (!post) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Artículo no encontrado</h1>
                    <Link to="/blog" className="text-purple-400 hover:text-purple-300">
                        ← Volver al blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="py-8 px-4 border-b border-slate-700/50">
                <div className="container mx-auto">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
                        <ArrowLeft className="w-5 h-5" />
                        Volver al blog
                    </Link>

                    <div className="max-w-4xl">
                        <span className={`inline-block px-4 py-1 bg-gradient-to-r ${post.gradient} text-white text-sm font-medium rounded-full mb-4`}>
                            {post.category}
                        </span>

                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-6 text-gray-400">
                            <span className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                {post.readTime} de lectura
                            </span>
                            <span className="text-sm">Por el Equipo Técnico de J. Denis</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <article className="py-12 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="prose prose-invert prose-lg max-w-none">
                        {post.content}
                    </div>
                </div>
            </article>

            {/* Share & Actions */}
            <div className="py-8 px-4 border-t border-slate-700/50">
                <div className="container mx-auto max-w-4xl flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors">
                            <Share2 className="w-5 h-5" />
                            Compartir
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors">
                            <BookmarkPlus className="w-5 h-5" />
                            Guardar
                        </button>
                    </div>

                    <Link
                        to="/blog"
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
                    >
                        Ver más artículos →
                    </Link>
                </div>
            </div>
        </div>
    );
}

// === ARTICLE CONTENT COMPONENTS ===

function SemaforoContent() {
    return (
        <div className="space-y-8">
            <blockquote className="border-l-4 border-purple-500 pl-6 italic text-gray-300 text-xl">
                "El conocimiento elimina el miedo. Antes de aplicar cualquier tratamiento de lifting, conoce el estado real de tus pestañas."
            </blockquote>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Eye className="w-6 h-6 text-purple-400" />
                    Por Qué Necesitas Este Diagnóstico
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    Antes de realizar un lifting o laminado, es fundamental conocer el "semáforo" de salud de tu pestaña. Este diagnóstico visual y táctil te permitirá identificar si estás lista para el tratamiento o si necesitas un período de recuperación.
                </p>
            </section>

            {/* Verde */}
            <section className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    🟢 VERDE: Pestaña Sana — Lista para el Tratamiento
                </h3>
                <div className="space-y-4 text-gray-300">
                    <div>
                        <h4 className="font-semibold text-white mb-2">Características Visuales:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Color negro intenso o marrón oscuro uniforme</li>
                            <li>Brillo natural, sin aspecto opaco o pajizo</li>
                            <li>Línea de pestañas completa, sin espacios evidentes</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-2">¿Puedes hacer lifting?</h4>
                        <p className="text-emerald-400 font-medium">SÍ. Tu pestaña está en condiciones óptimas.</p>
                    </div>
                </div>
            </section>

            {/* Amarillo */}
            <section className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6" />
                    🟡 AMARILLO: Pestaña Debilitada — Precaución Necesaria
                </h3>
                <div className="space-y-4 text-gray-300">
                    <div>
                        <h4 className="font-semibold text-white mb-2">Características de Alerta:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Color ligeramente decolorado en las puntas</li>
                            <li>Textura áspera o rígida</li>
                            <li>Direcciones irregulares, pestañas "rebeldes"</li>
                            <li>Más caída de lo normal</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-2">¿Puedes hacer lifting?</h4>
                        <p className="text-yellow-400 font-medium">CON PRECAUCIÓN. Reduce los tiempos de procesamiento en un 20-30%.</p>
                    </div>
                </div>
            </section>

            {/* Rojo */}
            <section className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30">
                <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-3">
                    <XCircle className="w-6 h-6" />
                    🔴 ROJO: Pestaña Sobreprocesada — Detén Todo Tratamiento
                </h3>
                <div className="space-y-4 text-gray-300">
                    <div>
                        <h4 className="font-semibold text-white mb-2">Señales de Alarma Críticas:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Aspecto "quemado": puntas blancas o transparentes</li>
                            <li>Encrespamiento extremo tipo "gancho"</li>
                            <li>Se rompen al mínimo contacto</li>
                            <li>Textura de "paja", completamente deshidratadas</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-2">¿Puedes hacer lifting?</h4>
                        <p className="text-red-400 font-medium">NO. Realizar cualquier tratamiento químico causará más daño. Prioriza la recuperación (8-12 semanas).</p>
                    </div>
                </div>
            </section>

            {/* Reacciones */}
            <section className="p-6 rounded-2xl bg-slate-800 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">🚨 Hormigueo Normal vs. Reacción Alérgica</h3>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                        <h4 className="font-semibold text-emerald-400 mb-3">✅ Sensaciones NORMALES</h4>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Hormigueo leve (2-5 min)</li>
                            <li>• Ligera frescura</li>
                            <li>• Sensación de tensión</li>
                            <li>• Lagrimeo leve ocasional</li>
                        </ul>
                        <p className="mt-3 text-emerald-400 text-sm font-medium">Desaparecen al finalizar</p>
                    </div>

                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                        <h4 className="font-semibold text-red-400 mb-3">🚨 REACCIÓN ALÉRGICA</h4>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Ardor intenso que no cede</li>
                            <li>• Hinchazón del párpado</li>
                            <li>• Enrojecimiento que se extiende</li>
                            <li>• Dificultad para abrir el ojo</li>
                        </ul>
                        <p className="mt-3 text-red-400 text-sm font-medium">¡Actúa inmediatamente!</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

function LaminadoContent() {
    return (
        <div className="space-y-8">
            <blockquote className="border-l-4 border-purple-500 pl-6 italic text-gray-300 text-xl">
                "La belleza moderna no exige sufrimiento. Exige inteligencia."
            </blockquote>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    La Nueva Era del Cuidado Ocular
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    El 67% de las mujeres entre 25-45 años reportan <strong className="text-white">fatiga hacia procedimientos dolorosos</strong>. La tendencia "Clean Girl" no es solo una estética—es una filosofía que prioriza la salud sobre el drama.
                </p>
            </section>

            {/* Comparison Table */}
            <section className="overflow-x-auto">
                <h3 className="text-xl font-bold text-white mb-4">📊 Cuadro Comparativo</h3>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-800">
                            <th className="p-4 text-left text-gray-400 font-medium border-b border-slate-700">Factor</th>
                            <th className="p-4 text-left text-purple-400 font-medium border-b border-slate-700">Laminado J. Denis</th>
                            <th className="p-4 text-left text-gray-400 font-medium border-b border-slate-700">Microblading</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        <tr className="border-b border-slate-700/50">
                            <td className="p-4">Duración</td>
                            <td className="p-4 text-emerald-400">45-60 min</td>
                            <td className="p-4">2-3 horas</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                            <td className="p-4">Dolor</td>
                            <td className="p-4 text-emerald-400">❌ Ninguno</td>
                            <td className="p-4 text-red-400">✅ Moderado a intenso</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                            <td className="p-4">Recuperación</td>
                            <td className="p-4 text-emerald-400">0 días</td>
                            <td className="p-4 text-red-400">7-14 días</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                            <td className="p-4">¿Reversible?</td>
                            <td className="p-4 text-emerald-400">✅ Sí (6-8 semanas)</td>
                            <td className="p-4 text-red-400">❌ No (1-3 años)</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                            <td className="p-4">Riesgo de cicatrices</td>
                            <td className="p-4 text-emerald-400">❌ Ninguno</td>
                            <td className="p-4 text-yellow-400">⚠️ Posible</td>
                        </tr>
                        <tr>
                            <td className="p-4">Costo promedio</td>
                            <td className="p-4 text-emerald-400">$500-800 MXN</td>
                            <td className="p-4">$3,000-8,000 MXN</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Cost Analysis */}
            <section className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <h4 className="font-bold text-purple-400 mb-4">💰 Laminado (6 sesiones/año)</h4>
                    <ul className="text-gray-300 space-y-2">
                        <li>6 sesiones × $600 = $3,600</li>
                        <li>Sérum de mantenimiento = $400</li>
                        <li className="font-bold text-white pt-2 border-t border-purple-500/30">Total anual: $4,000 MXN</li>
                    </ul>
                </div>
                <div className="p-6 rounded-xl bg-slate-800 border border-slate-700">
                    <h4 className="font-bold text-gray-400 mb-4">Microblading (1 + retoque/año)</h4>
                    <ul className="text-gray-300 space-y-2">
                        <li>Sesión inicial = $5,000</li>
                        <li>Retoque = $2,000</li>
                        <li>Productos = $800</li>
                        <li className="font-bold text-white pt-2 border-t border-slate-600">Total anual: $7,800 MXN</li>
                    </ul>
                </div>
            </section>

            <div className="p-6 rounded-xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 text-center">
                <p className="text-2xl font-bold text-white">Ahorro con Laminado: $3,800 MXN al año 💸</p>
            </div>
        </div>
    );
}

function PadContent() {
    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                    Guía Técnica para Profesionales
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    ¿Pad Nube o Pad Plano? La respuesta correcta depende de UN factor: <strong className="text-white">la anatomía del ojo de tu clienta</strong>.
                </p>
            </section>

            {/* Pad Nube */}
            <section className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-400 mb-4">☁️ PAD NUBE — Curvatura 180°</h3>
                <div className="space-y-4 text-gray-300">
                    <p>Curvatura pronunciada con bordes suaves. Su elevación compensa la falta de espacio y proyecta la pestaña hacia arriba.</p>
                    <div>
                        <h4 className="font-semibold text-white mb-2">Ideal para:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Ojo encapotado</li>
                            <li>Ojo asiático monopárpado</li>
                            <li>Párpados con poco espacio de pliegue</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Pad Plano */}
            <section className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
                <h3 className="text-xl font-bold text-indigo-400 mb-4">📐 PAD PLANO — Curvatura 140°</h3>
                <div className="space-y-4 text-gray-300">
                    <p>Superficie uniforme con menor elevación. Mantiene las pestañas más cerca del párpado para un efecto natural.</p>
                    <div>
                        <h4 className="font-semibold text-white mb-2">Ideal para:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Ojo prominente / saltón</li>
                            <li>Ojos grandes con espacio amplio</li>
                            <li>Cuando se busca efecto sutil</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Quick Test */}
            <section className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-4">📏 TEST RÁPIDO de Evaluación</h3>
                <div className="text-gray-300 space-y-4">
                    <p>Pide a tu clienta que cierre los ojos y mire hacia abajo:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-slate-800/50">
                            <p className="font-semibold text-emerald-400">¿Pestañas visibles?</p>
                            <p className="text-white">→ PAD PLANO</p>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-800/50">
                            <p className="font-semibold text-blue-400">¿Pestañas ocultas?</p>
                            <p className="text-white">→ PAD NUBE</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pro Tip */}
            <section className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">⚠️ Error Común</h3>
                <p className="text-gray-300">
                    El error más común es usar siempre el mismo pad. <strong className="text-white">Cada ojo es único</strong>. A veces, incluso entre el ojo izquierdo y derecho de la misma clienta, necesitarás combinar. Eso es maestría técnica.
                </p>
            </section>

            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/30 text-center">
                <p className="text-xl font-bold text-white">
                    "En J. Denis, la técnica se adapta al ojo, nunca al revés."
                </p>
            </div>
        </div>
    );
}

// === NEW ARTICLE CONTENT COMPONENTS ===

function CisteaminaContent() {
    return (
        <div className="space-y-8">
            {/* YouTube Video */}
            <div className="rounded-2xl overflow-hidden border border-slate-700">
                <div className="aspect-video">
                    <iframe
                        src="https://www.youtube.com/embed/6xHqS2KhLSg"
                        title="LIVE INFORMATIVO | ¿QUÉ ES CISTEAMINA Y ETANOLAMINA? - J. Denis"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>
                <div className="bg-slate-800 px-6 py-3 text-center">
                    <p className="text-sm text-gray-400">🎥 LIVE INFORMATIVO: ¿Qué es Cisteamina y Etanolamina? — J. Denis México</p>
                </div>
            </div>

            <blockquote className="border-l-4 border-teal-500 pl-6 italic text-gray-300 text-xl">
                "La cisteamina no solo es más segura que el ácido tioglicólico—produce resultados que antes eran imposibles."
            </blockquote>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <FlaskConical className="w-6 h-6 text-teal-400" />
                    ¿Qué es la Cisteamina Estabilizada?
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    La <strong className="text-white">Cisteamina Estabilizada</strong> es un aminoácido derivado de la cisteína que actúa rompiendo los puentes de disulfuro de la queratina capilar de manera controlada y suave. A diferencia del ácido tioglicólico, la cisteamina trabaja a un pH más cercano al natural de la piel, reduciendo drásticamente el riesgo de irritación y sobreprocesamiento.
                </p>
            </section>

            <section className="p-6 rounded-2xl bg-teal-500/10 border border-teal-500/30">
                <h3 className="text-xl font-bold text-teal-400 mb-4">🧪 Cisteamina vs. Ácido Tioglicólico</h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-800">
                                <th className="p-3 text-left text-gray-400 font-medium border-b border-slate-700">Factor</th>
                                <th className="p-3 text-left text-teal-400 font-medium border-b border-slate-700">Cisteamina J. Denis</th>
                                <th className="p-3 text-left text-gray-400 font-medium border-b border-slate-700">Tioglicólico</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            <tr className="border-b border-slate-700/50">
                                <td className="p-3">pH</td>
                                <td className="p-3 text-teal-400">6.0-7.0 (cercano al natural)</td>
                                <td className="p-3">8.5-9.5 (alcalino)</td>
                            </tr>
                            <tr className="border-b border-slate-700/50">
                                <td className="p-3">Olor</td>
                                <td className="p-3 text-teal-400">Mínimo</td>
                                <td className="p-3 text-red-400">Intenso (azufre)</td>
                            </tr>
                            <tr className="border-b border-slate-700/50">
                                <td className="p-3">Riesgo de quemadura</td>
                                <td className="p-3 text-teal-400">Muy bajo</td>
                                <td className="p-3 text-red-400">Moderado-Alto</td>
                            </tr>
                            <tr className="border-b border-slate-700/50">
                                <td className="p-3">Hidratación post</td>
                                <td className="p-3 text-teal-400">Conserva hidratación</td>
                                <td className="p-3 text-yellow-400">Reseca la fibra</td>
                            </tr>
                            <tr>
                                <td className="p-3">Resultado</td>
                                <td className="p-3 text-teal-400">Rizo definido + brillo</td>
                                <td className="p-3">Rizo pero fibra opaca</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-4">💡 ¿Cómo Usarla en tu Servicio?</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                        <p className="font-bold text-teal-400 mb-2">Paso 1</p>
                        <p className="text-gray-300 text-sm">Aplica la Cisteamina Estabilizada como loción de fijación (reemplaza el paso tradicional).</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                        <p className="font-bold text-teal-400 mb-2">Paso 1.5</p>
                        <p className="text-gray-300 text-sm">Aplica el Shot Hidratante para reforzar los puentes de disulfuro. Este es el paso secreto.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                        <p className="font-bold text-teal-400 mb-2">Paso 2</p>
                        <p className="text-gray-300 text-sm">Prosigue con la loción de neutralización estándar. Resultado: rizo duradero con brillo.</p>
                    </div>
                </div>
            </section>

            <section className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">✅ Beneficios Comprobados</h3>
                <ul className="text-gray-300 space-y-2">
                    <li>• Lifting más duradero (6-8 semanas vs 4-6 con tioglicólico)</li>
                    <li>• Sin necesidad de periodo de "descanso" entre sesiones</li>
                    <li>• Compatible con pestañas teñidas y extensiones</li>
                    <li>• Ideal para pieles sensibles y clientas con alergias</li>
                    <li>• Resultado más natural: rizo con movimiento, no "enganchado"</li>
                </ul>
            </section>

            <div className="p-6 rounded-xl bg-gradient-to-r from-teal-900/50 to-emerald-900/50 border border-teal-500/30 text-center">
                <p className="text-xl font-bold text-white">
                    J. Denis: Innovación que cuida la pestaña, no solo la moldea. 🧬
                </p>
            </div>
        </div>
    );
}

function ShotHidratanteContent() {
    return (
        <div className="space-y-8">
            {/* YouTube Video */}
            <div className="rounded-2xl overflow-hidden border border-slate-700">
                <div className="aspect-video">
                    <iframe
                        src="https://www.youtube.com/embed/ANGTSbaUgXM"
                        title="EVOLUCIÓN DE PRODUCTOS PARA LIFTING Y TÉCNICAS DE APLICACIÓN - J. Denis"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>
                <div className="bg-slate-800 px-6 py-3 text-center">
                    <p className="text-sm text-gray-400">🎥 Evolución de Productos para Lifting y Técnicas de Aplicación — J. Denis</p>
                </div>
            </div>

            <blockquote className="border-l-4 border-cyan-500 pl-6 italic text-gray-300 text-xl">
                "Entre el paso 1 y el paso 2, existe un momento crucial. Ahí es donde el Shot 1.5 transforma el resultado."
            </blockquote>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Droplets className="w-6 h-6 text-cyan-400" />
                    ¿Qué es el Shot 1.5 Hidratante?
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    El <strong className="text-white">Shot 1.5 Hidratante</strong> es una fórmula concentrada desarrollada por J. Denis que se aplica entre el paso 1 (fijación con cisteamina) y el paso 2 (neutralización) del lifting de pestañas. Su función es <strong className="text-white">hidratar y reforzar los puentes de disulfuro</strong> durante el proceso, asegurando que la fibra mantenga su elasticidad y brillo natural.
                </p>
            </section>

            <section className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">🔬 ¿Cómo Funciona?</h3>
                <div className="space-y-4 text-gray-300">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-lg bg-slate-800/50">
                            <h4 className="font-semibold text-cyan-400 mb-2">Sin Shot 1.5</h4>
                            <p className="text-sm">La cisteamina rompe los puentes → la neutralización los reforma. Pero la fibra pierde agua en el proceso, quedando seca.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-slate-800/50">
                            <h4 className="font-semibold text-emerald-400 mb-2">Con Shot 1.5 ✨</h4>
                            <p className="text-sm">La cisteamina rompe los puentes → el Shot hidrata y llena los espacios → la neutralización reforma puentes más fuertes y flexibles.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-4">📋 Protocolo de Aplicación</h3>
                <div className="space-y-3">
                    {[
                        { step: '1', title: 'Retira la loción de cisteamina', desc: 'Limpia con algodón húmedo sin frotar', time: '30 seg' },
                        { step: '1.5', title: 'Aplica el Shot Hidratante', desc: 'Una gota por ojo. Distribuye con micropincel', time: '5 min' },
                        { step: '2', title: 'Aplica la loción neutralizadora', desc: 'Procede con el paso 2 estándar', time: '5-8 min' },
                    ].map((item) => (
                        <div key={item.step} className="flex gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
                            <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/40 rounded-full flex items-center justify-center text-cyan-400 font-bold shrink-0">
                                {item.step}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{item.title}</p>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                                <p className="text-cyan-400 text-xs mt-1">⏱️ {item.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">✅ Resultados Visibles</h3>
                <ul className="text-gray-300 space-y-2">
                    <li>• Pestañas con brillo natural, no aspecto seco</li>
                    <li>• Mayor duración del rizo (hasta 2 semanas más)</li>
                    <li>• Textura suave al tacto</li>
                    <li>• Compatible con Lifting Coreano y Clásico</li>
                    <li>• Reduce el riesgo de sobreprocesamiento en pestañas finas</li>
                </ul>
            </section>

            <div className="p-6 rounded-xl bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 text-center">
                <p className="text-xl font-bold text-white">
                    El Shot 1.5: El paso que las mejores profesionales no se saltan. 💧
                </p>
            </div>
        </div>
    );
}

function HistoriaLaminadoContent() {
    return (
        <div className="space-y-8">
            {/* YouTube Video */}
            <div className="rounded-2xl overflow-hidden border border-slate-700">
                <div className="aspect-video">
                    <iframe
                        src="https://www.youtube.com/embed/Oe2G3l77nmI"
                        title="Brow Lifting Laminado de Ceja J.Denis"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>
                <div className="bg-slate-800 px-6 py-3 text-center">
                    <p className="text-sm text-gray-400">🎥 Brow Lifting — Laminado de Cejas por J. Denis México</p>
                </div>
            </div>

            <blockquote className="border-l-4 border-amber-500 pl-6 italic text-gray-300 text-xl">
                "Antes de que el laminado de cejas existiera en México, existía J. Denis."
            </blockquote>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Star className="w-6 h-6 text-amber-400" />
                    Los Creadores del Laminado en México
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    En su perfil de Instagram, J. Denis se describe como <strong className="text-white">"los creadores del laminado de cejas en México"</strong>. Y no es una exageración. Fundada en 1998 por la Maestra Gabriela Elizalde, J. Denis fue la primera marca mexicana en desarrollar y comercializar un sistema completo de laminado para cejas y pestañas.
                </p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-4">📅 Línea del Tiempo</h3>
                <div className="space-y-4">
                    {[
                        { year: '1998', event: 'Fundación de J. Denis', desc: 'La Maestra Gabriela Elizalde funda J. Denis en la Ciudad de México, enfocándose en productos profesionales para cejas y pestañas.' },
                        { year: '2005', event: 'Primeras patentes', desc: 'Desarrollo de fórmulas propias de lifting que marcan la diferencia en el mercado latinoamericano.' },
                        { year: '2012', event: 'El laminado llega a México', desc: 'J. Denis introduce oficialmente la técnica de laminado de cejas, adaptándola a la anatomía facial latina.' },
                        { year: '2018', event: 'Expansión nacional', desc: 'Red de distribuidores en todo México. Más de 3,000 profesionales capacitados.' },
                        { year: '2023', event: 'Era de la Cisteamina', desc: 'Lanzamiento de la línea de Cisteamina Estabilizada, abandonando el ácido tioglicólico.' },
                        { year: '2026', event: 'Innovación continua', desc: 'Lanzamiento del Shot 1.5 Hidratante y participación en Beauty Coat. +5,000 alumnas formadas.' },
                    ].map((item) => (
                        <div key={item.year} className="flex gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
                            <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 rounded-lg flex items-center justify-center text-amber-400 font-bold shrink-0 text-sm">
                                {item.year}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{item.event}</p>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <h3 className="text-xl font-bold text-amber-400 mb-4">🏆 J. Denis en Números</h3>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-slate-800/50">
                        <p className="text-3xl font-bold text-amber-400">25+</p>
                        <p className="text-gray-400 text-sm">Años de experiencia</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50">
                        <p className="text-3xl font-bold text-amber-400">5,000+</p>
                        <p className="text-gray-400 text-sm">Profesionales formadas</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50">
                        <p className="text-3xl font-bold text-amber-400">78K</p>
                        <p className="text-gray-400 text-sm">Seguidores en Facebook</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50">
                        <p className="text-3xl font-bold text-amber-400">13.4K</p>
                        <p className="text-gray-400 text-sm">Seguidores en Instagram</p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-4">🌿 La Filosofía J. Denis</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                    "Deja que tus ojos hablen por ti" no es solo un eslogan. Es la filosofía de una marca que prioriza la salud de la fibra capilar por encima de todo. Mientras otros compiten por tiempos más cortos, J. Denis compite por resultados más naturales y más seguros.
                </p>
                <p className="text-gray-300 leading-relaxed">
                    Desde su Sala Técnica en Av. Montevideo #136, Col. Lindavista, la Maestra Gaby y su equipo continúan formando a la nueva generación de profesionales que llevarán la industria de la belleza mexicana a otro nivel.
                </p>
            </section>

            <div className="p-6 rounded-xl bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-500/30 text-center">
                <p className="text-xl font-bold text-white">
                    "Deja que tus ojos hablen por ti." — J. Denis, desde 1998 ✨
                </p>
            </div>
        </div>
    );
}

function LiftingCoreanoContent() {
    return (
        <div className="space-y-8">
            {/* YouTube Video */}
            <div className="rounded-2xl overflow-hidden border border-slate-700">
                <div className="aspect-video">
                    <iframe
                        src="https://www.youtube.com/embed/ZSCdSSjicBU"
                        title="✨ Técnica Coreana versión J.DENIS ✨"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>
                <div className="bg-slate-800 px-6 py-3 text-center">
                    <p className="text-sm text-gray-400">🎥 ✨ Técnica Coreana versión J.DENIS ✨ — Lifting Coreano paso a paso</p>
                </div>
            </div>

            <blockquote className="border-l-4 border-rose-500 pl-6 italic text-gray-300 text-xl">
                "No es solo un lifting. Es una filosofía diferente de cómo la pestaña debe lucir."
            </blockquote>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-rose-400" />
                    ¿Qué es el Lifting Coreano?
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    El <strong className="text-white">Lifting Coreano</strong> (también conocido como Korean Lash Lift) se diferencia del lifting clásico en su enfoque: busca un <strong className="text-white">rizo más abierto y natural</strong>, imitando el efecto de pestañas naturalmente curvadas, en lugar del rizo pronunciado tipo "C" del lifting tradicional. La técnica se originó en Corea del Sur como parte de la filosofía K-Beauty de realzar sin transformar.
                </p>
            </section>

            <section className="overflow-x-auto">
                <h3 className="text-xl font-bold text-white mb-4">📊 Comparativa Técnica</h3>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-800">
                            <th className="p-4 text-left text-gray-400 font-medium border-b border-slate-700">Aspecto</th>
                            <th className="p-4 text-left text-rose-400 font-medium border-b border-slate-700">Lifting Coreano</th>
                            <th className="p-4 text-left text-gray-400 font-medium border-b border-slate-700">Lifting Clásico</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        <tr className="border-b border-slate-700/50">
                            <td className="p-4">Tipo de rizo</td>
                            <td className="p-4 text-rose-400">J o L (abierto, natural)</td>
                            <td className="p-4">C o U (pronunciado)</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                            <td className="p-4">Clienta ideal</td>
                            <td className="p-4 text-rose-400">Quiere aspecto "sin maquillaje"</td>
                            <td className="p-4">Quiere efecto dramático</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                            <td className="p-4">Molde</td>
                            <td className="p-4 text-rose-400">Plano o semiplano</td>
                            <td className="p-4">Nube o cilíndrico</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                            <td className="p-4">Tiempo total</td>
                            <td className="p-4">45-60 min</td>
                            <td className="p-4">45-60 min</td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                            <td className="p-4">Producto J. Denis</td>
                            <td className="p-4 text-rose-400">Cisteamina + Shot 1.5</td>
                            <td className="p-4">Cisteamina estándar</td>
                        </tr>
                        <tr>
                            <td className="p-4">Duración del efecto</td>
                            <td className="p-4 text-emerald-400">6-8 semanas</td>
                            <td className="p-4 text-emerald-400">6-8 semanas</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/30">
                    <h4 className="font-bold text-rose-400 mb-4">🌸 ¿Cuándo Elegir Coreano?</h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                        <li>• Clienta con pestañas largas que quiere definición</li>
                        <li>• Búsqueda de look natural o "clean girl"</li>
                        <li>• Ojos grandes o prominentes</li>
                        <li>• Primera vez con lifting</li>
                    </ul>
                </div>
                <div className="p-6 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                    <h4 className="font-bold text-indigo-400 mb-4">💫 ¿Cuándo Elegir Clásico?</h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                        <li>• Clienta con pestañas rectas o caídas</li>
                        <li>• Deseo de efecto más dramático</li>
                        <li>• Ojos encapotados que necesitan proyección</li>
                        <li>• Clientas habituales que desean más curvatura</li>
                    </ul>
                </div>
            </section>

            <section className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">⚠️ Error Frecuente</h3>
                <p className="text-gray-300">
                    Muchas profesionales aplican la técnica coreana con productos de lifting clásico. <strong className="text-white">La clave está en el combo: Cisteamina Estabilizada + Shot 1.5</strong>. Este combo permite el rizo suave del coreano porque la cisteamina trabaja a menor intensidad que el tioglicólico, y el Shot 1.5 refuerza la fibra durante la reforma.
                </p>
            </section>

            <div className="p-6 rounded-xl bg-gradient-to-r from-rose-900/50 to-pink-900/50 border border-rose-500/30 text-center">
                <p className="text-xl font-bold text-white">
                    En J. Denis formamos profesionales en ambas técnicas. Domina las dos. 🎓
                </p>
            </div>
        </div>
    );
}

function GlueLessPowderContent() {
    return (
        <div className="space-y-8">
            {/* YouTube Video */}
            <div className="rounded-2xl overflow-hidden border border-slate-700">
                <div className="aspect-video">
                    <iframe
                        src="https://www.youtube.com/embed/WeZHAEXMEOQ"
                        title="Evolución de los adhesivos para Lash Lifting de J.Denis"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>
                <div className="bg-slate-800 px-6 py-3 text-center">
                    <p className="text-sm text-gray-400">🎥 Evolución de los Adhesivos para Lash Lifting — J. Denis México</p>
                </div>
            </div>

            <blockquote className="border-l-4 border-violet-500 pl-6 italic text-gray-300 text-xl">
                "Sin pegamento, sin residuos, sin complicaciones. Solo fijación perfecta."
            </blockquote>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-violet-400" />
                    ¿Qué es el Glue Less Powder?
                </h2>
                <p className="text-gray-300 leading-relaxed">
                    El <strong className="text-white">Glue Less Powder</strong> de J. Denis es un adhesivo en polvo que revoluciona la forma en que se fijan las pestañas al pad o molde durante el lifting. A diferencia de los adhesivos líquidos tradicionales, el Glue Less Powder crea una <strong className="text-white">adherencia por contacto</strong> que no deja residuos, no irrita y se retira fácilmente al finalizar el tratamiento.
                </p>
            </section>

            <section className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-violet-500/10 border border-violet-500/30">
                    <h4 className="font-bold text-violet-400 mb-4">✨ Ventajas del Glue Less</h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                        <li>• Sin residuos de pegamento en la pestaña</li>
                        <li>• No requiere solvente para retirar</li>
                        <li>• Fijación firme pero no agresiva</li>
                        <li>• Compatible con pieles sensibles</li>
                        <li>• Aplicación más rápida que adhesivo líquido</li>
                        <li>• No interfiere con la loción de cisteamina</li>
                    </ul>
                </div>
                <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30">
                    <h4 className="font-bold text-red-400 mb-4">❌ Problemas del Adhesivo Tradicional</h4>
                    <ul className="text-gray-300 space-y-2 text-sm">
                        <li>• Residuos pegajosos difíciles de retirar</li>
                        <li>• Puede causar irritación si toca la piel</li>
                        <li>• Se seca rápido, presión de tiempo</li>
                        <li>• Puede bloquear la penetración de la loción</li>
                        <li>• Requiere removedor especial</li>
                        <li>• Mayor riesgo de alergia de contacto</li>
                    </ul>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-4">📋 ¿Cómo se Aplica?</h3>
                <div className="space-y-3">
                    <div className="flex gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
                        <div className="w-10 h-10 bg-violet-500/20 border border-violet-500/40 rounded-full flex items-center justify-center text-violet-400 font-bold shrink-0">1</div>
                        <div>
                            <p className="font-semibold text-white">Prepara el pad</p>
                            <p className="text-gray-400 text-sm">Rocía una cantidad mínima sobre el pad de silicona con el applicador.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
                        <div className="w-10 h-10 bg-violet-500/20 border border-violet-500/40 rounded-full flex items-center justify-center text-violet-400 font-bold shrink-0">2</div>
                        <div>
                            <p className="font-semibold text-white">Peina y fija</p>
                            <p className="text-gray-400 text-sm">Peina las pestañas sobre el pad. El polvo crea adherencia inmediata al contacto.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
                        <div className="w-10 h-10 bg-violet-500/20 border border-violet-500/40 rounded-full flex items-center justify-center text-violet-400 font-bold shrink-0">3</div>
                        <div>
                            <p className="font-semibold text-white">Procede con el lifting</p>
                            <p className="text-gray-400 text-sm">Aplica la cisteamina normalmente. El polvo no interfiere con el proceso químico.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">💡 Tip de Profesional</h3>
                <p className="text-gray-300">
                    El Glue Less Powder es especialmente útil para profesionales que trabajan con <strong className="text-white">volumen alto de clientas</strong>. Al eliminar el paso de aplicar y esperar que seque el adhesivo, <strong className="text-white">ahorras entre 3-5 minutos por servicio</strong>. En un día con 8 clientas, eso son 40 minutos de productividad ganada.
                </p>
            </section>

            <div className="p-6 rounded-xl bg-gradient-to-r from-violet-900/50 to-purple-900/50 border border-violet-500/30 text-center">
                <p className="text-xl font-bold text-white">
                    Menos complicaciones, más resultados. Así es J. Denis. ✨
                </p>
            </div>
        </div>
    );
}
