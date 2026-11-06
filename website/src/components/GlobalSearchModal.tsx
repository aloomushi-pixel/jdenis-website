import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Sparkles, Package, Droplet, Scissors, ShoppingBag, X } from 'lucide-react';
import { useSearchStore } from '../store/searchStore';
import { useProducts, type DisplayProduct } from '../hooks/useProducts';
import { matchesProductSearch } from '../utils/seoData';
import { trackEvent } from '../utils/telemetry';

const CATEGORIES = [
  { id: 'todo', name: 'Todos los productos', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'Brow Henna', name: 'Brow Henna / Rubor Cejas', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'Diseño de Cejas', name: 'Diseño y Gel de Cejas', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'Lash Lifting', name: 'Lash Lifting', icon: <Eye className="w-4 h-4" /> },
  { id: 'Pigmentos', name: 'Pigmentos y Tintes', icon: <Package className="w-4 h-4" /> },
  { id: 'Adhesivos', name: 'Adhesivos', icon: <Droplet className="w-4 h-4" /> },
  { id: 'Tratamientos', name: 'Tratamientos y Sueros', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'Herramientas', name: 'Herramientas', icon: <Scissors className="w-4 h-4" /> },
];

const QUICK_SUGGESTIONS = [
  'Rubor para cejas',
  'Gel fijador de cejas',
  'Pigmento para cejas',
  'Lash Lifting Cisteamina',
  'Brow Henna',
  'Rímel Queratina',
];

export default function GlobalSearchModal() {
  const { isOpen, closeSearch } = useSearchStore();
  const { products, loading } = useProducts();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('todo');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const scoredResults = useMemo(() => {
    if (!query.trim()) return [];
    const matches: Array<{ product: DisplayProduct; score: number }> = [];
    for (const p of products) {
      const matchesCat = activeCategory === 'todo' || p.category === activeCategory;
      if (!matchesCat) continue;
      const { matches: isMatch, score } = matchesProductSearch(p, query);
      if (isMatch) {
        matches.push({ product: p, score });
      }
    }
    matches.sort((a, b) => b.score - a.score);
    return matches.map(m => m.product);
  }, [products, query, activeCategory]);

  const filteredProducts = useMemo(() => scoredResults.slice(0, 9), [scoredResults]);

  // Debounced search telemetry (1200ms so partial keystrokes while typing don't spam events)
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) return;
    const timer = setTimeout(() => {
      trackEvent('product_search', 'ecommerce', {
        query: trimmed,
        results_count: scoredResults.length,
        category_filter: activeCategory,
        source: 'global_modal',
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [query, scoredResults.length, activeCategory]);

  const handleProductClick = (id: string) => {
    closeSearch();
    navigate(`/producto/${id}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      trackEvent('product_search', 'ecommerce', {
        query: query.trim(),
        results_count: scoredResults.length,
        category_filter: activeCategory,
        source: 'global_modal_submit',
      });
      closeSearch();
      navigate(`/tienda?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          <div className="relative w-[92vw] md:w-[68vw] max-w-4xl flex flex-col z-10">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              className="bg-[#001641]/95 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl overflow-hidden flex items-center"
            >
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Busca ej. rubor para cejas, gel fijador, henna, cisteamina, pigmento..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-transparent text-white text-sm sm:text-base placeholder-white/50 focus:outline-none transition-all"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            </motion.div>

            {/* Quick suggestions when query is empty */}
            {query.trim().length === 0 && (
              <div className="mt-3 bg-[#001641]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-xl">
                <p className="text-[11px] uppercase tracking-wider text-white/50 mb-2.5 font-semibold">
                  Búsquedas frecuentes (Menudeo y Mayoreo)
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-gold hover:text-[#001641] text-white/90 text-xs transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {query.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 bg-[#001641]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] sm:max-h-[70vh]"
                >
                  <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
                    {/* Categories Sidebar */}
                    <div className="hidden sm:block w-52 bg-black/20 p-3 overflow-y-auto border-r border-white/10 scrollbar-hide">
                      <h3 className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-3 px-2">
                        Categorías
                      </h3>
                      <div className="space-y-0.5">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                              activeCategory === cat.id
                                ? 'bg-gold text-[#001641] font-medium'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span className="text-sm">{cat.icon}</span>
                            <span className="text-xs">{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Categories Scroll */}
                    <div className="sm:hidden border-b border-white/10 p-2 bg-black/20 overflow-x-auto scrollbar-hide">
                      <div className="flex gap-1.5 min-w-max">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                              activeCategory === cat.id
                                ? 'bg-gold text-[#001641] font-medium'
                                : 'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span className="text-sm">{cat.icon}</span>
                            <span className="text-xs">{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 p-3 sm:p-4 overflow-y-auto scrollbar-hide">
                      {loading ? (
                        <div className="flex items-center justify-center h-32">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div>
                        </div>
                      ) : filteredProducts.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-[11px] text-white/50">
                              {scoredResults.length} resultado{scoredResults.length === 1 ? '' : 's'} para "{query}"
                            </span>
                            <button
                              type="button"
                              onClick={handleSearchSubmit}
                              className="text-[11px] text-gold hover:underline font-medium"
                            >
                              Ver todos en tienda →
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                            {filteredProducts.map((product) => (
                              <button
                                key={product.id}
                                onClick={() => handleProductClick(product.slug || product.id)}
                                className="group flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                              >
                                <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0 bg-white/5 aspect-square">
                                  <img
                                    src={
                                      product.image ||
                                      'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&q=80&w=300'
                                    }
                                    alt={product.name}
                                    width={56}
                                    height={56}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                </div>
                                <div className="flex-1 min-w-0 py-0.5">
                                  <h4 className="text-white font-medium text-xs line-clamp-2 group-hover:text-gold transition-colors">
                                    {product.name}
                                  </h4>
                                  <p className="text-white/40 text-[10px] mt-0.5 truncate">{product.category}</p>
                                  <div className="mt-1 text-gold font-semibold text-xs">
                                    ${product.price.toFixed(2)} MXN
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 text-white/50">
                            <Search className="w-6 h-6" />
                          </div>
                          <h3 className="text-white/90 font-medium text-sm mb-1">No encontramos resultados</h3>
                          <p className="text-white/40 text-xs max-w-[260px] mb-3">
                            No hay productos que coincidan con "{query}". Prueba con términos como:
                          </p>
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {QUICK_SUGGESTIONS.slice(0, 4).map((term) => (
                              <button
                                key={term}
                                type="button"
                                onClick={() => setQuery(term)}
                                className="px-2.5 py-1 rounded-full bg-white/10 text-gold text-xs hover:bg-white/20"
                              >
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex justify-center">
              <button
                onClick={closeSearch}
                className="px-6 py-2 bg-[#001641]/90 hover:bg-[#001641] border border-white/20 text-white/90 hover:text-white rounded-full text-sm font-medium transition-colors backdrop-blur-md shadow-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
