import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import type { Product as CartProduct } from '../store/cartStore';
import { categories as localCategories, getDisplayProducts, getVariantCount } from '../data/products';

// Price boundaries (computed once)
const ALL_PRODUCTS = getDisplayProducts();
const PRICE_MIN = 0;
const PRICE_MAX = Math.ceil(Math.max(...ALL_PRODUCTS.map(p => p.price)) / 100) * 100; // round up to nearest 100

export default function Shop() {
    const [searchParams] = useSearchParams();
    const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'all');
    const [sortBy, setSortBy] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<CartProduct[]>([]);
    const [loading, setLoading] = useState(true);

    // Advanced filters
    const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
    const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Use local products as the primary and always-available data source
    useEffect(() => {
        setProducts(getDisplayProducts());
        setLoading(false);
    }, []);

    // Sync category filter with URL ?cat= param
    useEffect(() => {
        const cat = searchParams.get('cat');
        if (cat) setActiveCategory(cat);
    }, [searchParams]);

    // Check if any advanced filter is active
    const hasActiveFilters = useMemo(() => {
        return (
            priceRange[0] > PRICE_MIN ||
            priceRange[1] < PRICE_MAX ||
            showFeaturedOnly ||
            searchQuery.length > 0 ||
            activeCategory !== 'all'
        );
    }, [priceRange, showFeaturedOnly, searchQuery, activeCategory]);

    const clearAllFilters = () => {
        setPriceRange([PRICE_MIN, PRICE_MAX]);
        setShowFeaturedOnly(false);
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

        // Featured-only filter
        if (showFeaturedOnly) {
            result = result.filter(p => p.isFeatured);
        }

        // Sort by selected criteria
        result = [...result].sort((a, b) => {
            if (sortBy === 'featured') {
                const aFeat = a.isFeatured ? 1 : 0;
                const bFeat = b.isFeatured ? 1 : 0;
                if (aFeat !== bFeat) return bFeat - aFeat;
                return a.name.localeCompare(b.name);
            }
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
            return a.name.localeCompare(b.name);
        });

        return result;
    }, [products, activeCategory, sortBy, searchQuery, priceRange, showFeaturedOnly]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
        );
    }

    // Shared sort options for both desktop and mobile
    const sortOptions = [
        { value: 'name', label: 'Nombre A-Z' },
        { value: 'name-desc', label: 'Nombre Z-A' },
        { value: 'price-low', label: 'Precio: Menor a Mayor' },
        { value: 'price-high', label: 'Precio: Mayor a Menor' },
        { value: 'featured', label: '⭐ Destacados Primero' },
    ];

    // Price range filter component (shared between desktop sidebar and mobile panel)
    const PriceRangeFilter = () => (
        <div>
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
                        className="w-full pl-5 pr-2 py-2 border border-kraft/30 text-sm text-forest bg-cream focus:outline-none focus:border-gold rounded-sm"
                        placeholder="Min"
                    />
                </div>
                <span className="text-charcoal/40 text-xs">—</span>
                <div className="relative flex-1">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-charcoal/50">$</span>
                    <input
                        type="number"
                        min={priceRange[0]}
                        max={PRICE_MAX}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Math.min(PRICE_MAX, Number(e.target.value))])}
                        className="w-full pl-5 pr-2 py-2 border border-kraft/30 text-sm text-forest bg-cream focus:outline-none focus:border-gold rounded-sm"
                        placeholder="Max"
                    />
                </div>
            </div>
            {/* Visual price bar */}
            <div className="mt-3 h-1.5 bg-kraft/20 rounded-full relative overflow-hidden">
                <div
                    className="absolute h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-300"
                    style={{
                        left: `${(priceRange[0] / PRICE_MAX) * 100}%`,
                        right: `${100 - (priceRange[1] / PRICE_MAX) * 100}%`,
                    }}
                />
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-[10px] text-charcoal/40">${PRICE_MIN}</span>
                <span className="text-[10px] text-charcoal/40">${PRICE_MAX.toLocaleString()}</span>
            </div>
        </div>
    );

    // Featured toggle component (shared)
    const FeaturedToggle = () => (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
                <input
                    type="checkbox"
                    checked={showFeaturedOnly}
                    onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                    className="sr-only"
                />
                <div className={`w-10 h-5 rounded-full transition-all duration-300 ${showFeaturedOnly ? 'bg-gold' : 'bg-kraft/30'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${showFeaturedOnly ? 'left-5' : 'left-0.5'}`} />
                </div>
            </div>
            <span className="text-sm text-forest group-hover:text-gold transition-colors">
                ⭐ Solo Destacados
            </span>
        </label>
    );

    // Active filter chips
    const ActiveFilterChips = () => {
        const chips: { label: string; onRemove: () => void }[] = [];

        if (activeCategory !== 'all') {
            const cat = localCategories.find(c => c.id === activeCategory);
            chips.push({
                label: `Categoría: ${cat?.name || activeCategory}`,
                onRemove: () => setActiveCategory('all'),
            });
        }
        if (searchQuery) {
            chips.push({
                label: `Búsqueda: "${searchQuery}"`,
                onRemove: () => setSearchQuery(''),
            });
        }
        if (priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX) {
            chips.push({
                label: `Precio: $${priceRange[0]} – $${priceRange[1].toLocaleString()}`,
                onRemove: () => setPriceRange([PRICE_MIN, PRICE_MAX]),
            });
        }
        if (showFeaturedOnly) {
            chips.push({
                label: '⭐ Solo Destacados',
                onRemove: () => setShowFeaturedOnly(false),
            });
        }

        if (chips.length === 0) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 mb-4"
            >
                {chips.map((chip, i) => (
                    <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={chip.onRemove}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 border border-gold/30 text-forest text-xs rounded-full hover:bg-gold/20 hover:border-gold/50 transition-all group"
                    >
                        <span>{chip.label}</span>
                        <svg className="w-3 h-3 text-charcoal/40 group-hover:text-forest transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </motion.button>
                ))}
                <button
                    onClick={clearAllFilters}
                    className="px-3 py-1.5 text-xs text-charcoal/50 hover:text-forest underline underline-offset-2 transition-colors"
                >
                    Limpiar todo
                </button>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-cream">
            {/* Header - Optimized for Mobile */}
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

                    {/* Mobile Search Bar */}
                    <div className="mt-6 md:hidden px-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gold/30 rounded-lg text-cream placeholder-cream/50 focus:outline-none focus:border-gold"
                            />
                            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section-cream py-8 md:py-12">
                <div className="container-luxury">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className="hidden lg:block lg:w-72 flex-shrink-0">
                            <div className="sticky top-28 bg-white border border-kraft/30 p-6">
                                {/* Desktop Search */}
                                <div className="mb-6">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Buscar..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 border border-kraft/30 text-sm focus:outline-none focus:border-gold"
                                        />
                                        <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                                    </div>
                                </div>

                                <h3 className="font-serif text-lg text-forest mb-6">Categorías</h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setActiveCategory('all')}
                                        className={`w-full text-left px-4 py-3 text-sm tracking-wider transition-all ${activeCategory === 'all'
                                            ? 'bg-gold text-forest font-medium'
                                            : 'text-charcoal/70 hover:bg-kraft/20 hover:text-forest'
                                            }`}
                                    >
                                        <svg className="w-4 h-4 mr-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>
                                        Ver Todo
                                    </button>
                                    {localCategories.filter(c => c.id !== 'all').map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`w-full text-left px-4 py-3 text-sm tracking-wider transition-all ${activeCategory === cat.id
                                                ? 'bg-gold text-forest font-medium'
                                                : 'text-charcoal/70 hover:bg-kraft/20 hover:text-forest'
                                                }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-3 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} /></svg>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>

                                <hr className="my-6 border-kraft/30" />

                                <h3 className="font-serif text-lg text-forest mb-4">Ordenar por</h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-3 border border-kraft/30 bg-cream text-forest focus:border-gold focus:outline-none"
                                >
                                    {sortOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>

                                <hr className="my-6 border-kraft/30" />

                                {/* Price Range Filter */}
                                <PriceRangeFilter />

                                <hr className="my-6 border-kraft/30" />

                                {/* Featured Toggle */}
                                <FeaturedToggle />

                                {/* Clear All Button */}
                                {hasActiveFilters && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onClick={clearAllFilters}
                                        className="mt-6 w-full py-2.5 border border-kraft/30 text-sm text-charcoal/60 hover:text-forest hover:border-forest/30 transition-all rounded-sm"
                                    >
                                        ✕ Limpiar Filtros
                                    </motion.button>
                                )}
                            </div>
                        </aside>

                        {/* Products Grid */}
                        <main className="flex-1">
                            {/* Mobile Filters Horizontal Scroll */}
                            <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                                <div className="flex gap-3 pb-2">
                                    <button
                                        onClick={() => setActiveCategory('all')}
                                        className={`flex-shrink-0 px-4 py-2 text-sm rounded-full border transition-all ${activeCategory === 'all'
                                            ? 'bg-gold text-forest border-gold font-medium shadow-sm'
                                            : 'bg-white border-kraft/30 text-charcoal/70'
                                            }`}
                                    >
                                        Ver Todo
                                    </button>
                                    {localCategories.filter(c => c.id !== 'all').map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`flex-shrink-0 px-4 py-2 text-sm rounded-full border transition-all flex items-center gap-2 ${activeCategory === cat.id
                                                ? 'bg-gold text-forest border-gold font-medium shadow-sm'
                                                : 'bg-white border-kraft/30 text-charcoal/70'
                                                }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} /></svg>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile toolbar: count + sort + filter button */}
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-charcoal/60 text-sm">
                                    <span className="text-gold font-medium">{filteredProducts.length}</span> productos
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="lg:hidden">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="text-sm bg-transparent border-none text-forest font-medium focus:ring-0"
                                        >
                                            {sortOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.value === 'name' ? 'A-Z' :
                                                        opt.value === 'name-desc' ? 'Z-A' :
                                                            opt.value === 'price-low' ? '$ ↑' :
                                                                opt.value === 'price-high' ? '$ ↓' :
                                                                    '⭐'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Mobile filter button */}
                                    <button
                                        onClick={() => setShowMobileFilters(true)}
                                        className={`lg:hidden flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-all ${hasActiveFilters
                                                ? 'bg-gold/10 border-gold/40 text-forest'
                                                : 'bg-white border-kraft/30 text-charcoal/70'
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                                        </svg>
                                        Filtros
                                        {hasActiveFilters && (
                                            <span className="w-2 h-2 bg-gold rounded-full" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Active Filter Chips */}
                            <ActiveFilterChips />

                            {/* 2-Column Mobile Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
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
                        </main>
                    </div>
                </div>
            </section>

            {/* Mobile Filter Panel (Slide-up) */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilters(false)}
                            className="lg:hidden fixed inset-0 bg-black/50 z-50"
                        />
                        {/* Panel */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[85vh] overflow-y-auto"
                        >
                            {/* Handle bar */}
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
                                    <PriceRangeFilter />
                                </div>

                                {/* Featured Toggle */}
                                <div className="mb-6 p-4 bg-cream rounded-lg">
                                    <FeaturedToggle />
                                </div>

                                {/* Ordenar por */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-forest mb-3">Ordenar por</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {sortOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setSortBy(opt.value)}
                                                className={`text-left px-4 py-3 text-sm rounded-lg border transition-all ${sortBy === opt.value
                                                        ? 'bg-gold/10 border-gold/40 text-forest font-medium'
                                                        : 'bg-white border-kraft/20 text-charcoal/70 hover:border-kraft/40'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
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
