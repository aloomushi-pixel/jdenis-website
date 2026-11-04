import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zdciwzeokkrwcxvsgusc.supabase.co';
const supabaseKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2l3emVva2tyd2N4dnNndXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTM3NTksImV4cCI6MjA4ODIyOTc1OX0.qbXG0M2Zsjz-rOXY0CgAV2RfLledS67nqBw_dnvzkbg';

const supabase = createClient(supabaseUrl, supabaseKey);
const BASE_URL = 'https://jdenis.store';
const DIST_DIR = path.resolve(__dirname, '../dist');

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function getGenericDescriptor(name = '', category = '') {
    const n = name.toLowerCase();
    const c = category.toLowerCase();
    if (c.includes('henna') || n.includes('henna')) return 'Rubor, Sombra y Henna para Cejas de Larga Duración';
    if (c.includes('pigmento') || n.includes('pigmento') || n.includes('tinte')) return 'Pigmento y Tinte Profesional para Cejas y Pestañas';
    if (c.includes('diseño') || n.includes('planchado') || n.includes('laminado') || n.includes('fijador')) return 'Gel Fijador, Laminado y Planchado de Cejas Profesional';
    if (c.includes('lifting') || n.includes('lifting') || n.includes('rizado') || n.includes('ondulante')) return 'Lash Lifting y Rizado de Pestañas Profesional';
    if (c.includes('adhesivo') || n.includes('adhesivo') || n.includes('pegamento')) return 'Adhesivo y Pegamento Cosmético Profesional';
    if (c.includes('tratamiento') || n.includes('botox') || n.includes('rímel') || n.includes('rimel')) return 'Tratamiento, Botox y Cuidado de Cejas y Pestañas';
    return `${category || 'Cosmético'} Profesional y Mayoreo`;
}

