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
                <div className="relative overflow-hidden bg-cream-dark">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card-image transition-all duration-500 group-hover:scale-105"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Quick Add Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        className="absolute bottom-4 left-4 right-4 bg-gold text-forest text-xs tracking-widest uppercase font-semibold py-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
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
                        <div className="absolute top-3 right-3 bg-forest/80 backdrop-blur-sm px-2 py-1 text-xs text-gold tracking-wider">
                            Últimos {product.stock}
                        </div>
                    )}
                </div>

                <div className="product-card-body">
                    <span className="text-xs text-charcoal/50 uppercase tracking-[0.15em]">
                        {product.category}
                    </span>
                    <h3 className="product-card-title mt-2 line-clamp-2 group-hover:text-gold transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-center gap-3 mt-3">
                        <p className="product-card-price">
                            ${product.price.toLocaleString()} MXN
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
