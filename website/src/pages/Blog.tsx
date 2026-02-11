import { ArrowRight, BookOpen, Clock, Droplets, Eye, FlaskConical, Leaf, Sparkles, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogArticle {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    icon: React.ReactNode;
    featured?: boolean;
}

const blogArticles: BlogArticle[] = [
    {
        id: 'cisteamina-estabilizada',
        title: 'Cisteamina Estabilizada: La Revolución del Lifting Seguro',
        excerpt: 'Descubre por qué la cisteamina estabilizada reemplaza al ácido tioglicólico como el activo estrella en lifting de pestañas. Más suave, más efectiva y con resultados superiores.',
        category: 'Innovación',
        readTime: '7 min',
        icon: <FlaskConical className="w-6 h-6" />,
        featured: true
    },
    {
        id: 'shot-hidratante-1-5',
        title: 'Shot 1.5 Hidratante: El Secreto del Paso 2',
        excerpt: 'El nuevo Shot 1.5 Hidratante de J. Denis hidrata y refuerza los puentes de disulfuro durante el lifting. Aprende cuándo y cómo aplicarlo para resultados espectaculares.',
        category: 'Producto Estrella',
        readTime: '6 min',
        icon: <Droplets className="w-6 h-6" />,
        featured: true
    },
    {
        id: 'historia-laminado-cejas',
        title: 'Historia del Laminado de Cejas en México',
        excerpt: 'J. Denis: los creadores del laminado de cejas en México. Una trayectoria de más de 25 años innovando en la industria de la belleza profesional.',
        category: 'Historia',
        readTime: '8 min',
        icon: <Star className="w-6 h-6" />,
    },
    {
        id: 'lifting-coreano-vs-clasico',
        title: 'Lifting Coreano vs. Lifting Clásico',
        excerpt: 'Compara las dos técnicas más populares de lifting de pestañas. ¿Cuál es mejor para tu tipo de cliente? Resultados, tiempos y diferencias clave.',
        category: 'Comparativa',
        readTime: '9 min',
        icon: <Zap className="w-6 h-6" />,
    },
    {
        id: 'glue-less-powder',
        title: 'Glue Less Powder: Adhesivo sin Pegamento',
        excerpt: 'La tecnología de fijación sin pegamento que está revolucionando la aplicación de pestañas. Más limpio, más cómodo y con mejor retención.',
        category: 'Innovación',
        readTime: '5 min',
        icon: <Sparkles className="w-6 h-6" />,
    },
    {
        id: 'semaforo-salud-capilar',
        title: 'Semáforo de Salud Capilar',
        excerpt: 'Aprende a diagnosticar el estado de tus pestañas antes de un lifting. ¿Verde, amarillo o rojo? Identifica si estás lista para el tratamiento.',
        category: 'Guía de Diagnóstico',
        readTime: '8 min',
        icon: <Eye className="w-6 h-6" />,
    },
    {
        id: 'laminado-vs-microblading',
        title: 'Laminado vs. Microblading',
        excerpt: 'Por qué tu mirada prefiere la química inteligente. Comparativa de costo-beneficio, dolor, recuperación y reversibilidad.',
        category: 'Comparativa',
        readTime: '10 min',
        icon: <Sparkles className="w-6 h-6" />,
    },
    {
        id: 'pad-nube-vs-plano',
        title: 'Pad Nube vs. Pad Plano',
        excerpt: 'Guía técnica para profesionales: qué tipo de ojo se beneficia de cada molde de silicona. Domina la selección de pads.',
        category: 'Tutorial Técnico',
        readTime: '5 min',
        icon: <BookOpen className="w-6 h-6" />
    }
];

export default function Blog() {
    const featuredArticles = blogArticles.filter(a => a.featured);

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 bg-forest overflow-hidden">
                <div className="absolute inset-0 botanical-pattern opacity-20" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                <div className="container-luxury relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/40 text-gold text-sm font-medium mb-6">
                            Conocimiento Botánico
                        </span>
                        <h1 className="font-serif text-4xl md:text-6xl text-cream mb-6">
                            Blog <span className="text-gold">J. Denis</span>
                        </h1>
                        <p className="text-lg text-cream/70 leading-relaxed">
                            Educación profesional en química cosmética. Aprende a cuidar tu mirada con conocimiento científico y técnicas de vanguardia.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Articles */}
            <section className="section section-cream">
                <div className="container-luxury">
                    <div className="section-header text-left">
                        <h2 className="section-title flex items-center gap-3">
                            <Leaf className="w-7 h-7 text-gold" />
                            Artículos Destacados
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {featuredArticles.map((article) => (
                            <Link
                                key={article.id}
                                to={`/blog/${article.id}`}
                                className="group relative overflow-hidden bg-white border border-kraft/30 hover:border-gold/50 transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-forest/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-forest text-gold">
                                            {article.icon}
                                        </div>
                                        <div>
                                            <span className="text-sm text-gold font-medium">{article.category}</span>
                                            <div className="flex items-center gap-2 text-charcoal/50 text-sm">
                                                <Clock className="w-4 h-4" />
                                                {article.readTime} de lectura
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="font-serif text-2xl text-forest mb-4 group-hover:text-gold transition-colors">
                                        {article.title}
                                    </h3>

                                    <p className="text-charcoal/70 mb-6 line-clamp-3">
                                        {article.excerpt}
                                    </p>

                                    <div className="flex items-center gap-2 text-gold font-medium group-hover:gap-4 transition-all">
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
            <section className="section section-kraft">
                <div className="container-luxury">
                    <div className="section-header text-left">
                        <h2 className="section-title flex items-center gap-3">
                            <BookOpen className="w-7 h-7 text-gold" />
                            Todos los Artículos
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {blogArticles.map((article) => (
                            <Link
                                key={article.id}
                                to={`/blog/${article.id}`}
                                className="group p-6 bg-cream border border-kraft/30 hover:border-gold/50 transition-all duration-300"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-forest text-gold">
                                        {article.icon}
                                    </div>
                                    <span className="text-sm text-charcoal/60">{article.category}</span>
                                </div>

                                <h3 className="font-serif text-lg text-forest mb-2 group-hover:text-gold transition-colors">
                                    {article.title}
                                </h3>

                                <p className="text-charcoal/60 text-sm mb-4 line-clamp-2">
                                    {article.excerpt}
                                </p>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-charcoal/40 flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {article.readTime}
                                    </span>
                                    <span className="text-gold group-hover:text-forest transition-colors">
                                        Leer más →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="section section-forest relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                <div className="container-luxury relative z-10">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="font-serif text-3xl text-cream mb-4">
                            ¿Quieres más conocimiento?
                        </h2>
                        <p className="text-cream/60 mb-8">
                            Suscríbete a nuestro newsletter y recibe guías exclusivas, tutoriales avanzados y las últimas tendencias en química cosmética.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="px-6 py-3 bg-forest-light border border-gold/30 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold min-w-[300px]"
                            />
                            <button className="btn btn-secondary">
                                Suscribirme
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
