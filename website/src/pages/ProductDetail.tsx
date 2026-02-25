import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ReviewSection from '../components/ReviewSection';
import VariantSelector from '../components/VariantSelector';
import { useProducts, type DisplayProduct } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { useVariants } from '../hooks/useVariants';

// Local VariantGroup type (previously from data/products)
interface VariantGroup {
    parentId: string;
    parentName: string;
    attributeNames: string[];
    variants: { productId: string; attributes: Record<string, string> }[];
}

type DetailTab = 'benefits' | 'includes' | 'specs' | 'reviews';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const { addItem, openCart } = useCartStore();
    const { products, loading: productsLoading } = useProducts();
    const [activeTab, setActiveTab] = useState<DetailTab>('benefits');
    const [currentProductId, setCurrentProductId] = useState(id || '');
    const { groups: dbGroups } = useVariants();

    // Update currentProductId when URL param changes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (id) setCurrentProductId(id);
    }, [id]);

    // Get the currently displayed product from Supabase data
    const product: DisplayProduct | undefined = useMemo(() => {
        return products.find(p => p.id === currentProductId) ||
            products.find(p => p.id === id);
    }, [products, currentProductId, id]);

    // Try to find variant group from DB
    const dbGroup = product ? dbGroups.find(g => g.variants.some(v => v.product_id === product.id)) : undefined;

    const variantGroup: VariantGroup | undefined = dbGroup ? {
        parentId: dbGroup.id,
        parentName: dbGroup.name,
        attributeNames: dbGroup.attribute_names,
        variants: dbGroup.variants.map(v => ({
            productId: v.product_id,
            attributes: v.attributes
        }))
    } : undefined;

    // Related products: same category, different product
    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return products
            .filter(p => p.category === product?.category && p.id !== product?.id)
            .slice(0, 8);
    }, [products, product]);

    if (productsLoading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
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

    const handleVariantChange = (newProductId: string) => {
        setCurrentProductId(newProductId);
        // Update URL without navigation
        window.history.replaceState(null, '', `/producto/${newProductId}`);
    };

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
                                loading="lazy"
                                className="w-full h-full object-contain p-6"
                                style={{ maxHeight: '600px' }}
                            />
                        </div>
                        <span
                            className="absolute top-4 left-4 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-gold text-forest shadow-md"
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

                        {/* Variant Selector */}
                        {variantGroup && (
                            <VariantSelector
                                group={variantGroup}
                                currentProductId={product.id}
                                onVariantChange={handleVariantChange}
                            />
                        )}

                        <p className="text-2xl sm:text-3xl font-bold mb-4 text-forest">
                            ${product.price.toLocaleString()} <span className="text-base font-normal text-charcoal/40">MXN</span>
                        </p>

                        <p className="text-charcoal/70 leading-relaxed mb-6 text-sm sm:text-base">
                            {product.description ||
                                'Producto profesional de alta calidad diseñado para especialistas en belleza. Técnicas patentadas J. Denis con más de 25 años de experiencia.'}
                        </p>

                        {product.performance && (
                            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-forest/5 border border-forest/10">
                                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-charcoal/50 block">Rendimiento</span>
                                    <span className="font-semibold text-forest">{product.performance}</span>
                                </div>
                            </div>
                        )}

                        {/* Quick Features */}
                        <div className="space-y-2.5 mb-6">
                            {[
                                { text: 'Calidad profesional grado salón' },
                                { text: 'Fórmula hipoalergénica' },
                                { text: 'Hecho en México con ingredientes premium' },
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-gold/20 text-forest">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    </span>
                                    <span className="text-charcoal/80">{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-auto space-y-3">
                            <button
                                onClick={handleAddToCart}
                                className="w-full py-3.5 sm:py-4 text-sm sm:text-base font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gold text-forest hover:bg-gold-light"
                            >
                                Agregar al Carrito
                            </button>
                            <a
                                href={`https://wa.me/525527271067?text=Hola! Estoy interesada en: ${product.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 text-center text-sm font-medium rounded-xl border-2 transition-all hover:shadow-md"
                                style={{ borderColor: '#17204D40', color: '#17204D' }}
                            >
                                <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg> Preguntar por WhatsApp
                            </a>
                        </div>

                        {/* Shipping Info */}
                        <div className="mt-6 p-4 rounded-xl bg-forest/5 border border-forest/10">
                            <p className="text-sm text-charcoal/70">
                                <svg className="w-4 h-4 inline mr-1 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" /></svg> <strong className="text-forest">Envío FedEx:</strong> $200 MXN a todo México<br />
                                <svg className="w-4 h-4 inline mr-1 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <strong className="text-forest">Entrega:</strong> 3-5 días hábiles
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
                            style={{ borderBottom: '2px solid #E0E4ED' }}>
                            {hasBenefits && (
                                <TabButton
                                    label="Beneficios"
                                    icon="✓"
                                    isActive={activeTab === 'benefits'}
                                    onClick={() => setActiveTab('benefits')}
                                />
                            )}
                            {hasIncludes && (
                                <TabButton
                                    label="¿Qué incluye?"
                                    icon="◻"
                                    isActive={activeTab === 'includes'}
                                    onClick={() => setActiveTab('includes')}
                                />
                            )}
                            {hasSpecs && (
                                <TabButton
                                    label="Especificaciones"
                                    icon="≡"
                                    isActive={activeTab === 'specs'}
                                    onClick={() => setActiveTab('specs')}
                                />
                            )}
                            <TabButton
                                label="Reseñas"
                                icon="★"
                                isActive={activeTab === 'reviews'}
                                onClick={() => setActiveTab('reviews')}
                            />
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-b-2xl border border-t-0 p-6 sm:p-8 shadow-sm"
                            style={{ borderColor: '#E0E4ED' }}>

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
                                                style={{ background: '#17204D08' }}>
                                                <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold bg-gold text-forest">
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
                                                style={{ background: i % 2 === 0 ? '#F0F3FA08' : 'transparent' }}>
                                                <span className="text-sm text-gold">●</span>
                                                <span className="text-charcoal/80 text-sm">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {product.performance && (
                                        <div className="mt-5 p-4 rounded-xl flex items-center gap-3 bg-forest/5 border border-forest/10">
                                            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
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
                                                        background: i % 2 === 0 ? '#F0F3FA' : 'transparent',
                                                        borderBottom: '1px solid #E0E4ED20',
                                                    }}>
                                                    <span className="text-sm text-gold">◆</span>
                                                    <span className="text-charcoal/80 text-sm">{spec}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {product.performance && (
                                        <div className="p-4 rounded-xl flex items-center gap-3 bg-forest/5 border border-forest/10">
                                            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                                            <div>
                                                <span className="text-xs uppercase tracking-wider text-charcoal/50 block">Rendimiento</span>
                                                <span className="font-semibold text-forest">{product.performance}</span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Reviews */}
                            {activeTab === 'reviews' && (
                                <ReviewSection productId={product.id} productName={product.name} />
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
                        style={{ borderTop: '2px solid #E0E4ED' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="font-serif text-xl sm:text-2xl text-forest">Productos Relacionados</h2>
                                <p className="text-charcoal/50 text-sm mt-1">Completa tu kit profesional</p>
                            </div>
                            <Link
                                to="/tienda"
                                className="hidden sm:flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80 text-gold"
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
                                                variantCount={0}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Fade edges */}
                            <div className="absolute top-0 right-0 bottom-4 w-12 pointer-events-none"
                                style={{ background: 'linear-gradient(to left, #FFFFFF, transparent)' }} />
                        </div>

                        <Link
                            to="/tienda"
                            className="sm:hidden flex items-center justify-center gap-2 mt-4 py-3 text-sm font-medium rounded-xl border-2 transition-all"
                            style={{ borderColor: '#1C50EF40', color: '#1C50EF' }}
                        >
                            Ver todo el catálogo →
                        </Link>
                    </motion.section>
                )}
            </div>
        </div >
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
                color: isActive ? '#17204D' : '#17204D80',
                borderBottom: isActive ? '3px solid var(--color-gold, #D4AF37)' : '3px solid transparent',
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
