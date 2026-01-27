import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../store/cartStore';
import { Link } from 'react-router-dom';

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
            transition={{ delay: index * 0.1, duration: 0.4 }}
        >
            <Link to={`/producto/${product.id}`} className="product-card block group">
                <div className="relative overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card-image transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors duration-300" />

                    {/* Quick Add Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm text-navy font-medium py-3 rounded-lg shadow-luxury opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Agregar al Carrito
                        </span>
                    </motion.button>
                </div>

                <div className="product-card-body">
                    <span className="text-xs text-charcoal-light uppercase tracking-wider">
                        {product.category}
                    </span>
                    <h3 className="product-card-title line-clamp-2">{product.name}</h3>
                    <p className="product-card-price">${product.price.toLocaleString()} MXN</p>
                </div>
            </Link>
        </motion.div>
    );
}
