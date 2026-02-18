import { useState } from 'react';
import { ArrowRight, BookOpen, Clock, Droplets, Eye, ExternalLink, FileText, FlaskConical, Leaf, Newspaper, Search, Shield, Sparkles, Star, X, Zap } from 'lucide-react';
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

interface NewsItem {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    image: string;
    instagramUrl: string;
    tag: string;
}

const newsItems: NewsItem[] = [
    {
        id: 'shot-hidratante-inter-finish',
        title: '✨ Nuevo Shot Hidratante 1.5 Inter-Finish',
        date: '28 de Enero, 2026',
        excerpt: 'El paso intermedio y final que transformará tus procedimientos de lifting en cejas y pestañas. Hidrata profundamente, refuerza la CMC de los puentes de disulfuro, cierra y fortalece la cutícula, y aporta un acabado profesional.',
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
        instagramUrl: 'https://www.instagram.com/p/DUEq52GkhXa/',
        tag: 'Nuevo Lanzamiento',
    },
    {
        id: 'kit-cisteamina-estabilizada',
        title: '✨ Kit de Cisteamina Estabilizada — ¡Ya Disponible!',
        date: '28 de Enero, 2026',
        excerpt: 'La evolución del laminado de cejas y lifting de pestañas. Sistema profesional de 4 pasos: Cisteamina Estabilizada, Fijador Neutralizante, Botox Fortalecedor Nutritivo y Control de pH. Resultados visibles, pelo más fuerte y flexible.',
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/blue_mesa-de-trabajo-11-9092542207219bc30316691308859785-480-0.webp',
        instagramUrl: 'https://www.instagram.com/p/DUEcLiXk009/',
        tag: 'Nuevo Producto',
    },
];

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
    },
    {
        id: 'que-es-constancia-dc3-stps',
        title: '¿Qué es la Constancia DC-3 y por qué la necesitas como profesional de belleza?',
        excerpt: 'La constancia DC-3 es el documento oficial que la STPS emite para certificar la capacitación laboral en México. Descubre por qué es esencial para tu carrera en estética profesional y cómo obtenerla.',
        category: 'Certificación STPS',
        readTime: '10 min',
        icon: <Shield className="w-6 h-6" />,
        featured: true
    },
    {
        id: 'como-obtener-dc3-lash-lifting',
        title: 'Cómo obtener tu DC-3 en Lash Lifting y Laminado de Cejas',
        excerpt: 'Guía paso a paso para obtener tu constancia DC-3 en técnicas de lash lifting y laminado de cejas. Requisitos, proceso y beneficios de certificarte ante la STPS con J. Denis.',
        category: 'Guía DC-3',
        readTime: '8 min',
        icon: <FileText className="w-6 h-6" />,
        featured: true
    },
    {
        id: 'capacitacion-stps-estetica-salon',
        title: 'Capacitación STPS en Estética: Normas y Beneficios para tu Salón',
        excerpt: '¿Sabías que la STPS exige capacitación formal para empleados de salones de belleza? Conoce las normas, los beneficios legales y cómo cumplir con la formación certificada DC-3.',
        category: 'Normativa STPS',
        readTime: '12 min',
        icon: <Shield className="w-6 h-6" />
    }
];

// Extract unique categories
const allCategories = [...new Set(blogArticles.map(a => a.category))];

