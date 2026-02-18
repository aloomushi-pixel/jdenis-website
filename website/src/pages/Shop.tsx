import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import type { Product as CartProduct } from '../store/cartStore';
import { categories as localCategories, getDisplayProducts, getVariantCount } from '../data/products';
import { useProducts } from '../hooks/useProducts';

// Price boundaries (fallback, will be recalculated with Supabase data)
const FALLBACK_PRODUCTS = getDisplayProducts();
const PRICE_MIN = 0;
const FALLBACK_PRICE_MAX = Math.ceil(Math.max(...FALLBACK_PRODUCTS.map(p => p.price)) / 100) * 100;

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
    const [sortBy, setSortBy] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<CartProduct[]>([]);
    const [loading, setLoading] = useState(true);

    // Advanced filters
    const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, FALLBACK_PRICE_MAX]);
    const [showOffersOnly, setShowOffersOnly] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Supabase-backed product data (merges local + cloud overrides)
    const { displayProducts: mergedProducts, loading: supabaseLoading } = useProducts();

    useEffect(() => {
        // Use merged products (Supabase overrides applied to local base)
        setProducts(mergedProducts);
        if (!supabaseLoading) setLoading(false);

        // Recalculate price range if needed
        if (mergedProducts.length > 0) {
            const maxPrice = Math.ceil(Math.max(...mergedProducts.map(p => p.price)) / 100) * 100;
            setPriceRange(prev => [prev[0], Math.max(prev[1], maxPrice)]);
        }
    }, [mergedProducts, supabaseLoading]);

    useEffect(() => {
        const cat = searchParams.get('cat');
        if (cat) setActiveCategory(cat);
    }, [searchParams]);

    // Products with promotions
    const promoProducts = useMemo(() => {
        return products.filter(p => p.originalPrice && p.originalPrice > p.price);
    }, [products]);

    // Featured products
    const featuredProducts = useMemo(() => {
        return products.filter(p => p.isFeatured);
    }, [products]);

    // Check if any advanced filter is active
    const hasActiveFilters = useMemo(() => {
        return (
            priceRange[0] > PRICE_MIN ||
            priceRange[1] < FALLBACK_PRICE_MAX ||
            showOffersOnly ||
            searchQuery.length > 0 ||
            activeCategory !== 'all'
        );
    }, [priceRange, showOffersOnly, searchQuery, activeCategory]);

    const clearAllFilters = () => {
        setPriceRange([PRICE_MIN, FALLBACK_PRICE_MAX]);
        setShowOffersOnly(false);
        setSearchQuery('');
        setActiveCategory('all');
        setSortBy('name');
    };

    const filteredProducts = useMemo(() => {
        let result = products;

        if (activeCategory !== 'all') {
            const cat = localCategories.find(c => c.id === activeCategory);
            const catName = cat ? cat.name : activeCategory;
            result = result.filter(p => p.category === catName || p.category.toLowerCase() === activeCategory.toLowerCase());
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                (p.description && p.description.toLowerCase().includes(query))
            );
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
    }, [products, activeCategory, sortBy, searchQuery, priceRange, showOffersOnly]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
        );
    }

    // Active filter chips
    const ActiveFilterChips = () => {
        const chips: { label: string; onRemove: () => void }[] = [];

        if (activeCategory !== 'all') {
            const cat = localCategories.find(c => c.id === activeCategory);
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
        if (priceRange[0] > PRICE_MIN || priceRange[1] < FALLBACK_PRICE_MAX) {
            chips.push({
                label: `$${priceRange[0]} – $${priceRange[1].toLocaleString()}`,
                onRemove: () => setPriceRange([PRICE_MIN, FALLBACK_PRICE_MAX]),
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
            {/* Header */}
            <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-forest relative overflow-hidden">
                <div className="absolute inset-0 botanical-pattern opacity-20" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                <div className="container-luxury relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <span className="inline-block px-4 py-2 bg-gold/20 border border-gold/40 text-gold text-sm font-medium mb-4">
                            Catálogo Profesional
                        </span>
                        <h1 className="font-serif text-3xl md:text-5xl text-cream mb-4">Tienda B2B</h1>
                        <p className="hidden md:block text-cream/70 max-w-xl mx-auto">
                            Insumos de laboratorio con calidad científica para profesionales de la belleza
                        </p>
                    </motion.div>

                    {/* Search Bar (in header) */}
                    <div className="mt-6 max-w-md mx-auto px-4 md:px-0">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-cream placeholder-cream/50 focus:outline-none focus:border-gold backdrop-blur-sm"
                            />
                            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
                FEATURED PRODUCTS SECTION — Highlighted products
               ═══════════════════════════════════════════════════ */}
            {featuredProducts.length > 0 && (
                <section className="py-8 md:py-12 bg-gradient-to-b from-forest/5 to-cream">
                    <div className="container-luxury">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center">
                                    <span className="text-lg">⭐</span>
                                </div>
                                <div>
                                    <h2 className="font-serif text-xl md:text-2xl text-forest">Productos Destacados</h2>
                                    <p className="text-xs text-charcoal/50 mt-0.5">Los favoritos de nuestros profesionales</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setSortBy('featured'); window.scrollTo({ top: document.getElementById('shop-grid')?.offsetTop ? document.getElementById('shop-grid')!.offsetTop - 100 : 500, behavior: 'smooth' }); }}
                                className="hidden md:flex items-center gap-1.5 text-sm text-gold hover:text-gold-light transition-colors font-medium"
                            >
                                Ver todos
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                            </button>
                        </div>

                        {/* Horizontal scroll of featured products */}
                        <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
                            <div className="flex gap-4 pb-2" style={{ minWidth: 'max-content' }}>
                                {featuredProducts.slice(0, 8).map((product, index) => (
                                    <div key={product.id} className="w-[160px] sm:w-[200px] md:w-[220px] flex-shrink-0">
                                        <ProductCard
                                            product={product}
                                            index={index}
                                            variantCount={getVariantCount(product.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════════════════
                MAIN SHOP — Category pills + Filter bar top-right + Grid
               ═══════════════════════════════════════════════════ */}
            <section id="shop-grid" className="section section-cream py-8 md:py-12">
                <div className="container-luxury">

                    {/* ─── Top Filter Bar ─── */}
                    <div className="flex flex-col gap-4 mb-6">

                        {/* Category pills (horizontal scroll) */}
                        <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
                            <div className="flex gap-2 pb-1">
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className={`flex-shrink-0 px-4 py-2 text-sm rounded-full border transition-all ${activeCategory === 'all'
                                        ? 'bg-gold text-forest border-gold font-medium shadow-sm'
                                        : 'bg-white border-kraft/30 text-charcoal/70 hover:border-gold/40'
                                        }`}
                                >
                                    Ver Todo
                                </button>
                                {/* Offers quick-filter pill */}
                                <button
                                    onClick={() => setShowOffersOnly(!showOffersOnly)}
                                    className={`flex-shrink-0 px-4 py-2 text-sm rounded-full border transition-all flex items-center gap-1.5 ${showOffersOnly
                                        ? 'bg-red-500 text-white border-red-500 font-medium shadow-sm'
                                        : 'bg-white border-kraft/30 text-charcoal/70 hover:border-red-300'
                                        }`}
                                >
                                    🔥 Ofertas
                                    {promoProducts.length > 0 && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${showOffersOnly ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                                            {promoProducts.length}
                                        </span>
                                    )}
                                </button>
                                {localCategories.filter(c => c.id !== 'all').map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex-shrink-0 px-4 py-2 text-sm rounded-full border transition-all flex items-center gap-2 ${activeCategory === cat.id
                                            ? 'bg-gold text-forest border-gold font-medium shadow-sm'
                                            : 'bg-white border-kraft/30 text-charcoal/70 hover:border-gold/40'
                                            }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} /></svg>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toolbar row: count left, sort + filter right */}
                        <div className="flex items-center justify-between">
                            <p className="text-charcoal/60 text-sm">
                                <span className="text-gold font-semibold">{filteredProducts.length}</span> productos
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

                                {/* Filter button (opens panel) */}
                                <button
                                    onClick={() => setShowMobileFilters(true)}
                                    className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-all ${(priceRange[0] > PRICE_MIN || priceRange[1] < FALLBACK_PRICE_MAX)
                                        ? 'bg-gold/10 border-gold/40 text-forest'
                                        : 'bg-white border-kraft/30 text-charcoal/70 hover:border-gold/40'
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                                    </svg>
                                    <span className="hidden sm:inline">Filtros</span>
                                    {(priceRange[0] > PRICE_MIN || priceRange[1] < FALLBACK_PRICE_MAX) && (
                                        <span className="w-2 h-2 bg-gold rounded-full" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active filter chips */}
                    <ActiveFilterChips />

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {filteredProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                variantCount={getVariantCount(product.id)}
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

            {/* ═══════════════════════════════════════════════════
                FILTER PANEL (Slide-up overlay)
               ═══════════════════════════════════════════════════ */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilters(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto"
                        >
                            {/* Handle */}
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1 bg-kraft/40 rounded-full" />
                            </div>

                            <div className="px-6 pb-6">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-serif text-xl text-forest">Filtros</h3>
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="p-2 text-charcoal/50 hover:text-forest transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-forest mb-3">Rango de Precio</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-charcoal/50">$</span>
                                            <input
                                                type="number"
                                                min={PRICE_MIN}
                                                max={priceRange[1]}
                                                value={priceRange[0]}
                                                onChange={(e) => setPriceRange([Math.max(PRICE_MIN, Number(e.target.value)), priceRange[1]])}
                                                className="w-full pl-5 pr-2 py-2.5 border border-kraft/30 text-sm text-forest bg-cream focus:outline-none focus:border-gold rounded-lg"
                                                placeholder="Min"
                                            />
                                        </div>
                                        <span className="text-charcoal/40 text-xs">—</span>
                                        <div className="relative flex-1">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-charcoal/50">$</span>
                                            <input
                                                type="number"
                                                min={priceRange[0]}
                                                max={FALLBACK_PRICE_MAX}
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([priceRange[0], Math.min(FALLBACK_PRICE_MAX, Number(e.target.value))])}
                                                className="w-full pl-5 pr-2 py-2.5 border border-kraft/30 text-sm text-forest bg-cream focus:outline-none focus:border-gold rounded-lg"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>
                                    {/* Visual price bar */}
                                    <div className="mt-3 h-1.5 bg-kraft/20 rounded-full relative overflow-hidden">
                                        <div
                                            className="absolute h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-300"
                                            style={{
                                                left: `${(priceRange[0] / FALLBACK_PRICE_MAX) * 100}%`,
                                                right: `${100 - (priceRange[1] / FALLBACK_PRICE_MAX) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-[10px] text-charcoal/40">${PRICE_MIN}</span>
                                        <span className="text-[10px] text-charcoal/40">${FALLBACK_PRICE_MAX.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Offers Toggle */}
                                <div className="mb-6 p-4 bg-cream rounded-lg">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={showOffersOnly}
                                                onChange={(e) => setShowOffersOnly(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-10 h-5 rounded-full transition-all duration-300 ${showOffersOnly ? 'bg-red-500' : 'bg-kraft/30'}`}>
                                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${showOffersOnly ? 'left-5' : 'left-0.5'}`} />
                                            </div>
                                        </div>
                                        <span className="text-sm text-forest group-hover:text-red-500 transition-colors">
                                            🔥 Solo Ofertas
                                        </span>
                                    </label>
                                </div>

                                {/* Sort options */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-forest mb-3">Ordenar por</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {sortOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setSortBy(opt.value)}
                                                className={`text-left px-3 py-2.5 text-sm rounded-lg border transition-all ${sortBy === opt.value
                                                    ? 'bg-gold/10 border-gold/40 text-forest font-medium'
                                                    : 'bg-white border-kraft/20 text-charcoal/70 hover:border-kraft/40'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    {hasActiveFilters && (
                                        <button
                                            onClick={() => {
                                                clearAllFilters();
                                                setShowMobileFilters(false);
                                            }}
                                            className="flex-1 py-3 border border-kraft/30 text-charcoal/60 text-sm rounded-lg hover:text-forest transition-colors"
                                        >
                                            Limpiar
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="flex-1 py-3 bg-gold text-forest text-sm font-semibold rounded-lg hover:bg-gold-light transition-colors"
                                    >
                                        Ver {filteredProducts.length} productos
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
