import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, BookmarkPlus, Eye, Sparkles, BookOpen, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

// Blog content data
const blogContent: Record<string, {
    title: string;
    category: string;
    readTime: string;
    gradient: string;
    content: React.ReactNode;
}> = {
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