const PRODUCT_OVERRIDES = {
    'laminado-cejas': {
        title: 'Kit Laminado de Cejas J. Denis con Cisteamina (30 Aplicaciones) | Tienda Oficial',
        description: 'Kit profesional de Laminado y Planchado de Cejas J. Denis con Cisteamina. Rinde hasta 30 servicios, alinea el vello rebelde y nutre sin maltratar. Compra individual o mayoreo directo de fábrica en México.',
    },
    'jade-rizado-pestanas': {
        title: 'Gel Ondulante y Kit Jade para Rizado de Pestañas Profesional | J. Denis México',
        description: 'Kit Jade y Gel Ondulante para Rizado Permanente de Pestañas J. Denis. Curvatura definida, segura y de larga duración (6 a 8 semanas). Venta al menudeo y mayoreo directo de fábrica.',
    },
    'chocolate-pigmento-cejas': {
        title: 'Pigmento para Cejas Chocolate / Castaño Medio de Larga Duración | J. Denis',
        description: 'Pigmento profesional para cejas tono Chocolate (Castaño Medio) J. Denis. Efecto sombra/rubor natural en piel y vello sin virar a rojo. Venta individual y mayoreo en México.',
    },
    'tintura-topica-castano-medio': {
        title: 'Tintura Tópica Castaño Medio para Cejas (Efecto Sombra y Henna) | J. Denis',
        description: 'Tintura tópica para cejas tono Castaño Medio J. Denis. Coloración uniforme en piel y vello con acabado maquillaje empolvado de larga duración. Directo de fábrica en México.',
    },
    'activador-henna': {
        title: 'Activador de Henna Orgánico para Cejas (Potenciador de Color) | J. Denis México',
        description: 'Activador de Henna orgánico para cejas J. Denis. Potencia la fijación, intensidad y duración del pigmento y Brow Henna en piel y vello. Compra directo de fabricante en México.',
    },
    'botox-pestanas': {
        title: 'Botox para Pestañas y Cejas con Queratina, Biotina y Pantenol | J. Denis',
        description: 'Tratamiento Botox para pestañas y cejas J. Denis. Hidrata, engrosa y repara la fibra capilar después del Lash Lifting o Laminado de Cejas. Venta individual y mayoreo en México.',
    },
    'dark-red-pigmento-cejas': {
        title: 'Pigmento para Cejas Dark Red (Pelirrojo / Caoba) Profesional | J. Denis México',
        description: 'Pigmento profesional para cejas tono Dark Red (Pelirrojo / Caoba) J. Denis. Coloración de alta retención en piel y vello o para neutralizar subtonos fríos. Directo de fábrica en México.',
    },
    'gel-ondulante-blue': {
        title: 'Gel Ondulante Blue para Rizado Permanente de Pestañas | J. Denis México',
        description: 'Gel Ondulante Blue profesional J. Denis para rizado de pestañas. Fórmula de acción controlada y alta eficacia para salón y lashistas. Venta menudeo y mayoreo directo de fábrica.',
    },
    'light-brown-pigmento-cejas': {
        title: 'Pigmento para Cejas Light Brown (Castaño Claro / Rubio Oscuro) | J. Denis',
        description: 'Pigmento profesional para cejas Light Brown (Castaño Claro) J. Denis. Efecto sombreado natural ideal para fototipos claros y rubios sin oscurecer en exceso.',
    },
    'adhesivo-transparente-grupo': {
        title: 'Adhesivo Transparente para Pestañas de Grupo y Punto | J. Denis México',
        description: 'Adhesivo transparente hipoalergénico para pestañas en grupo o por punto J. Denis. Fijación segura, acabado invisible y secado rápido. Compra menudeo y mayoreo.',
    },
    'microbrush-10': {
        title: 'Microbrush Aplicadores de Precisión para Pestañas y Cejas (10 pzas) | J. Denis',
        description: 'Paquete de 10 aplicadores Microbrush de precisión sin pelusa J. Denis para Lash Lifting, extensión de pestañas, laminado y retiro de adhesivo. Insumos profesionales en México.',
    },
    'godete-cristal': {
        title: 'Godete de Cristal Profesional para Henna, Pigmentos y Tintes de Cejas | J. Denis',
        description: 'Godete de Cristal macizo profesional J. Denis ($295 MXN) para mezclar Brow Henna, pigmentos de cejas, tintes y monómero sin absorber ni alterar la fórmula. Envío a todo México.',
    },
    'curva-lc-015-combo': {
        title: 'Extensiones de Pestañas Curva LC 0.15 Mixta (Efecto Foxy Eye y Lifting) | J. Denis',
        description: 'Blíster de Extensiones de Pestañas Curva LC grosor 0.15 Mixta J. Denis ($280 MXN). Base recta de alta retención y elevación tipo delineado ideal para párpado encapotado.',
    },
    'curva-lc-010-combo': {
        title: 'Extensiones de Pestañas Curva LC 0.10 Mixta Profesional | J. Denis México',
        description: 'Blíster de Extensiones de Pestañas Curva LC grosor 0.10 Mixta J. Denis ($280 MXN). Ligereza superior y máxima superficie de contacto con el adhesivo para diseños Foxy Eye.',
    },
    'adhesivo-pads-lifting': {
        title: 'Adhesivo J. Denis para Pads de Lash Lifting y Rizado de Pestañas | Tienda Oficial',
        description: 'Adhesivo profesional hidrosoluble J. Denis para fijar pads de silicón y alinear pestañas en Lash Lifting y Rizado. Secado controlado y fácil retiro con agua.',
    },
    'adhesivo-rulos-blue': {
        title: 'Adhesivo J. Denis Blue para Rulos y Pads de Rizado de Pestañas ($60 MXN)',
        description: 'Adhesivo para Rulos y Pads línea Blue J. Denis ($60 MXN). Fijación firme y rápida para rizado permanente de pestañas y lash lifting profesional.',
    },
};

