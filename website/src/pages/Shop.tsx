import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import type { Product as CartProduct } from '../store/cartStore';
import { products as localProducts, categories as localCategories } from '../data/products';

export default function Shop() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<CartProduct[]>([]);
    const [loading, setLoading] = useState(true);

    // Use local products as the primary and always-available data source
    useEffect(() => {
        setProducts(localProducts);
        setLoading(false);
    }, []);

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

        // Sort: featured products always first, then by selected criteria
        result = [...result].sort((a, b) => {
            // Featured products come first
            const aFeat = a.isFeatured ? 1 : 0;
            const bFeat = b.isFeatured ? 1 : 0;
            if (aFeat !== bFeat) return bFeat - aFeat;

            // Then sort by selected criteria
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            return a.name.localeCompare(b.name);
        });

        return result;
    }, [products, activeCategory, sortBy, searchQuery]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
        );
    }

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
                            <span className="absolute left-3 top-3.5 text-gold">🔍</span>
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
                                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
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
                                        <span className="mr-3">📋</span>
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
                                            <span className="mr-3">{cat.icon}</span>
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
                                    <option value="name">Nombre A-Z</option>
                                    <option value="price-low">Precio: Menor a Mayor</option>
                                    <option value="price-high">Precio: Mayor a Menor</option>
                                </select>
                            </div>
                        </aside>

                        {/* Products Grid */}
                        <main className="flex-1">
                            {/* Mobile Filters Horizontal Scroll */}
                            <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
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
                                            <span>{cat.icon}</span>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <p className="text-charcoal/60 text-sm">
                                    <span className="text-gold font-medium">{filteredProducts.length}</span> productos
                                </p>
                                <div className="lg:hidden">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="text-sm bg-transparent border-none text-forest font-medium focus:ring-0"
                                    >
                                        <option value="name">Ord. A-Z</option>
                                        <option value="price-low">Precio Bajo</option>
                                        <option value="price-high">Precio Alto</option>
                                    </select>
                                </div>
                            </div>

                            {/* 2-Column Mobile Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                                {filteredProducts.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        index={index}
                                    />
                                ))}
                            </div>

                            {filteredProducts.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <p className="text-charcoal/50">
                                        No hay productos en esta categoría
                                    </p>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </section>
        </div>
    );
}
