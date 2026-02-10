import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProductById, getRelatedProducts } from '../data/products';
import { useCartStore } from '../store/cartStore';

type DetailTab = 'benefits' | 'includes' | 'specs';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const { addItem, openCart } = useCartStore();
    const product = getProductById(id || '');
    const [activeTab, setActiveTab] = useState<DetailTab>('benefits');

    if (!product) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="font-serif text-2xl text-forest mb-4">Producto no encontrado</h2>
                    <Link to="/tienda" className="btn btn-primary rounded-pill px-8">
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

    const relatedProducts = getRelatedProducts(product, 8);

    const hasBenefits = product.benefits && product.benefits.length > 0;
    const hasIncludes = product.includes && product.includes.length > 0;
    const hasSpecs = (product.specifications && product.specifications.length > 0) || product.performance;
    const hasDetailContent = hasBenefits || hasIncludes || hasSpecs;

    return (
        <div className="min-h-screen bg-cream pt-24">
            <div className="container-luxury py-8 md:py-12">
                {/* Breadcrumb */}
                <nav className="text-sm mb-8" style={{ fontSize: '0.8rem' }}>
                    <Link to="/" className="text-charcoal/50 hover:text-gold transition-colors">Inicio</Link>
                    <span className="mx-2 text-charcoal/20">/</span>
                    <Link to="/tienda" className="text-charcoal/50 hover:text-gold transition-colors">Tienda</Link>
                    <span className="mx-2 text-charcoal/20">/</span>
                    <span className="text-forest font-medium">{product.name}</span>
                </nav>

                {/* Product Hero Section */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <div className="aspect-square overflow-hidden bg-white shadow-lg rounded-2xl border border-kraft/10">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain p-6"
                                style={{ maxHeight: '600px' }}
                            />
                        </div>
                        <span
                            className="absolute top-4 left-4 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full"
                            style={{
                                background: 'linear-gradient(135deg, #C9A96E, #B8943D)',
                                color: '#1B3B2D',
                            }}
                        >
                            {product.category}
                        </span>
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <span className="text-charcoal/40 text-xs uppercase tracking-[0.2em] mb-2">
                            {product.category}
                        </span>
                        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-forest mb-3 leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-2xl sm:text-3xl font-bold mb-4"
                            style={{ color: '#C9A96E' }}>
                            ${product.price.toLocaleString()} <span className="text-base font-normal text-charcoal/40">MXN</span>
                        </p>

                        <p className="text-charcoal/70 leading-relaxed mb-6 text-sm sm:text-base">
                            {product.description ||
                                'Producto profesional de alta calidad diseñado para especialistas en belleza. Técnicas patentadas J. Denis con más de 25 años de experiencia.'}
                        </p>

                        {/* Performance Badge */}
                        {product.performance && (
                            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl"
                                style={{ background: 'linear-gradient(135deg, #1B3B2D10, #C9A96E15)', border: '1px solid #C9A96E30' }}>
                                <span className="text-2xl">📊</span>
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-charcoal/50 block">Rendimiento</span>
                                    <span className="font-semibold text-forest">{product.performance}</span>
                                </div>
                            </div>
                        )}

                        {/* Quick Features */}
                        <div className="space-y-2.5 mb-6">
                            {[
                                { icon: '✓', text: 'Calidad profesional grado salón' },
                                { icon: '✓', text: 'Fórmula hipoalergénica' },
                                { icon: '✓', text: 'Hecho en México con ingredientes premium' },
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                        style={{ background: '#C9A96E20', color: '#1B3B2D' }}>
                                        {feature.icon}
                                    </span>
                                    <span className="text-charcoal/80">{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-auto space-y-3">
                            <button
                                onClick={handleAddToCart}
                                className="w-full py-3.5 sm:py-4 text-sm sm:text-base font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                                style={{
                                    background: 'linear-gradient(135deg, #C9A96E, #B8943D)',
                                    color: '#1B3B2D',
                                }}
                            >
                                Agregar al Carrito
                            </button>
                            <a
                                href={`https://wa.me/525527271067?text=Hola! Estoy interesada en: ${product.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 text-center text-sm font-medium rounded-xl border-2 transition-all hover:shadow-md"
                                style={{ borderColor: '#1B3B2D40', color: '#1B3B2D' }}
                            >
                                💬 Preguntar por WhatsApp
                            </a>
                        </div>

                        {/* Shipping Info */}
                        <div className="mt-6 p-4 rounded-xl" style={{ background: '#F5F0E8', border: '1px solid #C9A96E20' }}>
                            <p className="text-sm text-charcoal/70">
                                📦 <strong className="text-forest">Envío FedEx:</strong> $200 MXN a todo México<br />
                                🕐 <strong className="text-forest">Entrega:</strong> 3-5 días hábiles
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Detail Tabs Section */}
                {hasDetailContent && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12 lg:mb-16"
                    >
                        {/* Tab Headers */}
                        <div className="flex gap-1 mb-0 overflow-x-auto scrollbar-hide"
                            style={{ borderBottom: '2px solid #E8E0D4' }}>
                            {hasBenefits && (
                                <TabButton
                                    label="Beneficios"
                                    icon="✅"
                                    isActive={activeTab === 'benefits'}
                                    onClick={() => setActiveTab('benefits')}
                                />
                            )}
                            {hasIncludes && (
                                <TabButton
                                    label="¿Qué incluye?"
                                    icon="📦"
                                    isActive={activeTab === 'includes'}
                                    onClick={() => setActiveTab('includes')}
                                />
                            )}
                            {hasSpecs && (
                                <TabButton
                                    label="Especificaciones"
                                    icon="📋"
                                    isActive={activeTab === 'specs'}
                                    onClick={() => setActiveTab('specs')}
                                />
                            )}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-b-2xl border border-t-0 p-6 sm:p-8 shadow-sm"
                            style={{ borderColor: '#E8E0D4' }}>

                            {/* Benefits */}
                            {activeTab === 'benefits' && hasBenefits && (
                                <motion.div
                                    key="benefits"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="font-serif text-xl text-forest mb-5">Beneficios del producto</h3>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {product.benefits!.map((benefit, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                                                style={{ background: '#1B3B2D08' }}>
                                                <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                                                    style={{ background: '#C9A96E', color: '#1B3B2D' }}>
                                                    {i + 1}
                                                </span>
                                                <span className="text-charcoal/80 text-sm leading-relaxed">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Includes */}
                            {activeTab === 'includes' && hasIncludes && (
                                <motion.div
                                    key="includes"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="font-serif text-xl text-forest mb-5">¿Qué incluye?</h3>
                                    <div className="grid sm:grid-cols-2 gap-2">
                                        {product.includes!.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-lg"
                                                style={{ background: i % 2 === 0 ? '#F5F0E808' : 'transparent' }}>
                                                <span className="text-sm" style={{ color: '#C9A96E' }}>●</span>
                                                <span className="text-charcoal/80 text-sm">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {product.performance && (
                                        <div className="mt-5 p-4 rounded-xl flex items-center gap-3"
                                            style={{ background: 'linear-gradient(135deg, #1B3B2D08, #C9A96E10)', border: '1px solid #C9A96E20' }}>
                                            <span className="text-xl">⚡</span>
                                            <div>
                                                <span className="text-xs uppercase tracking-wider text-charcoal/50 block">Rendimiento total</span>
                                                <span className="font-semibold text-forest">{product.performance}</span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Specifications */}
                            {activeTab === 'specs' && hasSpecs && (
                                <motion.div
                                    key="specs"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="font-serif text-xl text-forest mb-5">Especificaciones técnicas</h3>
                                    {product.specifications && (
                                        <div className="space-y-2 mb-5">
                                            {product.specifications.map((spec, i) => (
                                                <div key={i} className="flex items-center gap-3 py-2.5 px-4 rounded-lg"
                                                    style={{
                                                        background: i % 2 === 0 ? '#F5F0E8' : 'transparent',
                                                        borderBottom: '1px solid #E8E0D420',
                                                    }}>
                                                    <span className="text-sm" style={{ color: '#C9A96E' }}>◆</span>
                                                    <span className="text-charcoal/80 text-sm">{spec}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {product.performance && (
                                        <div className="p-4 rounded-xl flex items-center gap-3"
                                            style={{ background: 'linear-gradient(135deg, #1B3B2D08, #C9A96E10)', border: '1px solid #C9A96E20' }}>
                                            <span className="text-xl">📊</span>
                                            <div>
                                                <span className="text-xs uppercase tracking-wider text-charcoal/50 block">Rendimiento</span>
                                                <span className="font-semibold text-forest">{product.performance}</span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.section>
                )}

                {/* Related Products Gallery */}
                {relatedProducts.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="pt-8 lg:pt-12"
                        style={{ borderTop: '2px solid #E8E0D4' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="font-serif text-xl sm:text-2xl text-forest">Productos Relacionados</h2>
                                <p className="text-charcoal/50 text-sm mt-1">Completa tu kit profesional</p>
                            </div>
                            <Link
                                to="/tienda"
                                className="hidden sm:flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                                style={{ color: '#C9A96E' }}
                            >
                                Ver todos →
                            </Link>
                        </div>

                        {/* Scrollable Gallery */}
                        <div className="relative">
                            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 pb-4">
                                <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                                    {relatedProducts.map((p, index) => (
                                        <div key={p.id} className="flex-shrink-0" style={{ width: '220px' }}>
                                            <ProductCard
                                                product={p}
                                                index={index}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Fade edges */}
                            <div className="absolute top-0 right-0 bottom-4 w-12 pointer-events-none"
                                style={{ background: 'linear-gradient(to left, #F5F0E8, transparent)' }} />
                        </div>

                        <Link
                            to="/tienda"
                            className="sm:hidden flex items-center justify-center gap-2 mt-4 py-3 text-sm font-medium rounded-xl border-2 transition-all"
                            style={{ borderColor: '#C9A96E40', color: '#C9A96E' }}
                        >
                            Ver todo el catálogo →
                        </Link>
                    </motion.section>
                )}
            </div>
        </div>
    );
}

// Tab Button Component
function TabButton({ label, icon, isActive, onClick }: {
    label: string;
    icon: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium transition-all whitespace-nowrap flex-shrink-0"
            style={{
                color: isActive ? '#1B3B2D' : '#1B3B2D80',
                borderBottom: isActive ? '3px solid #C9A96E' : '3px solid transparent',
                background: isActive ? '#FFFFFF' : 'transparent',
                marginBottom: '-2px',
                borderTopLeftRadius: '0.75rem',
                borderTopRightRadius: '0.75rem',
            }}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </button>
    );
}
