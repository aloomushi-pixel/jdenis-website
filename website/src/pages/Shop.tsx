import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
            <section className="bg-blush/50 py-12">
                <div className="container-luxury">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="section-title text-center"
                    >
                        Tienda Profesional
                    </motion.h1>
                    <p className="text-center text-charcoal-light max-w-2xl mx-auto">
                        Insumos de laboratorio con calidad científica para profesionales de la belleza
                    </p>
                </div>
            </section>

            <section className="section py-8">
                <div className="container-luxury">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <aside className="lg:w-64 flex-shrink-0">
                            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-luxury">
                                <h3 className="font-serif text-lg text-navy mb-4">Categorías</h3>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeCategory === cat.id
                                                ? 'bg-gold text-white'
                                                : 'hover:bg-blush text-charcoal'
                                                }`}
                                        >
                                            <span className="mr-2">{cat.icon}</span>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>

                                <hr className="my-6 border-charcoal/10" />

                                <h3 className="font-serif text-lg text-navy mb-4">Ordenar por</h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="select text-sm"
                                >
                                    <option value="name">Nombre A-Z</option>
                                    <option value="price-low">Precio: Menor a Mayor</option>
                                    <option value="price-high">Precio: Mayor a Menor</option>
                                </select>
                            </div>
                        </aside>

                        {/* Products Grid */}
                        <main className="flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-charcoal-light">
                                    {filteredProducts.length} productos encontrados
                                </p>
                                {/* Mobile Filter Toggle - simplified */}
                                <div className="lg:hidden flex gap-2">
                                    {categories.slice(0, 4).map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
                                        >
                                            {cat.icon}
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
                                <div className="text-center py-16">
                                    <p className="text-charcoal-light">
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
