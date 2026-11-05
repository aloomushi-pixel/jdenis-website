import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { usePageMeta } from '../hooks/usePageMeta';
import { useProducts } from '../hooks/useProducts';
import { useVariants } from '../hooks/useVariants';
import {
    buildOrganizationSchema,
    CATEGORY_HUB_CONFIGS,
    type CategorySeoHubConfig,
} from '../utils/seoData';

interface CategorySeoHubProps {
    hubSlug: CategorySeoHubConfig['slug'];
}

const ALL_HUBS: Array<{ slug: CategorySeoHubConfig['slug']; label: string; path: string }> = [
    { slug: 'cejas', label: 'J. Denis Cejas', path: '/cejas' },
    { slug: 'pestanas', label: 'J. Denis Pestañas', path: '/pestanas' },
    { slug: 'laminado-de-cejas', label: 'Laminado y Planchado de Cejas', path: '/laminado-de-cejas' },
    { slug: 'lash-lifting', label: 'Lash Lifting Cisteamina', path: '/lash-lifting' },
    { slug: 'henna-y-pigmentos', label: 'Brow Henna y Pigmentos', path: '/henna-y-pigmentos' },
];

export default function CategorySeoHub({ hubSlug }: CategorySeoHubProps) {
    const config = CATEGORY_HUB_CONFIGS[hubSlug];
    const { products, loading } = useProducts();
    const { groups } = useVariants();
    const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');
    const [searchFilter, setSearchFilter] = useState<string>('');

    const { groupedProducts, variantCounts } = useMemo(() => {
        const counts = new Map<string, number>();
        const groupFirstProductIds = new Map<string, string>();
        const productToGroup = new Map<string, (typeof groups)[number]>();

        groups.forEach((group) => {
            if (group.variants && group.variants.length > 0) {
                const firstVariant = group.variants[0];
                groupFirstProductIds.set(group.id, firstVariant.product_id);
                counts.set(firstVariant.product_id, group.variants.length);
                group.variants.forEach((v) => {
                    productToGroup.set(v.product_id, group);
                });
            }
        });

        const grouped = products
            .filter((p) => {
                const group = productToGroup.get(p.id);
                if (!group) return true;
                return groupFirstProductIds.get(group.id) === p.id;
            })
            .map((p) => {
                const group = productToGroup.get(p.id);
                if (group && groupFirstProductIds.get(group.id) === p.id) {
                    return { ...p, name: group.name };
                }
                return p;
            });

        return { groupedProducts: grouped, variantCounts: counts };
    }, [products, groups]);

    const hubProducts = useMemo(() => {
        const targetCatsLower = config.targetCategories.map((c) => c.toLowerCase());
        const featuredSet = new Set(config.featuredProductSlugs);

        const matchesHub = groupedProducts.filter((p) => {
            if (p.stock !== undefined && p.stock !== null && p.stock <= 0) return false;
            const catLower = (p.category || '').toLowerCase();
            const textLower = `${p.name} ${p.description || ''} ${p.slug || ''}`.toLowerCase();

            if (p.slug && featuredSet.has(p.slug)) return true;
            if (targetCatsLower.includes(catLower)) {
                // For narrower hubs like laminado-de-cejas, prioritize keyword match or primary category
                if (hubSlug === 'laminado-de-cejas') {
                    return (
                        catLower === 'diseño de cejas' ||
                        config.searchKeywords.some((kw) => textLower.includes(kw))
                    );
                }
                return true;
            }
            return config.searchKeywords.some((kw) => textLower.includes(kw));
        });

        const filtered = matchesHub.filter((p) => {
            if (activeFilterCategory !== 'all' && p.category !== activeFilterCategory) {
                return false;
            }
            if (searchFilter.trim()) {
                const q = searchFilter.trim().toLowerCase();
                const text = `${p.name} ${p.description || ''} ${p.category || ''}`.toLowerCase();
                if (!text.includes(q)) return false;
            }
            return true;
        });

        return [...filtered].sort((a, b) => {
            const aIdx = a.slug ? config.featuredProductSlugs.indexOf(a.slug) : -1;
            const bIdx = b.slug ? config.featuredProductSlugs.indexOf(b.slug) : -1;
            if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
            if (aIdx !== -1) return -1;
            if (bIdx !== -1) return 1;
            const aFeat = a.isFeatured ? 1 : 0;
            const bFeat = b.isFeatured ? 1 : 0;
            if (aFeat !== bFeat) return bFeat - aFeat;
            return a.name.localeCompare(b.name);
        });
    }, [groupedProducts, config, hubSlug, activeFilterCategory, searchFilter]);

    const canonicalUrl = `https://jdenis.store${config.path}`;

    usePageMeta({
        title: config.metaTitle,
        description: config.metaDescription,
        canonical: canonicalUrl,
        type: 'website',
        jsonLd: [
            buildOrganizationSchema(),
            {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: config.h1Title,
                description: config.metaDescription,
                url: canonicalUrl,
                provider: {
                    '@type': 'Organization',
                    name: 'J. Denis Cosméticos México',
                    foundingDate: '1998',
                    url: 'https://jdenis.store',
                },
                breadcrumb: {
                    '@type': 'BreadcrumbList',
                    name: 'Ruta de navegación',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://jdenis.store' },
                        { '@type': 'ListItem', position: 2, name: 'Tienda', item: 'https://jdenis.store/tienda' },
                        { '@type': 'ListItem', position: 3, name: config.h1Title, item: canonicalUrl },
                    ],
                },
            },
            ...(hubProducts.length > 0
                ? [
                      {
                          '@context': 'https://schema.org',
                          '@type': 'ItemList',
                          name: config.h1Title,
                          numberOfItems: hubProducts.length,
                          itemListElement: hubProducts.slice(0, 32).map((p, i) => ({
                              '@type': 'ListItem',
                              position: i + 1,
                              name: p.name,
                              url: `https://jdenis.store/producto/${p.slug || p.id}`,
                          })),
                      },
                  ]
                : []),
            {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: config.faqs.map((faq) => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: faq.answer,
                    },
                })),
            },
        ],
    });

    return (
        <div className="min-h-screen bg-cream pt-20 md:pt-28 pb-16">
            {/* Breadcrumb & Hub Switcher */}
            <div className="container-luxury mb-6">
                <nav className="text-xs uppercase tracking-wider mb-4 flex flex-wrap items-center gap-2 text-charcoal/50">
                    <Link to="/" className="hover:text-gold transition-colors">
                        Inicio
                    </Link>
                    <span className="text-charcoal/20">/</span>
                    <Link to="/tienda" className="hover:text-gold transition-colors">
                        Catálogo
                    </Link>
                    <span className="text-charcoal/20">/</span>
                    <span className="text-forest font-semibold">{config.slug.replace(/-/g, ' ')}</span>
                </nav>

                {/* Cross-linking pills between the 5 SEO Hubs */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {ALL_HUBS.map((hub) => {
                        const isCurrent = hub.slug === hubSlug;
                        return (
                            <Link
                                key={hub.slug}
                                to={hub.path}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                                    isCurrent
                                        ? 'bg-forest text-white border-forest shadow-sm'
                                        : 'bg-white text-charcoal/70 border-kraft/30 hover:border-gold hover:text-forest'
                                }`}
                            >
                                {hub.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Hero Banner */}
            <header className="container-luxury mb-10">
                <div className="bg-gradient-to-br from-[#001641] via-[#072357] to-[#001641] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gold/20 relative overflow-hidden">
                    <div className="max-w-3xl relative z-10">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-[11px] font-semibold uppercase tracking-widest mb-3">
                            {config.badge}
                        </span>
                        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white leading-tight mb-4">
                            {config.h1Title}
                        </h1>
                        <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6">
                            {config.subtitle}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <a
                                href="#catalogo-especializado"
                                className="px-6 py-3 rounded-full bg-gold text-[#001641] font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-gold-light transition-all shadow-md"
                            >
                                Ver {hubProducts.length > 0 ? `${hubProducts.length} Productos` : 'Catálogo'} ↓
                            </a>
                            <Link
                                to="/registro-distribuidor"
                                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-medium transition-all"
                            >
                                🏭 Precios de Mayoreo / Distribuidor
                            </Link>
                            <a
                                href={`https://wa.me/525527271067?text=${encodeURIComponent(
                                    `Hola J. Denis! Quiero asesoría o cotización de la línea: ${config.h1Title}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-3 rounded-full border border-gold/40 text-gold hover:bg-gold/10 text-xs sm:text-sm font-medium transition-all"
                            >
                                Asesoría por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filter & Live Product Grid */}
            <section id="catalogo-especializado" className="container-luxury mb-14">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-kraft/20">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveFilterCategory('all')}
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                                activeFilterCategory === 'all'
                                    ? 'bg-forest text-white border-forest'
                                    : 'bg-white text-charcoal/70 border-kraft/30 hover:border-forest'
                            }`}
                        >
                            Todos ({hubProducts.length})
                        </button>
                        {config.targetCategories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveFilterCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                                    activeFilterCategory === cat
                                        ? 'bg-forest text-white border-forest'
                                        : 'bg-white text-charcoal/70 border-kraft/30 hover:border-forest'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            placeholder="Filtrar por nombre o tono..."
                            className="w-full pl-4 pr-9 py-2 rounded-full bg-white border border-kraft/30 text-xs sm:text-sm text-forest focus:outline-none focus:border-gold"
                        />
                        {searchFilter && (
                            <button
                                type="button"
                                onClick={() => setSearchFilter('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-forest text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        <ProductSkeleton count={8} />
                    </div>
                ) : hubProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {hubProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                variantCount={variantCounts.get(product.id) || 0}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-kraft/20">
                        <p className="text-charcoal/60 text-sm mb-3">
                            No encontramos productos con ese filtro específico.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setActiveFilterCategory('all');
                                setSearchFilter('');
                            }}
                            className="text-xs font-semibold text-gold underline"
                        >
                            Mostrar toda la línea
                        </button>
                    </div>
                )}
            </section>

            {/* Technical Protocol & B2B / FAQ Authority Section */}
            <section className="container-luxury">
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-kraft/20">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Left Column: Protocol Steps */}
                        <div className="lg:col-span-7 space-y-6">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-gold/15 text-forest text-xs font-semibold uppercase tracking-wider mb-2">
                                    Protocolo Técnico Oficial J. Denis
                                </span>
                                <h2 className="font-serif text-2xl sm:text-3xl text-forest mb-3">
                                    {config.technicalGuideTitle}
                                </h2>
                                <p className="text-sm text-charcoal/80 leading-relaxed">
                                    {config.technicalGuideIntro}
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {config.protocolSteps.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 12 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-4 rounded-2xl bg-cream/70 border border-kraft/20"
                                    >
                                        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-gold mb-1">
                                            {step.step}
                                        </span>
                                        <h3 className="font-serif text-base text-forest font-semibold mb-1.5">
                                            {step.title}
                                        </h3>
                                        <p className="text-xs text-charcoal/75 leading-relaxed">
                                            {step.detail}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="p-5 rounded-2xl bg-[#001641] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-serif text-lg text-gold mb-1">
                                        🏭 Venta al Mayoreo Directo de Fábrica
                                    </h3>
                                    <p className="text-xs text-white/80 leading-relaxed">
                                        {config.b2bHighlight}
                                    </p>
                                </div>
                                <Link
                                    to="/registro-distribuidor"
                                    className="px-5 py-2.5 rounded-full bg-gold text-[#001641] font-bold text-xs uppercase tracking-wider whitespace-nowrap hover:bg-gold-light transition-colors self-start sm:self-center"
                                >
                                    Solicitar Mayoreo →
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: FAQs & Location */}
                        <div className="lg:col-span-5 space-y-6">
                            <div>
                                <h2 className="font-serif text-xl sm:text-2xl text-forest mb-4">
                                    Preguntas Frecuentes
                                </h2>
                                <div className="space-y-3">
                                    {config.faqs.map((faq, idx) => (
                                        <details
                                            key={idx}
                                            open={idx === 0}
                                            className="group rounded-2xl border border-kraft/25 bg-cream/50 px-4 py-3.5"
                                        >
                                            <summary className="cursor-pointer font-semibold text-xs sm:text-sm text-forest flex items-center justify-between gap-2">
                                                <span>{faq.question}</span>
                                                <span className="text-gold group-open:rotate-180 transition-transform">
                                                    ▼
                                                </span>
                                            </summary>
                                            <p className="mt-2.5 text-xs sm:text-sm text-charcoal/75 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </details>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-cream border border-gold/30">
                                <h3 className="font-serif text-base text-forest font-semibold mb-1.5">
                                    📍 Tienda Sede y Academia J. Denis Lindavista CDMX
                                </h3>
                                <p className="text-xs text-charcoal/75 leading-relaxed mb-3">
                                    Av. Montevideo #136, Col. Lindavista, Gustavo A. Madero, C.P. 07300, Ciudad de México. Envíos asegurados a los 32 estados de México.
                                </p>
                                <div className="flex flex-wrap gap-3 text-xs font-semibold">
                                    <Link to="/academia" className="text-forest hover:text-gold underline">
                                        Cursos Certificados STPS DC-3 →
                                    </Link>
                                    <Link to="/tienda" className="text-forest hover:text-gold underline">
                                        Catálogo Completo (250+ SKUs) →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
