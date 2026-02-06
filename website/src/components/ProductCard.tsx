import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Product } from '../store/cartStore';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
    product: Product;
    index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const { addItem, openCart } = useCartStore();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        openCart();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
        >
            <Link to={`/producto/${product.id}`} className="product-card block group">
                {/* Rose Gold Top Line (appears on hover) */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-rose-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10" />

                <div className="relative overflow-hidden bg-charcoal">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card-image transition-all duration-500 group-hover:scale-110"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-noir/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quick Add Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        className="absolute bottom-4 left-4 right-4 bg-rose-gold/95 backdrop-blur-sm text-noir text-xs tracking-widest uppercase font-semibold py-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Agregar
                        </span>
                    </motion.button>

                    {/* Stock Badge (optional - show if low) */}
                    {product.stock && product.stock < 10 && (
                        <div className="absolute top-3 right-3 bg-noir/80 backdrop-blur-sm px-2 py-1 text-xs text-rose-gold tracking-wider">
                            Últimos {product.stock}
                        </div>
                    )}
                </div>

                <div className="product-card-body bg-noir">
                    <span className="text-xs text-pearl/40 uppercase tracking-[0.2em]">
                        {product.category}
                    </span>
                    <h3 className="product-card-title font-serif text-pearl mt-1 line-clamp-2 group-hover:text-champagne transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-center gap-3 mt-2">
                        <p className="product-card-price text-rose-gold font-semibold">
                            ${product.price.toLocaleString()} MXN
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
