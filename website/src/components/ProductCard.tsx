import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../store/cartStore';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
    product: Product;
    index?: number;
    variantCount?: number;
}

export default function ProductCard({ product, index = 0, variantCount = 0 }: ProductCardProps) {
    const { addItem, openCart } = useCartStore();
    const navigate = useNavigate();
    const hasVariants = variantCount > 1;
    const isOutOfStock = !hasVariants && product.stock === 0;
    const isOnSale = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = isOnSale
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : 0;

    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasVariants) {
            // Redirect to product detail to select variant
            navigate(`/producto/${product.id}`);
        } else {
            if (isOutOfStock) return;
            setIsAdding(true);
            addItem(product);
            setTimeout(() => {
                setIsAdding(false);
                openCart();
            }, 400);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="h-full"
        >
            <Link to={`/producto/${product.id}`} className="product-card block group h-full flex flex-col bg-white rounded-xl border border-gray-100/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative overflow-hidden bg-cream-dark aspect-[4/5]">
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />

                    {/* Image Hover Zoom (Overlay removed per user request) */}

                    {/* Quick Add Button - Always visible Mobile, Hover Desktop */}
                    <button
                        onClick={handleAddToCart}
                        type="button"
                        disabled={isAdding || isOutOfStock}
                        aria-label={
                            isOutOfStock ? `${product.name} - Agotado` :
                            hasVariants ? `Ver opciones de ${product.name}` :
                            isAdding ? `${product.name} agregado al carrito` :
                            `Agregar ${product.name} al carrito`
                        }
                        className={`lg:absolute lg:bottom-4 lg:left-4 lg:right-4 text-[10px] sm:text-xs tracking-widest uppercase font-semibold h-10 lg:translate-y-4 absolute bottom-0 left-0 right-0 w-full lg:w-auto rounded-t-xl lg:rounded-xl backdrop-blur-md border border-white/10 transition-all duration-300 ${isOutOfStock ? 'bg-charcoal/40 text-white/90 cursor-not-allowed lg:opacity-100 lg:translate-y-0' : isAdding ? 'bg-gold/90 text-white scale-[1.02] lg:opacity-100 lg:translate-y-0 shadow-md' : 'bg-forest/80 text-white hover:bg-forest shadow-lg lg:opacity-0 lg:group-hover:opacity-100 lg:group-hover:translate-y-0'}`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            {isOutOfStock ? (
                                <span>Agotado</span>
                            ) : hasVariants ? (
                                <span>Ver Opciones</span>
                            ) : isAdding ? (
                                <span>¡Agregado!</span>
                            ) : (
                                <>
                                    <span className="hidden sm:inline">Agregar</span>
                                    <span className="sm:hidden">Agregar +</span>
                                </>
                            )}
                        </span>
                    </button>

                    {/* Discount Badge — takes priority over Featured */}
                    {isOnSale ? (
                        <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-[11px] font-bold px-3 py-1.5 tracking-wider uppercase shadow-md rounded-br-xl">
                            {product.promotion ? product.promotion : `-${discountPercent}% OFF`}
                        </div>
                    ) : product.isFeatured ? (
                        <div className="absolute top-0 left-0 z-10 bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 px-2 py-1.5 shadow-md rounded-br-xl flex items-center justify-center">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        </div>
                    ) : null}

                    {/* Out of Stock Badge */}
                    {isOutOfStock && (
                        <div className="absolute top-0 right-0 z-10 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase rounded-bl-xl shadow-md">
                            Agotado
                        </div>
                    )}
                </div>

                <div className="product-card-body p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                    <div>
                        <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-[0.2em] mb-2 block font-bold">
                            {product.category}
                        </span>
                        <h3 className="font-sans text-sm sm:text-base font-bold leading-tight line-clamp-2 transition-colors mb-2 text-gray-900" style={{ color: '#001641' }}>
                            {product.name}
                        </h3>
                        {product.description && (
                            <p className="text-xs text-gray-500 line-clamp-3 mb-3 leading-relaxed">
                                {product.description}
                            </p>
                        )}
                    </div>
                    
                    <div className="flex flex-col justify-end mt-auto pt-3 border-t border-gray-100">
                        {isOnSale && (
                            <span className="text-xs sm:text-sm text-red-500/70 line-through mb-0.5 font-semibold">
                                ${product.originalPrice!.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        )}
                        <div className="flex items-baseline gap-1.5 mb-2">
                            {hasVariants && (
                                <span className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest">Desde</span>
                            )}
                            <p className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900" style={{ color: '#001641' }}>
                                ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] sm:text-xs font-semibold text-gray-400 ml-0.5">MXN</span>
                            </p>
                        </div>
                        
                        {hasVariants && (
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1.5 rounded-md self-start border border-gray-100">
                                <span>{variantCount} opciones</span>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

