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
        <div className="fixed inset-0 z-[100] flex flex-col items-center pt-4 sm:pt-16 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="absolute inset-0 bg-[#001641]/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            className="relative w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Search Header */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center gap-4">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="¿Qué estás buscando? Pestañas, kits, adhesivos..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-14 pr-12 py-4 bg-white/5 border border-white/20 rounded-xl text-white text-lg placeholder-white/40 focus:outline-none focus:border-gold focus:bg-white/10 transition-all"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </form>
              <button
                onClick={closeSearch}
                className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors hidden sm:block"
                aria-label="Cerrar búsqueda"
              >
                Esc
              </button>
            </div>

            {/* Results Area */}
            <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
              {/* Categories Sidebar (Hidden on mobile) */}
              <div className="hidden sm:block w-64 bg-black/20 p-4 overflow-y-auto border-r border-white/10">
                <h3 className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-4 px-3">Explorar por Categoría</h3>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-gold text-[#001641] font-medium'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Categories Scroll (Visible only on mobile) */}
              <div className="sm:hidden border-b border-white/10 p-3 bg-black/20 overflow-x-auto custom-scrollbar">
                <div className="flex gap-2 min-w-max">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-gold text-[#001641] font-medium'
                          : 'bg-white/5 text-white border border-white/10'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="text-sm">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors text-left"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                          <img
                            src={product.image || 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&q=80&w=300'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-gold transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-white/50 text-xs mt-1 truncate">{product.category}</p>
                          <div className="mt-2 text-gold font-semibold text-sm">
                            ${product.price.toFixed(2)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-3xl">
                      🔍
                    </div>
                    <h3 className="text-white font-medium text-lg mb-2">No encontramos resultados</h3>
                    <p className="text-white/50 text-sm max-w-sm">
                      No hay productos que coincidan con "{query}". Intenta con otros términos o explora nuestras categorías.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile close button at bottom */}
            <div className="sm:hidden p-4 border-t border-white/10 bg-black/40">
              <button
                onClick={closeSearch}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