const STATIC_ROUTES = [
    {
        route: 'cejas',
        title: 'J. Denis Cejas: Planchado, Laminado, Brow Henna y Pigmentos | Tienda Oficial México',
        h1: 'Productos Profesionales para Cejas J. Denis: Planchado, Laminado, Henna y Pigmentos',
        description: 'Catálogo oficial J. Denis Cejas en México: Kits de Planchado y Laminado de Cejas con Cisteamina, Brow Henna, Pigmentos, Gel Fijador y Herramientas. Compra individual o mayoreo directo de fábrica.',
    },
    {
        route: 'pestanas',
        title: 'J. Denis Pestañas: Lash Lifting, Rizado, Extensiones y Adhesivos | Tienda Oficial',
        h1: 'Productos para Pestañas J. Denis: Lash Lifting, Rizado Permanente, Extensiones y Adhesivos',
        description: 'Insumos profesionales J. Denis para pestañas en México: Kits de Lash Lifting con Cisteamina, Rizado Permanente Jade, Extensiones por blíster, Adhesivos hipoalergénicos y Botox. Menudeo y mayoreo.',
    },
    {
        route: 'laminado-de-cejas',
        title: 'Laminado de Cejas J. Denis con Cisteamina y Kits de Planchado | Tienda Oficial',
        h1: 'Laminado de Cejas y Planchado Profesional J. Denis con Cisteamina',
        description: 'Compra el Kit de Laminado de Cejas y Planchado Profesional J. Denis con Cisteamina (hasta 30 aplicaciones). Alinea cejas rebeldes sin maltratar. Envío a todo México menudeo y mayoreo.',
    },
    {
        route: 'lash-lifting',
        title: 'Kit Lash Lifting J. Denis con Cisteamina, Pads y Adhesivos | Tienda Oficial México',
        h1: 'Lash Lifting J. Denis con Cisteamina: Kits, Monodosis, Pads y Adhesivos',
        description: 'Catálogo oficial de Lash Lifting J. Denis en México: Kits Evolución con Cisteamina, sobres monodosis, pads de silicón anatómicos, adhesivo hidrosoluble y Botox. Venta individual y mayoreo.',
    },
    {
        route: 'henna-y-pigmentos',
        title: 'Brow Henna, Rubor y Pigmentos para Cejas J. Denis (Todos los Tonos) | México',
        h1: 'Brow Henna, Rubor para Cejas y Pigmentos Profesionales J. Denis',
        description: 'Compra Brow Henna, Rubor/Sombra para Cejas, Tintura Tópica, Activador Orgánico y Pigmentos J. Denis en México. Tonos Chocolate, Castaño Claro, Medio, Oscuro y Negro. Menudeo y mayoreo.',
    },
    {
        route: 'tienda',
        title: 'Tienda Oficial y Catálogo de Cosméticos para Cejas y Pestañas | J. Denis México',
        h1: 'Catálogo Oficial de Cosméticos para Cejas y Pestañas — Venta Menudeo y Mayoreo',
        description: 'Compra en línea más de 240 productos cosméticos J. Denis: rubor y henna para cejas, gel fijador y laminado de cejas, pigmentos, lash lifting con cisteamina, extensiones y adhesivos. Envíos a todo México.',
    },
    {
        route: 'nosotros',
        title: 'J. Denis Lindavista CDMX | Historia, Laboratorio y Tienda Oficial en México',
        h1: 'J. Denis México — Creadores del Planchado de Cejas y Rizado de Pestañas desde 1998',
        description: 'Conoce la historia de J. Denis y a la Mtra. Gabriela Elizalde. Visita nuestra sede y academia en Av. Montevideo 136, Col. Lindavista, CDMX. Fabricante mexicano de productos para cejas y pestañas desde 1998.',
    },
    {
        route: 'academia',
        title: 'Academia J. Denis Lindavista CDMX | Cursos de Cejas, Pestañas y Lash Lifting DC-3 STPS',
        h1: 'Academia J. Denis — Cursos Certificados STPS DC-3 de Cejas, Pestañas y Lash Lifting',
        description: 'Capacítate en la Academia Oficial J. Denis con validez oficial STPS (Constancia DC-3): cursos de laminado y planchado de cejas, lash lifting con cisteamina, diseño con henna y extensiones de pestañas.',
    },
    {
        route: 'registro-distribuidor',
        title: 'Distribuidores y Venta al Mayoreo de Cosméticos | J. Denis Fábrica México',
        h1: 'Programa Oficial de Distribuidores y Mayoristas J. Denis en México',
        description: 'Compra cosméticos para cejas y pestañas al mayoreo directo de fábrica en México. Precios preferenciales de distribuidor para estéticas, academias y comercializadoras de belleza.',
    },
    {
        route: 'blog',
        title: 'Blog Técnico de Cejas, Pestañas, Laminado y Lash Lifting | J. Denis México',
        h1: 'Blog Técnico de Cosmética Profesional J. Denis',
        description: 'Guías paso a paso, protocolos químicos de cisteamina, tiempos de pose de gel ondulante, colorimetría de Brow Henna y consejos de negocio para especialistas en cejas y pestañas.',
    },
    {
        route: 'politica-de-devoluciones',
        title: 'Política de Cambios y Devoluciones | J. Denis México',
        h1: 'Política de Cambios y Devoluciones — J. Denis',
        description: 'Lineamientos generales de atención, revisión de pedidos, cambios y devoluciones para compras realizadas en los canales oficiales de J. Denis México.',
    },
    {
        route: 'devoluciones',
        title: 'Política de Cambios y Devoluciones | J. Denis México',
        h1: 'Política de Cambios y Devoluciones — J. Denis',
        description: 'Lineamientos generales de atención, revisión de pedidos, cambios y devoluciones para compras realizadas en los canales oficiales de J. Denis México.',
    },
    {
        route: 'aviso-de-privacidad',
        title: 'Aviso de Privacidad | J. Denis México',
        h1: 'Aviso de Privacidad — J. Denis',
        description: 'Aviso de privacidad oficial de J.J. Denis S.A. de C.V. para el tratamiento y protección de datos personales de clientes y distribuidores.',
    },
];

