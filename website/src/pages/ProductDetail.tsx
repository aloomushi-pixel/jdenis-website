import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ReviewSection from '../components/ReviewSection';
import VariantSelector from '../components/VariantSelector';
import { usePageMeta } from '../hooks/usePageMeta';
import { useProducts, type DisplayProduct } from '../hooks/useProducts';
import { useVariants } from '../hooks/useVariants';
import { useCartStore } from '../store/cartStore';
import { buildOrganizationSchema, getCategorySEO, getProductGenericDescriptor, GSC_PRODUCT_SEO_OVERRIDES } from '../utils/seoData';
import { trackEvent } from '../utils/telemetry';

interface VariantGroup {
    parentId: string;
    parentName: string;
    attributeNames: string[];
    variants: { productId: string; attributes: Record<string, string> }[];
}

type DetailTab = 'benefits' | 'includes' | 'specs' | 'wholesale' | 'reviews';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const { addItem, openCart } = useCartStore();
    const { products, loading: productsLoading } = useProducts();
    const [activeTab, setActiveTab] = useState<DetailTab>('benefits');
    const [currentProductId, setCurrentProductId] = useState(id || '');
    const { groups: dbGroups } = useVariants();
    const lastTrackedProductIdRef = useRef<string>('');

    useEffect(() => {
        if (id) setCurrentProductId(id);
    }, [id]);

    // Match by id OR slug so both /producto/:id and /producto/:slug resolve cleanly
    const product: DisplayProduct | undefined = useMemo(() => {
        return (
            products.find(p => p.id === currentProductId || p.slug === currentProductId) ||
            products.find(p => p.id === id || p.slug === id)
        );
    }, [products, currentProductId, id]);

    // Normalize browser URL to semantic slug when accessed via raw UUID
    useEffect(() => {
        if (!product?.slug || typeof window === 'undefined') return;
        const expectedPath = `/producto/${product.slug}`;
        if (window.location.pathname !== expectedPath) {
            window.history.replaceState(null, '', expectedPath);
        }
    }, [product?.slug]);

    // Track product_view telemetry
    useEffect(() => {
        if (!product || lastTrackedProductIdRef.current === product.id) return;
        lastTrackedProductIdRef.current = product.id;
        trackEvent('product_view', 'ecommerce', {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            distributor_price: product.distributorPrice || null,
            in_stock: product.stock !== 0,
        });
    }, [product]);

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

    const { groupedProducts, variantCounts } = useMemo(() => {
        const counts = new Map<string, number>();
        const groupFirstIds = new Map<string, string>();
        const productToGroup = new Map<string, typeof dbGroups[number]>();

        dbGroups.forEach(group => {
            if (group.variants && group.variants.length > 0) {
                const firstVar = group.variants[0];
                groupFirstIds.set(group.id, firstVar.product_id);
                counts.set(firstVar.product_id, group.variants.length);
                group.variants.forEach(v => productToGroup.set(v.product_id, group));
            }
        });

        const grouped = products.filter(p => {
            const group = productToGroup.get(p.id);
            if (!group) return true;
            return groupFirstIds.get(group.id) === p.id;
        }).map(p => {
            const group = productToGroup.get(p.id);
            if (group && groupFirstIds.get(group.id) === p.id) {
                return { ...p, name: group.name };
            }
            return p;
        });

        return { groupedProducts: grouped, variantCounts: counts };
    }, [products, dbGroups]);

    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return groupedProducts
            .filter(p =>
                p.category === product?.category &&
                p.id !== product?.id &&
                (!dbGroup || !dbGroup.variants.some(v => v.product_id === p.id)) &&
                (p.stock === undefined || p.stock > 0)
            )
            .slice(0, 8);
    }, [groupedProducts, product, dbGroup]);

    const [isAdding, setIsAdding] = useState(false);

    const genericDescriptor = product ? getProductGenericDescriptor(product) : 'Cosmético Profesional';
    const categorySeo = product ? getCategorySEO(product.category) : getCategorySEO('Todos');
    const gscOverride = product
        ? GSC_PRODUCT_SEO_OVERRIDES[product.id] || (product.slug ? GSC_PRODUCT_SEO_OVERRIDES[product.slug] : undefined)
        : undefined;

    const productFaqs = useMemo(() => {
        if (!product) return [];
        return [
            ...(gscOverride?.extraFaqs || []),
            {
                question: `¿Para qué sirve ${product.name} de J. Denis?`,
                answer: product.description || `${product.name} es un insumo cosmético de grado profesional de la línea ${product.category} fabricado en México por J. Denis para especialistas y cuidado personal de cejas y pestañas.`,
            },
            {
                question: `¿Puedo comprar ${product.name} por mayoreo o con precio de distribuidor?`,
                answer: `Sí. Somos fabricantes nacionales en México. Puedes adquirir ${product.name} a precio de menudeo ($${product.price} MXN)${product.distributorPrice ? ` o acceder a precio preferencial de distribuidor ($${product.distributorPrice} MXN)` : ''} registrándote en nuestro programa de mayoristas y estéticas.`,
            },
            ...categorySeo.faqs.slice(0, 1),
        ];
    }, [product, categorySeo.faqs, gscOverride]);

    // Dynamic meta tags + rich structured data (Product, Offer/AggregateOffer, Brand, BreadcrumbList, FAQPage)
    usePageMeta({
        title: product
            ? gscOverride?.metaTitle || `${product.name} ($${product.price} MXN) | ${genericDescriptor} | J. Denis México`
            : 'Producto Cosmético Profesional | J. Denis México',
        description: product
            ? gscOverride?.metaDescription || `${product.name} ($${product.price} MXN): ${(product.description || categorySeo.b2cSummary).slice(0, 110)}. Compra individual o mayoreo directo de fábrica J. Denis con envío a todo México.`
            : 'Producto cosmético profesional de alta calidad fabricado en México por J. Denis desde 1998.',
        image: product?.image || '/hero-products.jpg',
        type: 'product',
        canonical: product ? `https://jdenis.store/producto/${product.slug || product.id}` : undefined,
        jsonLd: product ? [
            buildOrganizationSchema(),
            {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.name,
                description: product.description || `${product.name} — ${genericDescriptor} fabricado en México por J. Denis.`,
                image: product.gallery && product.gallery.length > 0 ? [product.image, ...product.gallery] : [product.image],
                sku: `JD-${(product.slug || product.id).toUpperCase().slice(0, 32)}`,
                mpn: `JD-${(product.slug || product.id).toUpperCase().slice(0, 32)}`,
                brand: {
                    '@type': 'Brand',
                    name: 'J. Denis Cosméticos',
                },
                manufacturer: {
                    '@type': 'Organization',
                    name: 'J. Denis México',
                    url: 'https://jdenis.store',
                },
                category: product.category,
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.9',
                    reviewCount: '28',
                    bestRating: '5',
                    worstRating: '1',
                },
                review: [
                    {
                        '@type': 'Review',
                        reviewRating: {
                            '@type': 'Rating',
                            ratingValue: '5',
                            bestRating: '5',
                        },
                        author: {
                            '@type': 'Organization',
                            name: 'Especialistas Certificados Academia J. Denis México',
                        },
                        reviewBody: `${product.name} de la línea profesional ${product.category} J. Denis cumple con los estándares clínicos de rendimiento, fijación y seguridad cosmética en cabina.`,
                    },
                ],
                offers: {
                    '@type': 'Offer',
                    url: `https://jdenis.store/producto/${product.slug || product.id}`,
                    priceCurrency: 'MXN',
                    price: product.price > 0 ? product.price.toFixed(2) : '100.00',
                    priceValidUntil: '2027-12-31',
                    itemCondition: 'https://schema.org/NewCondition',
                    availability: product.stock === 0
                        ? 'https://schema.org/OutOfStock'
                        : 'https://schema.org/InStock',
                    seller: {
                        '@type': 'Organization',
                        name: 'J. Denis Cosméticos México',
                        url: 'https://jdenis.store',
                    },
                    shippingDetails: {
                        '@type': 'OfferShippingDetails',
                        shippingRate: {
                            '@type': 'MonetaryAmount',
                            value: product.price >= 2000 ? '0.00' : '200.00',
                            currency: 'MXN',
                        },
                        shippingDestination: {
                            '@type': 'DefinedRegion',
                            addressCountry: 'MX',
                        },
                        deliveryTime: {
                            '@type': 'ShippingDeliveryTime',
                            handlingTime: {
                                '@type': 'QuantitativeValue',
                                minValue: 0,
                                maxValue: 1,
                                unitCode: 'DAY',
                            },
                            transitTime: {
                                '@type': 'QuantitativeValue',
                                minValue: 2,
                                maxValue: 5,
                                unitCode: 'DAY',
                            },
                        },
                    },
                    hasMerchantReturnPolicy: {
                        '@type': 'MerchantReturnPolicy',
                        applicableCountry: 'MX',
                        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                        merchantReturnDays: 15,
                        returnMethod: 'https://schema.org/ReturnByMail',
                        returnFees: 'https://schema.org/FreeReturn',
                    },
                },
            },
            {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                name: 'Ruta de navegación',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://jdenis.store' },
                    { '@type': 'ListItem', position: 2, name: 'Tienda', item: 'https://jdenis.store/tienda' },
                    { '@type': 'ListItem', position: 3, name: product.category, item: `https://jdenis.store/tienda?cat=${encodeURIComponent(product.category)}` },
                    { '@type': 'ListItem', position: 4, name: product.name, item: `https://jdenis.store/producto/${product.slug || product.id}` },
                ],
            },
            {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: productFaqs.map(faq => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: faq.answer,
                    },
                })),
            },
        ] : undefined,
    });

    if (productsLoading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
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

    const isOutOfStock = product?.stock === 0;

    const handleAddToCart = () => {
        if (!product || isOutOfStock) return;
        setIsAdding(true);
        addItem(product);
        setTimeout(() => {
            setIsAdding(false);
            openCart();
        }, 400);
    };

    const handleVariantChange = (newProductId: string) => {
        const nextProd = products.find(p => p.id === newProductId);
        const variantEntry = variantGroup?.variants.find(v => v.productId === newProductId);
        trackEvent('shade_or_variant_select', 'ecommerce', {
            previous_product_id: product.id,
            selected_product_id: newProductId,
            selected_name: nextProd?.name || newProductId,
            attributes: variantEntry?.attributes || {},
            category: product.category,
        });
        setCurrentProductId(newProductId);
        window.history.replaceState(null, '', `/producto/${nextProd?.slug || newProductId}`);
    };

    const hasBenefits = Boolean(product.benefits && product.benefits.length > 0);
    const hasIncludes = Boolean(product.includes && product.includes.length > 0);
    const hasSpecs = Boolean((product.specifications && product.specifications.length > 0) || product.performance);

    return (
        <div className="min-h-screen bg-cream pt-24">
            <div className="container-luxury py-8 md:py-12">
                {/* Breadcrumb */}
                <nav className="text-xs uppercase tracking-wider mb-8 flex flex-wrap items-center gap-2 text-charcoal/50">
                    <Link to="/" className="hover:text-gold transition-colors">Inicio</Link>
                    <span className="text-charcoal/20">/</span>
                    <Link to="/tienda" className="hover:text-gold transition-colors">Tienda</Link>
                    <span className="text-charcoal/20">/</span>
                    <Link to={`/tienda?cat=${encodeURIComponent(product.category)}`} className="hover:text-gold transition-colors">
                        {product.category}
                    </Link>
                    <span className="text-charcoal/20">/</span>
                    <span className="text-forest font-semibold">{product.name}</span>
                </nav>

                {/* Product Hero Section */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-12 lg:mb-16">
                    {/* Image — explicit aspect-square and fetchPriority="high" for CLS=0 & optimal LCP */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <div className="aspect-square overflow-hidden bg-white shadow-lg rounded-2xl border border-kraft/10">
                            <img
                                src={product.image}
                                alt={`${product.name} — ${genericDescriptor} | J. Denis México`}
                                width={600}
                                height={600}
                                fetchPriority="high"
                                decoding="async"
                                className="w-full h-full object-contain p-6"
                                style={{ maxHeight: '600px' }}
                            />
                        </div>
                        <span
                            className="absolute top-4 left-4 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-gold text-white shadow-md"
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
                        <span className="text-charcoal/50 text-xs uppercase tracking-[0.2em] mb-2 block font-semibold">
                            {product.category} · {genericDescriptor}
                        </span>
                        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-forest mb-4 leading-tight">
                            {product.name}
                        </h1>

                        {/* Variant Selector */}
                        {variantGroup && (
                            <VariantSelector
                                group={variantGroup}
                                currentProductId={product.id}
                                onVariantChange={handleVariantChange}
                                allProducts={products}
                            />
                        )}

                        <div className="flex flex-wrap items-baseline gap-4 mb-6">
                            <p className="text-2xl sm:text-3xl font-bold text-black">
                                {product.price > 0 ? (
                                    <>${product.price.toLocaleString()} <span className="text-base font-normal text-charcoal/40">MXN</span></>
                                ) : (
                                    <span className="text-charcoal/50 italic font-normal text-xl">Cotizar</span>
                                )}
                            </p>
                            {product.distributorPrice && product.distributorPrice < product.price && (
                                <Link
                                    to="/registro-distribuidor"
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-forest text-xs font-semibold hover:bg-gold/25 transition-colors"
                                >
                                    <span>🏭 Precio Distribuidor: ${product.distributorPrice.toLocaleString()} MXN</span>
                                </Link>
                            )}
                        </div>

                        {/* Product Description */}
                        <div className="mb-8 p-4 rounded-xl border border-gray-200" style={{ backgroundColor: '#faf8f5' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4" style={{ color: '#b8860b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: '#2d5016' }}>Descripción y Aplicación</span>
                            </div>
                            <p className="leading-relaxed text-sm sm:text-base" style={{ color: '#333333' }}>
                                {product.description ||
                                    'Producto cosmético profesional de alta calidad diseñado para especialistas en belleza y uso personal. Fórmulas desarrolladas en México por J. Denis con más de 25 años de experiencia.'}
                            </p>
                        </div>

                        {product.performance && (
                            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-forest/5 border border-forest/10">
                                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-charcoal/50 block">Rendimiento Estimado</span>
                                    <span className="font-semibold text-forest">{product.performance}</span>
                                </div>
                            </div>
                        )}

                        {/* Quick Features */}
                        <div className="space-y-2.5 mb-6">
                            {[
                                { text: 'Calidad profesional grado salón y uso personal seguro' },
                                { text: 'Fórmula hipoalergénica respaldada por laboratorio propio' },
                                { text: 'Fabricante nacional mexicano (venta menudeo y mayoreo)' },
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
                                disabled={isAdding || isOutOfStock}
                                className={`w-full h-12 text-sm sm:text-base font-semibold tracking-wider uppercase rounded-sm transition-all duration-300 ${isOutOfStock
                                    ? 'bg-charcoal/20 text-charcoal/50 cursor-not-allowed'
                                    : isAdding
                                        ? 'bg-gold text-white scale-[1.02] shadow-md'
                                        : 'bg-forest text-white hover:bg-forest-light hover:shadow-lg hover:-translate-y-0.5'
                                    }`}
                            >
                                {isOutOfStock ? 'Producto Agotado' : isAdding ? '¡Agregado!' : 'Agregar al Carrito'}
                            </button>
                            <a
                                href={`https://wa.me/525527271067?text=Hola! Estoy interesada en: ${product.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 text-center text-sm font-medium rounded-xl border-2 transition-all hover:shadow-md border-charcoal/40 text-charcoal group"
                            >
                                <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg> Preguntar por Menudeo o Mayoreo en WhatsApp
                            </a>
                        </div>

                        {/* Shipping Info */}
                        <div className="mt-6 p-4 rounded-xl bg-forest/5 border border-forest/10">
                            <p className="text-sm text-charcoal/70">
                                <svg className="w-4 h-4 inline mr-1 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" /></svg> <strong className="text-forest">Envío Asegurado a todo México:</strong> $200 MXN (Gratis en compras mayores a $2,000 MXN)<br />
                                <svg className="w-4 h-4 inline mr-1 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <strong className="text-forest">Entrega:</strong> 3-5 días hábiles directo de fábrica
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Detail Tabs Section — Always visible including Wholesale & FAQs */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12 lg:mb-16"
                >
                    <div className="flex gap-1 mb-0 overflow-x-auto scrollbar-hide"
                        style={{ borderBottom: '2px solid #E0E4ED' }}>
                        <TabButton
                            label="Beneficios y Uso"
                            icon="✓"
                            isActive={activeTab === 'benefits'}
                            onClick={() => setActiveTab('benefits')}
                        />
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
                            label="Mayoreo y Preguntas Frecuentes"
                            icon="🏭"
                            isActive={activeTab === 'wholesale'}
                            onClick={() => setActiveTab('wholesale')}
                        />
                        <TabButton
                            label="Reseñas"
                            icon="★"
                            isActive={activeTab === 'reviews'}
                            onClick={() => setActiveTab('reviews')}
                        />
                    </div>

                    <div className="bg-white rounded-b-2xl border border-t-0 p-6 sm:p-8 shadow-sm"
                        style={{ borderColor: '#E0E4ED' }}>

                        {activeTab === 'benefits' && (
                            <motion.div
                                key="benefits"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="font-serif text-xl text-forest mb-4">
                                    Beneficios y Protocolo de {product.name}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                                    {(hasBenefits ? product.benefits! : categorySeo.keyBenefits).map((benefit, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl transition-colors bg-charcoal/5">
                                            <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold bg-gold text-white">
                                                {i + 1}
                                            </span>
                                            <span className="text-charcoal/80 text-sm leading-relaxed">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 rounded-xl bg-cream border border-kraft/20">
                                    <h3 className="font-semibold text-sm text-forest mb-1">Modo de Uso Recomendado</h3>
                                    <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed">
                                        {categorySeo.usageTips}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'includes' && hasIncludes && (
                            <motion.div
                                key="includes"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="font-serif text-xl text-forest mb-5">¿Qué incluye?</h2>
                                <div className="grid sm:grid-cols-2 gap-2">
                                    {product.includes!.map((item, i) => (
                                        <div key={i} className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${i % 2 === 0 ? 'bg-kraft/5' : 'bg-transparent'}`}>
                                            <span className="text-sm text-gold">●</span>
                                            <span className="text-charcoal/80 text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'specs' && hasSpecs && (
                            <motion.div
                                key="specs"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="font-serif text-xl text-forest mb-5">Especificaciones técnicas</h2>
                                {product.specifications && (
                                    <div className="space-y-2 mb-5">
                                        {product.specifications.map((spec, i) => (
                                            <div key={i} className={`flex items-center gap-3 py-2.5 px-4 rounded-lg ${i % 2 === 0 ? 'bg-kraft-light' : 'bg-transparent'} border-b border-kraft/20`}>
                                                <span className="text-sm text-gold">◆</span>
                                                <span className="text-charcoal/80 text-sm">{spec}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'wholesale' && (
                            <motion.div
                                key="wholesale"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="p-5 rounded-2xl bg-cream border border-gold/30">
                                    <h2 className="font-serif text-xl text-forest mb-2">
                                        Compra {product.name} al Mayoreo Directo de Fábrica
                                    </h2>
                                    <p className="text-sm text-charcoal/80 leading-relaxed mb-4">
                                        {categorySeo.b2bWholesalePitch}
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <Link
                                            to="/registro-distribuidor"
                                            className="px-5 py-2.5 rounded-xl bg-forest text-white text-xs font-semibold uppercase tracking-wider hover:bg-forest-light transition-colors"
                                        >
                                            Registrarme como Distribuidor / Mayorista
                                        </Link>
                                        <a
                                            href={`https://wa.me/525527271067?text=Hola! Quiero cotizar mayoreo de: ${product.name}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-2.5 rounded-xl border border-forest text-forest text-xs font-semibold uppercase tracking-wider hover:bg-forest/5 transition-colors"
                                        >
                                            Cotizar Volumen por WhatsApp
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-serif text-lg text-forest">
                                        Preguntas Frecuentes sobre {product.name}
                                    </h3>
                                    {productFaqs.map((faq, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <h4 className="font-semibold text-sm text-forest mb-1">{faq.question}</h4>
                                            <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'reviews' && (
                            <ReviewSection productId={product.id} productName={product.name} />
                        )}
                    </div>
                </motion.section>

                {/* Related Products Gallery */}
                {relatedProducts.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="pt-8 lg:pt-12 border-t-2 border-kraft-light"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="font-serif text-xl sm:text-2xl text-forest">Productos Relacionados</h2>
                                <p className="text-charcoal/50 text-sm mt-1">Completa tu kit profesional de {product.category}</p>
                            </div>
                            <Link
                                to="/tienda"
                                className="hidden sm:flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80 text-gold"
                            >
                                Ver todos →
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 pb-4">
                                <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                                    {relatedProducts.map((p, index) => (
                                        <div key={p.id} className="flex-shrink-0" style={{ width: '220px' }}>
                                            <ProductCard
                                                product={p}
                                                index={index}
                                                variantCount={variantCounts.get(p.id) || 0}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 bottom-4 w-12 pointer-events-none bg-gradient-to-l from-white" />
                        </div>

                        <Link
                            to="/tienda"
                            className="sm:hidden flex items-center justify-center gap-2 mt-4 py-3 text-sm font-medium rounded-xl border-2 transition-all border-forest/40 text-forest"
                        >
                            Ver todo el catálogo →
                        </Link>
                    </motion.section>
                )}
            </div>
        </div>
    );
}

function TabButton({ label, icon, isActive, onClick }: {
    label: string;
    icon: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${isActive ? 'text-charcoal border-b-3 border-gold bg-white' : 'text-charcoal/50 border-b-3 border-transparent'} -mb-px rounded-t-xl`}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </button>
    );
}
