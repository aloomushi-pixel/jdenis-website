import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../store/searchStore';
import { useProducts, type DisplayProduct } from '../hooks/useProducts';

const CATEGORIES = [
  { id: 'todo', name: 'Todos los productos', icon: '🛍️' },
  { id: 'Pestañas', name: 'Pestañas', icon: '👁️' },
  { id: 'Cejas', name: 'Cejas', icon: '✨' },
  { id: 'Kits', name: 'Kits Profesionales', icon: '🎁' },
  { id: 'Adhesivos', name: 'Adhesivos', icon: '💧' },
  { id: 'Herramientas', name: 'Herramientas', icon: '✂️' },
  { id: 'Skincare', name: 'Skincare', icon: '🧴' },
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

  const filteredProducts = products.filter((p: DisplayProduct) => {
    const matchesSearch =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()));
    
    const matchesCategory = activeCategory === 'todo' || p.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  }).slice(0, 8); // Show top 8 results

  const handleProductClick = (id: string) => {
    closeSearch();
    navigate(`/producto/${id}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      closeSearch();
      navigate(`/tienda?q=${encodeURIComponent(query)}`);
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
            className="absolute inset-0 bg-transparent"
          />

          <div className="relative w-[90vw] md:w-[60vw] max-w-4xl flex flex-col z-10">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl overflow-hidden flex items-center"
            >
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-11 pr-12 py-2.5 bg-transparent text-white text-base placeholder-white/50 focus:outline-none transition-all"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </form>
            </motion.div>

            <AnimatePresence>
              {query.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] sm:max-h-[70vh]"
                >
                  <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
                    {/* Categories Sidebar (Hidden on mobile) */}
                    <div className="hidden sm:block w-48 bg-black/20 p-3 overflow-y-auto border-r border-white/10 scrollbar-hide">
                      <h3 className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-3 px-2">Categorías</h3>
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

                    {/* Mobile Categories Scroll (Visible only on mobile) */}
                    <div className="sm:hidden border-b border-white/10 p-2 bg-black/20 overflow-x-auto scrollbar-hide">
                      <div className="flex gap-1.5 min-w-max">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                              activeCategory === cat.id
                                ? 'bg-gold text-[#001641] font-medium'
                                : 'bg-white/5 text-white/80 border border-white/10'
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                          {filteredProducts.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => handleProductClick(product.id)}
                              className="group flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                            >
                              <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0 bg-white/5">
                                <img
                                  src={product.image || 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&q=80&w=300'}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                              <div className="flex-1 min-w-0 py-0.5">
                                <h4 className="text-white font-medium text-xs line-clamp-2 group-hover:text-gold transition-colors">
                                  {product.name}
                                </h4>
                                <p className="text-white/40 text-[10px] mt-0.5 truncate">{product.category}</p>
                                <div className="mt-1 text-gold font-semibold text-xs">
                                  ${product.price.toFixed(2)}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 text-2xl">
                            🔍
                          </div>
                          <h3 className="text-white/90 font-medium text-sm mb-1">No encontramos resultados</h3>
                          <p className="text-white/40 text-xs max-w-[250px]">
                            No hay productos que coincidan con "{query}".
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Mobile close button at bottom when results are open, or always visible? 
                Since they can click outside, maybe we don't need a huge close button, 
                but we can keep a subtle one or let them tap the backdrop. */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={closeSearch}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full text-xs transition-colors backdrop-blur-md"
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
