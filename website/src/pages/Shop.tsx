import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { useProducts } from '../hooks/useProducts';
import { useVariants } from '../hooks/useVariants';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSearchStore } from '../store/searchStore';

// Category filter definitions (UI constants with SVG icon paths)
const shopCategories = [
    { id: 'all', name: 'Todos', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z' },
    { id: 'lash-lifting', name: 'Lash Lifting', icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'brow-henna', name: 'Brow Henna', icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z' },
    { id: 'cejas', name: 'Diseño de Cejas', icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42' },
    { id: 'pigmentos', name: 'Pigmentos', icon: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z' },
    { id: 'lash-curling', name: 'Lash Curling', icon: 'M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3' },
    { id: 'extensiones', name: 'Extensiones', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' },
    { id: 'adhesivos', name: 'Adhesivos', icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 5.608a2.25 2.25 0 01-2.024 2.842 47.28 47.28 0 01-6.178.326 47.28 47.28 0 01-6.178-.326 2.25 2.25 0 01-2.024-2.842L5 14.5' },
    { id: 'tratamientos', name: 'Tratamientos', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
    { id: 'herramientas', name: 'Herramientas', icon: 'M11.42 15.17l-5.384 5.384a2.625 2.625 0 01-3.712-3.712l5.384-5.384M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.025 1.193-.14 1.743' },
    { id: 'accesorios', name: 'Accesorios', icon: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18' },
    { id: 'higiene', name: 'Higiene', icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 5.608a2.25 2.25 0 01-2.024 2.842 47.28 47.28 0 01-6.178.326 47.28 47.28 0 01-6.178-.326 2.25 2.25 0 01-2.024-2.842L5 14.5' },
    { id: 'pestanas-en-tira', name: 'Pestañas en Tira', icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'microblading', name: 'Microblading', icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10' },
];

// Price boundaries
const PRICE_MIN = 0;
const DEFAULT_PRICE_MAX = 5000;

// Sort options
const sortOptions = [
    { value: 'name', label: 'Nombre A-Z', shortLabel: 'A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A', shortLabel: 'Z-A' },
    { value: 'price-low', label: 'Precio: Menor a Mayor', shortLabel: '$ ↑' },
    { value: 'price-high', label: 'Precio: Mayor a Menor', shortLabel: '$ ↓' },
    { value: 'featured', label: '⭐ Destacados Primero', shortLabel: '⭐' },
    { value: 'offers', label: '🔥 Ofertas Primero', shortLabel: '🔥' },
];

export default function Shop() {
    const [searchParams] = useSearchParams();
    const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'all');
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const { openSearch } = useSearchStore();

    useEffect(() => {
        const q = searchParams.get('q');
        if (q !== null) setSearchQuery(q);
    }, [searchParams]);

    // Advanced filters
    const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, DEFAULT_PRICE_MAX]);
    const [showOffersOnly, setShowOffersOnly] = useState(false);
    const [showPricePopover, setShowPricePopover] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsSticky(currentScrollY > lastScrollY && currentScrollY > 150);
            lastScrollY = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Supabase-backed product data
    const { products, loading } = useProducts();
    const { groups } = useVariants();

    // Group products so we only show one representative per variant group
    const { groupedProducts, variantCounts } = useMemo(() => {
        const counts = new Map<string, number>();
        const groupFirstProductIds = new Map<string, string>(); // group_id -> representative product_id
        const productToGroup = new Map<string, any>(); // product_id -> group

        groups.forEach(group => {
            if (group.variants && group.variants.length > 0) {
                // Determine the representative product for this group
                // We pick the first one from the loaded variants
                const firstVariant = group.variants[0];
                groupFirstProductIds.set(group.id, firstVariant.product_id);
                counts.set(firstVariant.product_id, group.variants.length);

                group.variants.forEach(v => {
                    productToGroup.set(v.product_id, group);
                });
            }
        });

        const grouped = products.filter(p => {
            const group = productToGroup.get(p.id);
            if (!group) return true; // Not in any group, show normally

            // If it is in a group, only show it if it's the representative
            return groupFirstProductIds.get(group.id) === p.id;
        }).map(p => {
            const group = productToGroup.get(p.id);
            if (group && groupFirstProductIds.get(group.id) === p.id) {
                // Rename the representative product to the group's base name
                return { ...p, name: group.name };
            }
            return p;
        });

        // Add a hidden _searchData field to all returned products for deep search
        const enriched = grouped.map(p => {
            let searchStr = `${p.name} ${p.description || ''} ${p.category || ''}`;
            const group = productToGroup.get(p.id);
            if (group && groupFirstProductIds.get(group.id) === p.id) {
                // Collect names of all variants in this group so their hidden attributes (like 10mm, curva C) become searchable
                const variantNames = group.variants
                    .map((v: any) => products.find(prod => prod.id === v.product_id)?.name || '')
                    .join(' ');
                searchStr += ` ${variantNames}`;
            }
            return { ...p, _searchData: searchStr };
        });

        return { groupedProducts: enriched, variantCounts: counts };
    }, [products, groups]);

    // ─── SEO: dynamic title, meta description & JSON-LD via usePageMeta ───
    usePageMeta({
        title: 'Tienda Profesional de Cejas y Pestañas | Insumos J. Denis México',
        description: 'Compra insumos profesionales para cejas y pestañas: lash lifting, extensiones, pigmentos, adhesivos y herramientas. Calidad de laboratorio, envíos a todo México. J. Denis desde 1998.',
        canonical: 'https://jdenis.store/tienda',
        type: 'website',
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': 'Tienda Profesional J. Denis',
            'description': 'Catálogo de insumos profesionales para cejas y pestañas con calidad de laboratorio.',
            'url': 'https://jdenis.store/tienda',
            'provider': {
                '@type': 'Organization',
                'name': 'J. Denis México',
                'foundingDate': '1998',
                'url': 'https://jdenis.store',
            },
            'breadcrumb': {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': 'https://jdenis.store' },
                    { '@type': 'ListItem', 'position': 2, 'name': 'Tienda', 'item': 'https://jdenis.store/tienda' },
                ],
            },
        },
    });

    // Calculate max price once when products change (via ref to avoid re-render cascade)
    const maxPriceRef = useRef(DEFAULT_PRICE_MAX);
    const computedMax = useMemo(() => {
        if (groupedProducts.length === 0) return DEFAULT_PRICE_MAX;
        const max = Math.max(...groupedProducts.map(p => p.price));
        return max > 0 ? max : DEFAULT_PRICE_MAX;
    }, [groupedProducts]);

    useEffect(() => {
        maxPriceRef.current = computedMax;
    }, [computedMax]);

    useEffect(() => {
        const cat = searchParams.get('cat');
        if (cat) setTimeout(() => setActiveCategory(cat), 0);
    }, [searchParams]);

    // Products with promotions
    const promoProducts = useMemo(() => {
        return groupedProducts.filter(p =>
            p.originalPrice && p.originalPrice > p.price &&
            (p.stock === null || p.stock === undefined || p.stock > 0)
        );
    }, [groupedProducts]);

    // Featured products
    const featuredProducts = useMemo(() => {
        return groupedProducts.filter(p =>
            p.isFeatured &&
            (p.stock === null || p.stock === undefined || p.stock > 0)
        ).slice(0, 40);
    }, [groupedProducts]);

    // Non-featured products for the catalog section
    const catalogProducts = useMemo(() => {
        return groupedProducts.filter(p =>
            !p.isFeatured &&
            (p.stock === null || p.stock === undefined || p.stock > 0)
        );
    }, [groupedProducts]);

    // Check if any advanced filter is active
    const hasActiveFilters = useMemo(() => {
        return (
            priceRange[0] > PRICE_MIN ||
            priceRange[1] < computedMax ||
            showOffersOnly ||
            searchQuery.length > 0 ||
            activeCategory !== 'all'
        );
    }, [priceRange, showOffersOnly, searchQuery, activeCategory, computedMax]);

    const clearAllFilters = () => {
        setPriceRange([PRICE_MIN, computedMax]);
        setShowOffersOnly(false);
        setSearchQuery('');
        setActiveCategory('all');
        setSortBy('name');
    };

    const normalizeStr = (str?: string) => {
        if (!str) return '';
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    // Check if user is actively filtering/searching (to decide layout)
    const isFiltering = useMemo(() => {
        return searchQuery.length > 0 || activeCategory !== 'all' || showOffersOnly || priceRange[0] > PRICE_MIN || priceRange[1] < computedMax;
    }, [searchQuery, activeCategory, showOffersOnly, priceRange, computedMax]);

    const filteredProducts = useMemo(() => {
        // Show all products (featured + non-featured) directly in the catalog
        let source = groupedProducts;
        let result = source.filter(p => p.stock === undefined || p.stock === null || p.stock >= 1);

        if (activeCategory !== 'all') {
            const cat = shopCategories.find(c => c.id === activeCategory);
            const catName = cat ? cat.name : activeCategory;
            result = result.filter(p => p.category === catName || p.category.toLowerCase() === activeCategory.toLowerCase());
        }

        if (searchQuery) {
            const query = normalizeStr(searchQuery);
            result = result.filter(p => {
                const searchableText = (p as any)._searchData || `${p.name} ${p.description || ''} ${p.category || ''}`;
                return normalizeStr(searchableText).includes(query);
            });
        }

        // Price range filter
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Offers-only filter
        if (showOffersOnly) {
            result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
        }

        // Sort
        result = [...result].sort((a, b) => {
            if (sortBy === 'featured') {
                const aFeat = a.isFeatured ? 1 : 0;
                const bFeat = b.isFeatured ? 1 : 0;
                if (aFeat !== bFeat) return bFeat - aFeat;
                return a.name.localeCompare(b.name);
            }
            if (sortBy === 'offers') {
                const aOffer = (a.originalPrice && a.originalPrice > a.price) ? 1 : 0;
                const bOffer = (b.originalPrice && b.originalPrice > b.price) ? 1 : 0;
                if (aOffer !== bOffer) return bOffer - aOffer;
                return a.name.localeCompare(b.name);
            }
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
            return a.name.localeCompare(b.name);
        });

        return result;
    }, [groupedProducts, catalogProducts, isFiltering, activeCategory, sortBy, searchQuery, priceRange, showOffersOnly]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream">
                <div className="container-luxury py-12">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        <ProductSkeleton count={8} />
                    </div>
                </div>
            </div>
        );
    }

    // Active filter chips
    const renderActiveFilterChips = () => {
        const chips: { label: string; onRemove: () => void }[] = [];

        if (activeCategory !== 'all') {
            const cat = shopCategories.find(c => c.id === activeCategory);
            chips.push({
                label: `${cat?.name || activeCategory}`,
                onRemove: () => setActiveCategory('all'),
            });
        }
        if (searchQuery) {
            chips.push({
                label: `"${searchQuery}"`,
                onRemove: () => setSearchQuery(''),
            });
        }
        if (priceRange[0] > PRICE_MIN || priceRange[1] < computedMax) {
            chips.push({
                label: `$${priceRange[0]} – $${priceRange[1].toLocaleString()}`,
                onRemove: () => setPriceRange([PRICE_MIN, computedMax]),
            });
        }
        if (showOffersOnly) {
            chips.push({
                label: '🔥 Ofertas',
                onRemove: () => setShowOffersOnly(false),
            });
        }

        if (chips.length === 0) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2 mb-4"
            >
                {chips.map((chip, i) => (
                    <button
                        key={i}
                        onClick={chip.onRemove}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/30 text-forest text-xs rounded-full hover:bg-gold/20 hover:border-gold/50 transition-all group"
                    >
                        <span>{chip.label}</span>
                        <svg className="w-3 h-3 text-charcoal/40 group-hover:text-forest transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                ))}
                <button
                    onClick={clearAllFilters}
                    className="px-2 py-1 text-xs text-charcoal/50 hover:text-forest underline underline-offset-2 transition-colors"
                >
                    Limpiar todo
                </button>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-cream">
            {/* Espaciado para compensar el header fijo, sin HERO visible según solicitud del usuario */}
            <div className="pt-20 md:pt-28 bg-cream"></div>

            {/* ═══════════════════════════════════════════════════
                FEATURED PRODUCTS — Oculto temporalmente
               ═══════════════════════════════════════════════════ */}
            {false && featuredProducts.length > 0 && !isFiltering && (
                <section className="py-10 md:py-14 bg-gradient-to-b from-forest/5 via-cream to-cream">
                    <div className="container-luxury">
                        {/* Section Header */}
                        <div className="text-center mb-8 md:mb-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-4">
                                <span className="text-sm">⭐</span>
                                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">Selección Profesional</span>
                            </div>
                            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-forest mb-2">Nuestros Favoritos</h2>
                            <p className="text-charcoal/50 text-sm md:text-base max-w-lg mx-auto">Los productos más populares y recomendados por profesionales de la belleza</p>
                        </div>

                        {/* Featured Products Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {featuredProducts.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    variantCount={variantCounts.get(product.id) || 0}
                                />
                            ))}
                        </div>

                        {/* Scroll-to-catalog CTA */}
                        <div className="text-center mt-10">
                            <button
                                onClick={() => {
                                    const el = document.getElementById('shop-catalog');
                                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white border-2 border-forest/20 text-forest text-sm font-semibold rounded-full hover:border-gold hover:text-gold hover:shadow-lg transition-all duration-300 group"
                            >
                                <span>Explorar catálogo completo</span>
                                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════
                CATALOG SECTION — Full catalog with categories & filters
               ═══════════════════════════════════════════════════ */}
            <section id="shop-catalog" className="section section-cream py-8 md:py-12 relative">
                
                {/* ─── Sticky Search & Filter Bar ─── */}
                <div className={`fixed top-0 left-0 w-full z-50 h-[72px] lg:h-[80px] transition-transform duration-300 bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-b border-gray-100 flex items-center ${isSticky ? 'translate-y-0' : '-translate-y-full'}`}>
                    <div className="container-luxury w-full flex items-center gap-3 md:gap-6">
                        
                        {/* 1. Búsqueda */}
                        <div className="shrink-0 relative">
                            {/* Icon Button (Desktop & Mobile) */}
                            <button
                                onClick={openSearch}
                                className="p-2 text-charcoal hover:text-gold transition-colors flex items-center justify-center rounded-full hover:bg-gray-100"
                                aria-label="Buscar productos"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                            </button>
                        </div>

                        {/* 2. Categorías */}
                        <div className="flex-1 flex items-center gap-2 min-w-0 overflow-hidden">
                            {/* Static Buttons */}
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className={`px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm rounded-full border transition-all ${activeCategory === 'all'
                                        ? 'bg-forest text-white border-forest font-medium shadow-sm'
                                        : 'bg-white border-kraft/30 text-charcoal/70 hover:border-forest/40 hover:text-forest'
                                        }`}
                                >
                                    Ver Todo
                                </button>
                                {/* Offers quick-filter pill */}
                                <button
                                    onClick={() => setShowOffersOnly(!showOffersOnly)}
                                    className={`px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm rounded-full border transition-all flex items-center gap-1.5 ${showOffersOnly
                                        ? 'bg-red-500 text-white border-red-500 font-medium shadow-sm'
                                        : 'bg-white border-kraft/30 text-charcoal/70 hover:border-red-300'
                                        }`}
                                >
                                    🔥 <span className="hidden md:inline">Ofertas</span>
                                </button>
                                {/* Price filter pill */}
                                <button
                                    onClick={() => setShowPricePopover(true)}
                                    className={`px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm rounded-full border transition-all flex items-center gap-1.5 ${(priceRange[0] > PRICE_MIN || priceRange[1] < computedMax)
                                        ? 'bg-gold/10 border-gold/40 text-forest font-medium shadow-sm'
                                        : 'bg-white border-kraft/30 text-charcoal/70 hover:border-gold/40'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="hidden md:inline">Precio</span>
                                </button>
                            </div>

                            {/* Category pills (horizontal scroll with arrows) */}
                            <div className="relative group flex-1 min-w-0 w-full flex items-center">
                                {/* Left Arrow */}
                                <button 
                                    onClick={() => {
                                        const container = document.getElementById('sticky-category-scroll');
                                        if (container) container.scrollBy({ left: -250, behavior: 'smooth' });
                                    }}
                                    className="absolute left-0 z-10 bg-white/95 backdrop-blur-sm w-8 h-8 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] text-forest opacity-0 group-hover:opacity-100 transition-all hidden md:flex items-center justify-center border border-gray-100 hover:scale-105 hover:text-gold"
                                >
                                    <svg className="w-4 h-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                {/* Fade gradient left */}
                                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-[5] pointer-events-none hidden md:block"></div>

                                <div id="sticky-category-scroll" className="overflow-x-auto scrollbar-hide md:scrollbar-default scroll-smooth flex-1 px-1 md:px-4 pb-2 -mb-2 md:pb-0 md:mb-0">
                                    <div className="flex gap-2 w-max items-center py-1">
                                        {shopCategories.filter(c => c.id !== 'all').map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setActiveCategory(cat.id)}
                                                className={`flex-shrink-0 group/btn px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm rounded-full border transition-all flex items-center gap-1.5 md:gap-2 ${activeCategory === cat.id
                                                    ? 'bg-forest text-white border-forest font-medium shadow-sm'
                                                    : 'bg-white border-kraft/30 text-charcoal/70 hover:border-forest/40 hover:text-forest'
                                                    }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-translate-y-0.5"><path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} /></svg>
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Fade gradient right */}
                                <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent z-[5] pointer-events-none hidden md:block group-hover:from-white"></div>

                                {/* Right Arrow */}
                                <button 
                                    onClick={() => {
                                        const container = document.getElementById('sticky-category-scroll');
                                        if (container) container.scrollBy({ left: 250, behavior: 'smooth' });
                                    }}
                                    className="absolute right-0 z-10 bg-white/95 backdrop-blur-sm w-8 h-8 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] text-forest opacity-0 group-hover:opacity-100 transition-all hidden md:flex items-center justify-center border border-gray-100 hover:scale-105 hover:text-gold"
                                >
                                    <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-luxury">

                    {/* ─── Top Filter Bar ─── */}
                    <div className="flex flex-col gap-4 mb-6">

                        {/* Categories Row */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                            {/* Static Buttons */}
                            <div className="flex gap-2 flex-shrink-0 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className={`flex-shrink-0 px-5 py-2.5 text-sm rounded-full border transition-all ${activeCategory === 'all'
                                        ? 'bg-forest text-white border-forest font-medium shadow-sm'
                                        : 'bg-white border-kraft/30 text-charcoal/70 hover:border-forest/40 hover:text-forest'
                                        }`}
                                >
                                    Ver Todo
                                </button>
                                {/* Offers quick-filter pill */}
                                <button
                                    onClick={() => setShowOffersOnly(!showOffersOnly)}
                                    className={`flex-shrink-0 px-4 md:px-5 py-2.5 text-sm rounded-full border transition-all flex items-center gap-1.5 ${showOffersOnly
                                        ? 'bg-red-500 text-white border-red-500 font-medium shadow-sm'
                                        : 'bg-white border-kraft/30 text-charcoal/70 hover:border-red-300'
                                        }`}
                                >
                                    🔥 <span className="hidden md:inline">Ofertas</span>
                                    {promoProducts.length > 0 && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${showOffersOnly ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                                            {promoProducts.length}
                                        </span>
                                    )}
                                </button>

                                {/* Price filter pill */}
                                <button
                                    onClick={() => setShowPricePopover(true)}
                                    className={`flex-shrink-0 px-4 md:px-5 py-2.5 text-sm rounded-full border transition-all flex items-center gap-1.5 ${(priceRange[0] > PRICE_MIN || priceRange[1] < computedMax)
                                        ? 'bg-gold/10 border-gold/40 text-forest font-medium shadow-sm'
                                        : 'bg-white border-kraft/30 text-charcoal/70 hover:border-gold/40'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="hidden md:inline">Precio</span>
                                </button>
                            </div>

                            {/* Category pills (horizontal scroll with arrows) */}
                            <div className="relative group flex-1 min-w-0 w-full">
                                {/* Left Arrow */}
                                <button 
                                    onClick={() => {
                                        const container = document.getElementById('category-scroll-container');
                                        if (container) container.scrollBy({ left: -250, behavior: 'smooth' });
                                    }}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm w-9 h-9 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.15)] text-forest opacity-0 group-hover:opacity-100 transition-all hidden md:flex items-center justify-center border border-gray-100 hover:scale-105 hover:text-gold"
                                    aria-label="Desplazar a la izquierda"
                                >
                                    <svg className="w-5 h-5 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                {/* Fade gradient left */}
                                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-[5] pointer-events-none hidden md:block"></div>

                                <div id="category-scroll-container" className="overflow-x-auto scrollbar-hide md:scrollbar-default scroll-smooth md:px-4 pb-2 -mb-2 md:pb-0 md:mb-0">
                                    <div className="flex gap-2 pb-1 w-max">
                                        {shopCategories.filter(c => c.id !== 'all').map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setActiveCategory(cat.id)}
                                                className={`flex-shrink-0 group px-5 py-2.5 text-sm rounded-full border transition-all flex items-center gap-2 ${activeCategory === cat.id
                                                    ? 'bg-forest text-white border-forest font-medium shadow-sm'
                                                    : 'bg-white border-kraft/30 text-charcoal/70 hover:border-forest/40 hover:text-forest'
                                                    }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"><path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} /></svg>
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Fade gradient right */}
                                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#fafafa] to-transparent z-[5] pointer-events-none hidden md:block group-hover:from-white"></div>

                                {/* Right Arrow */}
                                <button 
                                    onClick={() => {
                                        const container = document.getElementById('category-scroll-container');
                                        if (container) container.scrollBy({ left: 250, behavior: 'smooth' });
                                    }}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm w-9 h-9 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.15)] text-forest opacity-0 group-hover:opacity-100 transition-all hidden md:flex items-center justify-center border border-gray-100 hover:scale-105 hover:text-gold"
                                    aria-label="Desplazar a la derecha"
                                >
                                    <svg className="w-5 h-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Toolbar row: count left, sort + filter right */}
                        <div className="flex items-center justify-between">
                            <p className="text-charcoal/60 text-sm">
                                <span className="text-gold font-semibold">{filteredProducts.length}</span> productos
                                {isFiltering && <span className="text-charcoal/40 ml-1">(resultados de búsqueda)</span>}
                            </p>

                            <div className="flex items-center gap-2">
                                {/* Sort dropdown */}
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none pl-3 pr-8 py-2 bg-white border border-kraft/30 text-sm text-forest rounded-lg focus:outline-none focus:border-gold cursor-pointer hover:border-gold/40 transition-colors"
                                    >
                                        {sortOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                    </svg>
                                </div>

                                {/* Mobile filter panel button removed as it was duplicating sort functionality */}
                            </div>
                        </div>
                    </div>

                    {/* Active filter chips */}
                    {renderActiveFilterChips()}

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {filteredProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                variantCount={variantCounts.get(product.id) || 0}
                            />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20">
                            <svg className="w-16 h-16 mx-auto mb-4 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <p className="text-charcoal/50 mb-2">
                                No hay productos con estos filtros
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-gold hover:text-gold-light underline underline-offset-2 text-sm transition-colors"
                                >
                                    Limpiar todos los filtros
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Price Filter Modal/Bottom Sheet */}
            <AnimatePresence>
                {showPricePopover && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPricePopover(false)}
                            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[100]"
                        />
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, y: '100%' }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: '100%' }}
                            className="fixed bottom-0 left-0 w-full bg-white rounded-t-3xl p-6 md:p-8 z-[101] shadow-2xl md:top-1/2 md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[400px] md:rounded-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-serif text-xl text-forest">Filtrar por Precio</h3>
                                <button onClick={() => setShowPricePopover(false)} className="p-2 text-charcoal/50 hover:text-forest bg-gray-50 rounded-full transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="mb-4">
                                <span className="text-sm font-medium text-charcoal/70">Precio Máximo:</span>
                                <span className="text-3xl font-semibold text-gold block mt-1">${priceRange[1].toLocaleString()} <span className="text-sm text-charcoal/40 font-medium">MXN</span></span>
                            </div>
                            
                            <input 
                                type="range" 
                                min={PRICE_MIN} 
                                max={computedMax} 
                                value={priceRange[1]} 
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                className="w-full accent-gold h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                            />
                            
                            <div className="flex justify-between text-xs text-charcoal/40 mt-3 font-medium">
                                <span>${PRICE_MIN}</span>
                                <span>${computedMax.toLocaleString()}</span>
                            </div>

                            <div className="mt-8">
                                <button 
                                    onClick={() => setShowPricePopover(false)}
                                    className="w-full py-3.5 bg-forest text-white rounded-xl font-medium hover:bg-forest-light transition-colors shadow-lg shadow-forest/20"
                                >
                                    Ver {filteredProducts.length} productos
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}