function buildRouteHtml(baseHtml, { title, description, canonical, ogType = 'website', image = `${BASE_URL}/hero-products.jpg`, jsonLd = [], noscriptHtml = '' }) {
    const safeTitle = escapeHtml(title);
    const safeDesc = escapeHtml(description);
    const safeCanon = escapeHtml(canonical);
    const safeImg = escapeHtml(image.startsWith('http') ? image : `${BASE_URL}${image}`);

    let html = baseHtml;

    // Replace <title>
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);

    // Replace meta description
    html = html.replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="description" content="${safeDesc}" />`
    );

    // Replace Open Graph tags
    html = html.replace(/<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="${ogType}" />`);
    html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${safeTitle}" />`);
    html = html.replace(
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:description" content="${safeDesc}" />`
    );
    html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${safeCanon}" />`);
    html = html.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${safeImg}" />`);

    // Replace Twitter tags
    html = html.replace(/<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="twitter:title" content="${safeTitle}" />`);
    html = html.replace(
        /<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="twitter:description" content="${safeDesc}" />`
    );

    // Inject canonical link & dynamic JSON-LD before </head>
    const jsonLdScripts = jsonLd
        .map((schema) => `  <script type="application/ld+json" data-dynamic-jsonld="true">${JSON.stringify(schema)}</script>`)
        .join('\n');

    const headInjection = [
        `  <link rel="canonical" href="${safeCanon}" />`,
        jsonLdScripts,
    ]
        .filter(Boolean)
        .join('\n');

    html = html.replace('</head>', `${headInjection}\n</head>`);

    if (noscriptHtml) {
        html = html.replace('<div id="root"></div>', `<div id="root"></div>\n  <noscript data-seo-prerender="true">${noscriptHtml}</noscript>`);
    }

    return html;
}

