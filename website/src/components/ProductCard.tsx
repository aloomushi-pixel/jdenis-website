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
            <Link to={`/producto/${product.id}`} className="product-card block group h-full flex flex-col bg-white">
                <div className="relative overflow-hidden bg-cream-dark aspect-[4/5]">
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />

                    {/* Overlay on hover (Desktop only) */}
                    <div className="hidden lg:block absolute inset-0 bg-forest/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quick Add Button - Always visible Mobile, Hover Desktop */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className={`lg:absolute lg:bottom-4 lg:left-4 lg:right-4 text-white text-[10px] sm:text-xs tracking-widest uppercase font-semibold h-10 lg:translate-y-4 absolute bottom-0 left-0 right-0 w-full lg:w-auto lg:rounded-sm transition-all duration-300 ${isAdding ? 'bg-gold scale-[1.02] lg:opacity-100 lg:translate-y-0 shadow-md' : 'bg-forest hover:bg-forest-light lg:opacity-0 lg:group-hover:opacity-100 lg:group-hover:translate-y-0'}`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            {hasVariants ? (
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
                        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-[11px] font-bold px-2 py-1 tracking-wider uppercase shadow-lg rounded-sm">
                            {product.promotion ? product.promotion : `-${discountPercent}% OFF`}
                        </div>
                    ) : product.isFeatured ? (
                        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 text-[10px] sm:text-[11px] font-bold px-2 py-1 tracking-wider uppercase shadow-lg animate-pulse" style={{ animationDuration: '3s' }}>
                            ⭐ Destacado
                        </div>
                    ) : null}

                    {/* Variant Count Badge */}
                    {hasVariants && (
                        <div className="absolute top-2 right-2 z-10 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold tracking-wider rounded-sm bg-gold text-white">
                            {variantCount} opciones
                        </div>
                    )}

                    {/* Stock Badge */}
                    {!hasVariants && product.stock && product.stock < 10 && (
                        <div className="absolute top-2 right-2 bg-forest/80 backdrop-blur-sm px-2.5 py-1 text-[10px] text-gold tracking-wider rounded-sm">
                            Últimos {product.stock}
                        </div>
                    )}
                </div>

                <div className="product-card-body p-4 sm:p-5 flex flex-col flex-1">
                    <span className="text-[10px] sm:text-xs text-charcoal/50 uppercase tracking-[0.15em] mb-1.5 block">
                        {product.category}
                    </span>
                    <h3 className="font-serif text-sm sm:text-base text-gold font-medium line-clamp-2 transition-colors mb-auto">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-kraft/20">
                        <div className="flex items-center gap-2">
                            <p className="text-sm sm:text-base font-semibold text-black">
                                {hasVariants ? (
                                    <span>Desde ${product.price.toLocaleString()}</span>
                                ) : (
                                    <span>${product.price.toLocaleString()}</span>
                                )}
                            </p>
                            {isOnSale && (
                                <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                                    ${product.originalPrice!.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