export default function Blog() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Filter logic
    const filterArticle = (article: BlogArticle) => {
        const matchesSearch = searchTerm === '' ||
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !activeCategory || article.category === activeCategory;
        return matchesSearch && matchesCategory;
    };

    const filteredArticles = blogArticles.filter(filterArticle);
    const filteredFeatured = blogArticles.filter(a => a.featured).filter(filterArticle);
    const hasActiveFilters = searchTerm !== '' || activeCategory !== null;

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 bg-forest overflow-hidden">
                <div className="absolute inset-0 botanical-pattern opacity-20" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                <div className="container-luxury relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/40 text-gold text-sm font-medium mb-6">
                            Conocimiento Botánico · Capacitación Certificada DC-3 / STPS
                        </span>
                        <h1 className="font-serif text-4xl md:text-6xl text-cream mb-6">
                            Blog <span className="text-gold">J. Denis</span>
                        </h1>
                        <p className="text-lg text-cream/70 leading-relaxed mb-10">
                            Educación profesional en química cosmética, certificación STPS y técnicas de vanguardia.
                            Artículos sobre constancia DC-3, capacitación laboral en belleza y formación certificada.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-xl mx-auto mb-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar artículos..."
                                className="w-full pl-12 pr-12 py-4 bg-forest-light/80 backdrop-blur border border-gold/30 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-colors text-base"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Category Pills */}
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setActiveCategory(null)}
                                className={`px-4 py-2 text-sm font-medium border transition-all duration-300 ${!activeCategory
                                        ? 'bg-gold text-forest border-gold'
                                        : 'bg-transparent text-cream/70 border-cream/20 hover:border-gold/50 hover:text-cream'
                                    }`}
                            >
                                Todas
                            </button>
                            {allCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                                    className={`px-4 py-2 text-sm font-medium border transition-all duration-300 ${activeCategory === cat
                                            ? 'bg-gold text-forest border-gold'
                                            : 'bg-transparent text-cream/70 border-cream/20 hover:border-gold/50 hover:text-cream'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* NEWS SECTION — only show when no filters active */}
            {!hasActiveFilters && (
                <section className="section section-cream">
                    <div className="container-luxury">
                        <div className="section-header text-left">
                            <h2 className="section-title flex items-center gap-3">
                                <Newspaper className="w-7 h-7 text-gold" />
                                Noticias
                            </h2>
                            <p className="text-charcoal/60 mt-2">Últimas novedades de la marca J. Denis</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {newsItems.map((news) => (
                                <a
                                    key={news.id}
                                    href={news.instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative overflow-hidden bg-white border border-kraft/30 hover:border-gold/50 transition-all duration-500 hover:shadow-xl"
                                >
                                    {/* Tag */}
                                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-gold to-gold-light text-forest text-xs font-bold tracking-wider uppercase shadow-md">
                                        {news.tag}
                                    </div>

                                    {/* Image */}
                                    <div className="aspect-video overflow-hidden bg-cream-dark">
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-charcoal/50 text-sm mb-3">
                                            <Clock className="w-4 h-4" />
                                            {news.date}
                                        </div>

                                        <h3 className="font-serif text-xl text-forest mb-3 group-hover:text-gold transition-colors leading-tight">
                                            {news.title}
                                        </h3>

                                        <p className="text-charcoal/70 text-sm mb-4 line-clamp-3 leading-relaxed">
                                            {news.excerpt}
                                        </p>

                                        <div className="flex items-center gap-2 text-gold font-medium text-sm group-hover:gap-3 transition-all">
                                            Ver en Instagram
                                            <ExternalLink className="w-4 h-4" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Articles */}
            {filteredFeatured.length > 0 && (
                <section className="section section-kraft">
                    <div className="container-luxury">
                        <div className="section-header text-left">
                            <h2 className="section-title flex items-center gap-3">
                                <Leaf className="w-7 h-7 text-gold" />
                                Artículos Destacados
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {filteredFeatured.map((article) => (
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
            )}

            {/* All Articles */}
            <section className="section section-kraft">
                <div className="container-luxury">
                    <div className="section-header text-left">
                        <h2 className="section-title flex items-center gap-3">
                            <BookOpen className="w-7 h-7 text-gold" />
                            {hasActiveFilters ? `Resultados (${filteredArticles.length})` : 'Todos los Artículos'}
                        </h2>
                    </div>

                    {filteredArticles.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {filteredArticles.map((article) => (
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
                    ) : (
                        <div className="text-center py-16">
                            <Search className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
                            <p className="text-charcoal/50 text-lg mb-2">No se encontraron artículos</p>
                            <p className="text-charcoal/40 text-sm mb-6">Intenta con otros términos de búsqueda o selecciona otra categoría</p>
                            <button
                                onClick={() => { setSearchTerm(''); setActiveCategory(null); }}
                                className="px-6 py-2 bg-forest text-cream text-sm font-medium hover:bg-forest-light transition-colors"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
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