function writeRouteFile(relativeRoute, htmlContent) {
    const cleanRoute = relativeRoute.replace(/^\/+|\/+$/g, '');
    if (!cleanRoute) return;
    // Prevent path traversal or invalid filesystem characters on Windows/Linux
    if (cleanRoute.includes('..') || /[:*?"<>|]/.test(cleanRoute)) return;
    const targetDir = path.join(DIST_DIR, cleanRoute);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf8');
}

export async function prerenderSeoRoutes() {
    const indexHtmlPath = path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(indexHtmlPath)) {
        console.warn('[Prerender] dist/index.html not found, skipping prerender.');
        return;
    }

    const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    // Guard against running twice on the same dist/
    if (baseHtml.includes('data-prerendered-root="true"')) {
        console.log('[Prerender] dist/ already prerendered, skipping duplicate run.');
        return;
    }
    let generatedCount = 0;

    // Also ensure root dist/index.html has canonical link to https://jdenis.store and root marker
    const rootCanonicalTag = baseHtml.includes('rel="canonical"') ? '' : `  <link rel="canonical" href="${BASE_URL}" />\n`;
    const rootHtml = baseHtml.replace('</head>', `${rootCanonicalTag}  <meta name="prerender-status" data-prerendered-root="true" content="active" />\n</head>`);
    fs.writeFileSync(indexHtmlPath, rootHtml, 'utf8');

    // Fetch active products upfront so both static category hubs and product pages can include them
    const { data: products, error: prodErr } = await supabase
        .from('products')
        .select('id, slug, sku, name, description, price, distributor_price, category, image_url, stock')
        .eq('is_active', true);

    const activeProducts = !prodErr && products ? products : [];

    // 1. Prerender Static & Category Hub Routes (with ItemList & crawlable product links)
    for (const item of STATIC_ROUTES) {
        const canonical = `${BASE_URL}/${item.route}`;
        const hubLinksHtml = activeProducts
            .slice(0, 60)
            .map(
                (p) =>
                    `<li><a href="${BASE_URL}/producto/${encodeURIComponent(p.slug || p.id)}">${escapeHtml(
                        p.name
                    )} — $${Number(p.price || 0).toFixed(2)} MXN</a></li>`
            )
            .join('');

        const jsonLd = [
            {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: item.h1,
                description: item.description,
                url: canonical,
                provider: {
                    '@type': 'Organization',
                    name: 'J. Denis Cosméticos México',
                    url: BASE_URL,
                },
            },
            ...(activeProducts.length > 0
                ? [
                      {
                          '@context': 'https://schema.org',
                          '@type': 'ItemList',
                          name: item.h1,
                          numberOfItems: activeProducts.length,
                          itemListElement: activeProducts.slice(0, 40).map((p, idx) => ({
                              '@type': 'ListItem',
                              position: idx + 1,
                              name: p.name,
                              url: `${BASE_URL}/producto/${encodeURIComponent(p.slug || p.id)}`,
                          })),
                      },
                  ]
                : []),
        ];
        const noscriptHtml = `<main><h1>${escapeHtml(item.h1)}</h1><p>${escapeHtml(
            item.description
        )}</p><p><a href="${BASE_URL}/tienda">Ver Catálogo J. Denis</a> | <a href="${BASE_URL}/registro-distribuidor">Venta al Mayoreo</a></p><ul>${hubLinksHtml}</ul></main>`;
        const html = buildRouteHtml(baseHtml, {
            title: item.title,
            description: item.description,
            canonical,
            ogType: 'website',
            jsonLd,
            noscriptHtml,
        });
        writeRouteFile(item.route, html);
        generatedCount++;
    }

    // 2. Prerender Active Products (/producto/:slug and /producto/:id -> canonical /producto/:slug)
    if (activeProducts.length > 0) {
        for (const p of activeProducts) {
            const canonicalKey = p.slug || p.id;
            const canonicalUrl = `${BASE_URL}/producto/${encodeURIComponent(canonicalKey)}`;
            const override = PRODUCT_OVERRIDES[canonicalKey] || PRODUCT_OVERRIDES[p.id];
            const descriptor = getGenericDescriptor(p.name, p.category);
            const skuCode = p.sku || `JD-${String(canonicalKey).toUpperCase().slice(0, 32)}`;
            const numPrice = Number(p.price || 0);
            const imgUrl = p.image_url
                ? p.image_url.startsWith('http')
                    ? p.image_url
                    : `${BASE_URL}${p.image_url}`
                : `${BASE_URL}/hero-products.jpg`;

            const title =
                override?.title ||
                `${p.name} ($${numPrice.toFixed(0)} MXN) | ${descriptor} | J. Denis México`;
            const description =
                override?.description ||
                `${p.name} ($${numPrice.toFixed(0)} MXN): ${String(
                    p.description || `${descriptor} fabricado en México por J. Denis.`
                ).slice(0, 125)} Compra menudeo o mayoreo con envío a todo México.`;

            const productSchema = {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: p.name,
                description: p.description || `${p.name} — ${descriptor} J. Denis México.`,
                image: [imgUrl],
                sku: skuCode,
                mpn: skuCode,
                brand: { '@type': 'Brand', name: 'J. Denis Cosméticos' },
                manufacturer: {
                    '@type': 'Organization',
                    name: 'J. Denis México',
                    url: BASE_URL,
                },
                category: p.category,
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
                        reviewBody: `${p.name} de la línea profesional ${p.category} J. Denis cumple con los estándares clínicos de rendimiento, fijación y seguridad cosmética en cabina.`,
                    },
                ],
                offers: {
                    '@type': 'Offer',
                    url: canonicalUrl,
                    priceCurrency: 'MXN',
                    price: (numPrice > 0 ? numPrice : 100).toFixed(2),
                    priceValidUntil: '2027-12-31',
                    itemCondition: 'https://schema.org/NewCondition',
                    availability: p.stock === 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
                    seller: {
                        '@type': 'Organization',
                        name: 'J. Denis Cosméticos México',
                        url: BASE_URL,
                    },
                    shippingDetails: {
                        '@type': 'OfferShippingDetails',
                        shippingRate: {
                            '@type': 'MonetaryAmount',
                            value: numPrice >= 2000 ? '0.00' : '200.00',
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
                        merchantReturnLink: `${BASE_URL}/politica-de-devoluciones`,
                        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                        merchantReturnDays: 7,
                        returnMethod: 'https://schema.org/ReturnByMail',
                        returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
                    },
                },
            };

            const breadcrumbSchema = {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                name: 'Ruta de navegación',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE_URL },
                    { '@type': 'ListItem', position: 2, name: 'Tienda', item: `${BASE_URL}/tienda` },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: p.category,
                        item: `${BASE_URL}/tienda?cat=${encodeURIComponent(p.category)}`,
                    },
                    { '@type': 'ListItem', position: 4, name: p.name, item: canonicalUrl },
                ],
            };

            const noscriptHtml = `<article><h1>${escapeHtml(p.name)}</h1><p>${escapeHtml(
                p.description || descriptor
            )}</p><p>SKU: ${escapeHtml(skuCode)} | Categoría: ${escapeHtml(p.category)} | Precio: $${numPrice.toFixed(
                2
            )} MXN</p></article>`;

            const html = buildRouteHtml(baseHtml, {
                title,
                description,
                canonical: canonicalUrl,
                ogType: 'product',
                image: imgUrl,
                jsonLd: [productSchema, breadcrumbSchema],
                noscriptHtml,
            });

            writeRouteFile(`producto/${canonicalKey}`, html);
            generatedCount++;

            // Also pre-render the UUID path if different from slug so existing Google-indexed UUID links
            // immediately serve HTTP 200 with <link rel="canonical" href="https://jdenis.store/producto/<slug>" />
            if (p.slug && p.id && p.slug !== p.id) {
                writeRouteFile(`producto/${p.id}`, html);
                generatedCount++;
            }
        }
    }

    // 3. Prerender Published Blog & News Posts
    const { data: posts, error: blogErr } = await supabase
        .from('blog_posts')
        .select('slug, title, excerpt, featured_image, post_type, published_at')
        .eq('published', true);

    if (!blogErr && posts) {
        for (const post of posts) {
            if (!post.slug) continue;
            const prefix = post.post_type === 'news' ? 'noticias' : 'blog';
            const canonicalUrl = `${BASE_URL}/${prefix}/${encodeURIComponent(post.slug)}`;
            const title =
                post.slug === 'lifting-coreano-vs-clasico'
                    ? 'Lifting Coreano vs. Lash Lifting Clásico: Diferencias, Cisteamina y Cuál Elegir | J. Denis'
                    : `${post.title} | Blog Oficial J. Denis México`;
            const description =
                post.slug === 'lifting-coreano-vs-clasico'
                    ? 'Comparativa técnica entre Lifting Coreano con Cisteamina y Lash Lifting Clásico J. Denis: tiempos de pose, salud de la pestaña, pads anatómicos y duración de 6 a 8 semanas.'
                    : post.excerpt || `${post.title} — Guía técnica y profesional por J. Denis Cosméticos México.`;

            const articleSchema = {
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: post.title,
                description,
                image: post.featured_image || `${BASE_URL}/hero-products.jpg`,
                datePublished: post.published_at || new Date().toISOString(),
                author: { '@type': 'Organization', name: 'J. Denis Cosméticos México' },
                publisher: { '@type': 'Organization', name: 'J. Denis Cosméticos México', url: BASE_URL },
                mainEntityOfPage: canonicalUrl,
            };

            const noscriptHtml = `<article><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(description)}</p></article>`;
            const html = buildRouteHtml(baseHtml, {
                title,
                description,
                canonical: canonicalUrl,
                ogType: 'article',
                image: post.featured_image || `${BASE_URL}/hero-products.jpg`,
                jsonLd: [articleSchema],
                noscriptHtml,
            });

            writeRouteFile(`${prefix}/${post.slug}`, html);
            generatedCount++;
        }
    }

    const distVersionPath = path.join(DIST_DIR, '__version.json');
    if (fs.existsSync(distVersionPath)) {
        try {
            const vData = JSON.parse(fs.readFileSync(distVersionPath, 'utf8'));
            vData.builtAt = new Date().toISOString();
            fs.writeFileSync(distVersionPath, JSON.stringify(vData, null, 2), 'utf8');
        } catch {
            // ignore
        }
    }

    console.log(`[Prerender] Successfully generated ${generatedCount} static SEO route HTML files in dist/`);
}

// Run if invoked directly from CLI
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    prerenderSeoRoutes().catch((err) => {
        console.error('[Prerender] Error:', err);
    });
}
