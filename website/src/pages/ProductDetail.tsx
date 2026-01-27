import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { getProductById, products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const { addItem, openCart } = useCartStore();
    const product = getProductById(id || '');

    if (!product) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <h2 className="section-title mb-4">Producto no encontrado</h2>
                    <Link to="/tienda" className="btn btn-primary">
                        Volver a la Tienda
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addItem(product);
        openCart();
    };

    // Related products (same category, different product)
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="min-h-screen bg-cream">
            <div className="container-luxury py-12">
                {/* Breadcrumb */}
                <nav className="text-sm mb-8">
                    <Link to="/" className="text-charcoal-light hover:text-gold">Inicio</Link>
                    <span className="mx-2 text-charcoal/30">/</span>
                    <Link to="/tienda" className="text-charcoal-light hover:text-gold">Tienda</Link>
                    <span className="mx-2 text-charcoal/30">/</span>
                    <span className="text-navy">{product.name}</span>
                </nav>

                {/* Product */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-3xl overflow-hidden bg-blush shadow-luxury">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="absolute top-4 left-4 badge badge-gold">
                            {product.category}
                        </span>
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <span className="text-charcoal-light text-sm uppercase tracking-wider mb-2">
                            {product.category}
                        </span>
                        <h1 className="font-serif text-3xl lg:text-4xl text-navy mb-4">
                            {product.name}
                        </h1>
                        <p className="text-3xl text-gold font-semibold mb-6">
                            ${product.price.toLocaleString()} MXN
                        </p>

                        <p className="text-charcoal-light leading-relaxed mb-8">
                            {product.description ||
                                'Producto profesional de alta calidad diseñado para especialistas en belleza. Técnicas patentadas J. Denis con más de 25 años de experiencia.'}
                        </p>

                        {/* Features */}
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-sm">
                                <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">✓</span>
                                <span>Calidad profesional grado salón</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">✓</span>
                                <span>Fórmula hipoalergénica</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">✓</span>
                                <span>Hecho en México con ingredientes premium</span>
                            </div>
                        </div>

                        <div className="mt-auto space-y-4">
                            <button
                                onClick={handleAddToCart}
                                className="btn btn-primary w-full py-4 text-lg"
                            >
                                Agregar al Carrito
                            </button>
                            <a
                                href={`https://wa.me/525527271067?text=Hola! Estoy interesada en: ${product.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline w-full"
                            >
                                💬 Preguntar por WhatsApp
                            </a>
                        </div>

                        {/* Shipping Info */}
                        <div className="mt-8 p-4 bg-blush/50 rounded-xl">
                            <p className="text-sm text-charcoal-light">
                                📦 <strong>Envío FedEx:</strong> $200 MXN a todo México<br />
                                🕐 <strong>Entrega:</strong> 3-5 días hábiles
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section>
                        <h2 className="section-title mb-8">Completa tu Kit</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p, index) => (
                                <ProductCard key={p.id} product={p} index={index} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
