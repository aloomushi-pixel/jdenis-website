import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Clock, FileText, Leaf, Loader, Newspaper, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getNewsPosts, getBlogPosts, type BlogPost } from '../lib/supabase';

export default function Blog() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [newsItems, setNewsItems] = useState<BlogPost[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [blogArticles, setBlogArticles] = useState<BlogPost[]>([]);
    const [blogLoading, setBlogLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setNewsLoading(true);
                setBlogLoading(true);
                const [newsData, blogData] = await Promise.all([
                    getNewsPosts(true),
                    getBlogPosts(true)
                ]);
                setNewsItems(newsData);
                setBlogArticles(blogData);
            } catch (error) {
                console.error('Error loading posts:', error);
            } finally {
                setNewsLoading(false);
                setBlogLoading(false);
            }
        };
        loadPosts();
    }, []);

    // Filter logic
    const filterArticle = (article: BlogPost) => {
        const matchesSearch = searchTerm === '' ||
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = !activeCategory || article.categories?.includes(activeCategory);
        return matchesSearch && matchesCategory;
    };

    const filteredArticles = blogArticles.filter(filterArticle);
    // Since featured isn't in BlogPost currently we will just show the latest 2 as featured if possible
    const filteredFeatured = blogArticles.slice(0, 2).filter(filterArticle);
    const hasActiveFilters = searchTerm !== '' || activeCategory !== null;

    // Extract unique categories dynamically
    const allCategories = [...new Set(blogArticles.flatMap(a => a.categories || []))].filter(Boolean);

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

                        {newsLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader className="w-8 h-8 animate-spin text-gold" />
                            </div>
                        ) : newsItems.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-8">
                                {newsItems.map((news) => (
                                    <Link
                                        key={news.id}
                                        to={`/noticias/${news.slug}`}
                                        className="group relative overflow-hidden bg-white border border-kraft/30 hover:border-gold/50 transition-all duration-500 hover:shadow-xl"
                                    >
                                        {/* Tag */}
                                        {news.tag && (
                                            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-gold to-gold-light text-forest text-xs font-bold tracking-wider uppercase shadow-md">
                                                {news.tag}
                                            </div>
                                        )}

                                        {/* Image */}
                                        {news.featured_image && (
                                            <div className="aspect-video overflow-hidden bg-cream-dark">
                                                <img
                                                    src={news.featured_image}
                                                    alt={news.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-charcoal/50 text-sm mb-3">
                                                <Clock className="w-4 h-4" />
                                                {news.published_at ? new Date(news.published_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                                            </div>

                                            <h3 className="font-serif text-xl text-forest mb-3 group-hover:text-gold transition-colors leading-tight">
                                                {news.title}
                                            </h3>

                                            <p className="text-charcoal/70 text-sm mb-4 line-clamp-3 leading-relaxed">
                                                {news.excerpt}
                                            </p>

                                            <div className="flex items-center gap-2 text-gold font-medium text-sm group-hover:gap-3 transition-all">
                                                Leer más
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-charcoal/50 text-center py-8">No hay noticias publicadas aún.</p>
                        )}
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
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="text-sm text-gold font-medium">{article.categories?.[0] || 'Artículo'}</span>
                                                <div className="flex items-center gap-2 text-charcoal/50 text-sm">
                                                    <Clock className="w-4 h-4" />
                                                    {article.published_at ? new Date(article.published_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
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
                                    to={`/blog/${article.slug}`}
                                    className="group p-6 bg-cream border border-kraft/30 hover:border-gold/50 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-forest text-gold">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm text-charcoal/60">{article.categories?.[0] || 'Artículo'}</span>
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
                                            {article.published_at ? new Date(article.published_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
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
