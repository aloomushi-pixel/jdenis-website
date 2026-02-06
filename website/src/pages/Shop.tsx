import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { categories, getProductsByCategory } from '../data/products';

export default function Shop() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    const filteredProducts = useMemo(() => {
        let result = getProductsByCategory(activeCategory);

        if (sortBy === 'price-low') {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            result = [...result].sort((a, b) => b.price - a.price);
        } else {
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [activeCategory, sortBy]);

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <section className="pt-32 pb-16 bg-forest relative overflow-hidden">
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
                        <h1 className="font-serif text-4xl md:text-5xl text-cream mb-4">Tienda B2B</h1>
                        <p className="text-cream/70 max-w-xl mx-auto">
                            Insumos de laboratorio con calidad científica para profesionales de la belleza
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="section section-cream py-12">
                <div className="container-luxury">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className="lg:w-72 flex-shrink-0">
                            <div className="sticky top-28 bg-white border border-kraft/30 p-6">
                                <h3 className="font-serif text-lg text-forest mb-6">Categorías</h3>
                                <div className="space-y-1">
                                    {categories.map((cat) => (
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
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-charcoal/60 text-sm">
                                    <span className="text-gold font-medium">{filteredProducts.length}</span> productos encontrados
                                </p>
                                {/* Mobile Filter Chips */}
                                <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
                                    {categories.slice(0, 4).map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`px-3 py-2 text-xs whitespace-nowrap border transition-all ${activeCategory === cat.id
                                                ? 'bg-gold text-forest border-gold'
                                                : 'border-kraft/30 text-charcoal/70 hover:border-gold'
                                                }`}
                                        >
                                            {cat.icon} {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
