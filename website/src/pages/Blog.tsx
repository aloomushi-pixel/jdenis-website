import { Link } from 'react-router-dom';
import { BookOpen, Eye, Heart, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface BlogArticle {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    icon: React.ReactNode;
    gradient: string;
    featured?: boolean;
}

const blogArticles: BlogArticle[] = [
    {
        id: 'semaforo-salud-capilar',
        title: 'Semáforo de Salud Capilar',
        excerpt: 'Aprende a diagnosticar el estado de tus pestañas antes de un lifting. ¿Verde, amarillo o rojo? Identifica si estás lista para el tratamiento.',
        category: 'Guía de Diagnóstico',
        readTime: '8 min',
        icon: <Eye className="w-6 h-6" />,
        gradient: 'from-emerald-500 to-teal-600',
        featured: true
    },
    {
        id: 'laminado-vs-microblading',
        title: 'Laminado vs. Microblading',
        excerpt: 'Por qué tu mirada prefiere la química inteligente. Comparativa de costo-beneficio, dolor, recuperación y reversibilidad.',
        category: 'Comparativa',
        readTime: '10 min',
        icon: <Sparkles className="w-6 h-6" />,
        gradient: 'from-purple-500 to-pink-600',
        featured: true
    },
    {
        id: 'pad-nube-vs-plano',
        title: 'Pad Nube vs. Pad Plano',
        excerpt: 'Guía técnica para profesionales: qué tipo de ojo se beneficia de cada molde de silicona. Domina la selección de pads.',
        category: 'Tutorial Técnico',
        readTime: '5 min',
        icon: <BookOpen className="w-6 h-6" />,
        gradient: 'from-blue-500 to-indigo-600'
    }
];

export default function Blog() {
    const featuredArticles = blogArticles.filter(a => a.featured);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

                <div className="container mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium mb-6">
                            Conocimiento que transforma
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Blog <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">J. Denis</span>
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            Educación profesional en química cosmética. Aprende a cuidar tu mirada con conocimiento científico y técnicas de vanguardia.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Articles */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <Heart className="w-6 h-6 text-pink-400" />
                        Artículos Destacados
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {featuredArticles.map((article) => (
                            <Link
                                key={article.id}
                                to={`/blog/${article.id}`}
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                <div className="relative p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${article.gradient} text-white`}>
                                            {article.icon}
                                        </div>
                                        <div>
                                            <span className="text-sm text-purple-400 font-medium">{article.category}</span>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <Clock className="w-4 h-4" />
                                                {article.readTime} de lectura
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                                        {article.title}
                                    </h3>

                                    <p className="text-gray-400 mb-6 line-clamp-3">
                                        {article.excerpt}
                                    </p>

                                    <div className="flex items-center gap-2 text-purple-400 font-medium group-hover:gap-4 transition-all">
                                        Leer artículo
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Articles */}
            <section className="py-16 px-4 bg-slate-800/30">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-blue-400" />
                        Todos los Artículos
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {blogArticles.map((article) => (
                            <Link
                                key={article.id}
                                to={`/blog/${article.id}`}
                                className="group p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-800 transition-all duration-300"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${article.gradient} text-white`}>
                                        {article.icon}
                                    </div>
                                    <span className="text-sm text-gray-400">{article.category}</span>
                                </div>

                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                    {article.title}
                                </h3>

                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {article.excerpt}
                                </p>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {article.readTime}
                                    </span>
                                    <span className="text-purple-400 group-hover:text-purple-300">
                                        Leer más →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 p-12 text-center">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,...')] opacity-10" />

                        <h2 className="text-3xl font-bold text-white mb-4 relative z-10">
                            ¿Quieres más conocimiento?
                        </h2>
                        <p className="text-gray-300 mb-8 max-w-xl mx-auto relative z-10">
                            Suscríbete a nuestro newsletter y recibe guías exclusivas, tutoriales avanzados y las últimas tendencias en química cosmética.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-400 min-w-[300px]"
                            />
                            <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25">
                                Suscribirme
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
