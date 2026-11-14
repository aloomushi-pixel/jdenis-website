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

function clampSeoTitle(rawTitle, maxLen = 60) {
    const clean = String(rawTitle || '').replace(/\s+/g, ' ').trim();
    if (clean.length <= maxLen) return clean;
    const pipeIdx = clean.lastIndexOf('|');
    if (pipeIdx > 15) {
        const left = clean.slice(0, pipeIdx).trim();
        const withShortBrand = /j\.?\s*denis/i.test(left) ? left : `${left} | J. Denis`;
        if (withShortBrand.length <= maxLen) return withShortBrand;
        const maxLeft = Math.max(20, maxLen - 11);
        const cutLeft = left.slice(0, maxLeft).replace(/\s+\S*$/, '').replace(/[,:;—–-]+$/, '').trim();
        const rebuilt = /j\.?\s*denis/i.test(cutLeft) ? cutLeft : `${cutLeft} | J. Denis`;
        if (rebuilt.length <= maxLen) return rebuilt;
    }
    return clean.slice(0, maxLen).replace(/\s+\S*$/, '').trim();
}

function clampSeoDescription(rawDesc, maxLen = 160) {
    const clean = String(rawDesc || '').replace(/\s+/g, ' ').trim();
    if (clean.length <= maxLen) return clean;
    const sliced = clean.slice(0, maxLen - 1).replace(/\s+\S*$/, '').replace(/[,:;—–-]+$/, '').trim();
    return sliced.endsWith('.') ? sliced : `${sliced}.`;
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
        title: 'Kit Laminado de Cejas Cisteamina (30 Aplic.) | J. Denis',
        description: 'Kit Laminado y Planchado de Cejas J. Denis con Cisteamina (30 aplicaciones). Alinea cejas rebeldes sin maltratar. Menudeo y mayoreo en México.',
    },
    'jade-rizado-pestanas': {
        title: 'Kit Jade Rizado de Pestañas ($250 MXN) | J. Denis Oficial',
        description: 'Compra Kit Jade de Rizado de Pestañas J. Denis ($250 MXN): Gel Ondulante, Neutralizante, Adhesivo y Rulos. Duración 6-8 semanas. Envío México.',
    },
    'chocolate-pigmento-cejas': {
        title: 'Pigmento Cejas Chocolate Castaño Medio ($200) | J. Denis',
        description: 'Pigmento para Cejas Chocolate / Castaño Medio J. Denis ($200 MXN). Efecto sombra de larga duración en piel y vello sin virar a rojo. Envíos MX.',
    },
    'adhesivo-negro-grupo': {
        title: 'Adhesivo Negro Pestañas de Grupo ($60 MXN) | J. Denis',
        description: 'Adhesivo J. Denis negro para pestañas de grupo o punto ($60 MXN). Fijación hipoalergénica y efecto delineado. Venta menudeo y mayoreo en México.',
    },
    'tintura-topica-castano-medio': {
        title: 'Tintura Tópica Cejas Castaño Medio Sombra | J. Denis',
        description: 'Tintura tópica Castaño Medio J. Denis para cejas. Coloración uniforme en piel y vello con efecto sombra de larga duración. Directo de fábrica MX.',
    },
    'activador-henna': {
        title: 'Activador de Henna Orgánico para Cejas | J. Denis México',
        description: 'Activador de Henna orgánico J. Denis para cejas. Duplica la fijación e intensidad de Brow Henna y pigmentos en piel y vello. Directo de fábrica.',
    },
    'botox-pestanas': {
        title: 'Botox Pestañas y Cejas con Queratina y Biotina | J. Denis',
        description: 'Tratamiento Botox J. Denis para pestañas y cejas. Hidrata, engrosa y repara tras Lash Lifting o Laminado. Venta menudeo y mayoreo en México.',
    },
    'dark-red-pigmento-cejas': {
        title: 'Pigmento Cejas Dark Red (Pelirrojo / Caoba) | J. Denis',
        description: 'Pigmento profesional para cejas Dark Red (Pelirrojo / Caoba) J. Denis. Alta retención en piel y vello o modificador cálido. Directo de fábrica.',
    },
    'gel-ondulante-blue': {
        title: 'Gel Ondulante Blue Rizado de Pestañas | J. Denis México',
        description: 'Gel Ondulante Blue profesional J. Denis para rizado permanente de pestañas. Acción controlada para lashistas. Menudeo y mayoreo directo fábrica.',
    },
    'light-brown-pigmento-cejas': {
        title: 'Pigmento Cejas Light Brown (Castaño Claro) | J. Denis',
        description: 'Pigmento profesional para cejas Light Brown (Castaño Claro) J. Denis. Efecto sombra natural ideal para fototipos claros y rubios sin oscurecer.',
    },
    'adhesivo-transparente-grupo': {
        title: 'Adhesivo Transparente Pestañas Grupo y Punto | J. Denis',
        description: 'Adhesivo transparente hipoalergénico para pestañas de grupo o punto J. Denis. Acabado invisible y secado rápido. Venta menudeo y mayoreo México.',
    },
    'microbrush-10': {
        title: 'Microbrush Precisión Pestañas y Cejas (10 pz) | J. Denis',
        description: 'Paquete de 10 aplicadores Microbrush sin pelusa J. Denis para Lash Lifting, extensiones, laminado y retiro de adhesivo. Insumos profesionales MX.',
    },
    'godete-cristal': {
        title: 'Godete de Cristal para Henna y Pigmentos ($295) | J. Denis',
        description: 'Godete de Cristal macizo profesional J. Denis ($295 MXN) para mezclar Brow Henna, pigmentos y tintes sin alterar la fórmula. Envío a todo México.',
    },
    'curva-lc-015-combo': {
        title: 'Extensiones Pestañas Curva LC 0.15 Foxy Eye | J. Denis',
        description: 'Blíster Extensiones de Pestañas Curva LC 0.15 Mixta J. Denis ($280 MXN). Base recta de alta retención ideal para párpado encapotado y Foxy Eye.',
    },
    'curva-lc-010-combo': {
        title: 'Extensiones Pestañas Curva LC 0.10 Mixta | J. Denis',
        description: 'Blíster Extensiones de Pestañas Curva LC 0.10 Mixta J. Denis ($280 MXN). Ligereza superior y máxima retención para diseños Foxy Eye y Cat Eye.',
    },
    'adhesivo-pads-lifting': {
        title: 'Adhesivo para Pads de Lash Lifting y Rizado | J. Denis',
        description: 'Adhesivo hidrosoluble J. Denis para fijar pads de silicón y pestañas en Lash Lifting y Rizado. Secado controlado y fácil retiro con agua.',
    },
    'adhesivo-rulos-blue': {
        title: 'Adhesivo Blue Rulos y Pads Rizado ($60 MXN) | J. Denis',
        description: 'Adhesivo para Rulos y Pads línea Blue J. Denis ($60 MXN). Fijación firme y rápida para rizado permanente de pestañas y lash lifting profesional.',
    },
};

const STATIC_ROUTES = [
    {
        route: 'cejas',
        title: 'J. Denis Cejas: Laminado, Planchado, Henna y Pigmentos',
        h1: 'Productos Profesionales para Cejas J. Denis: Planchado, Laminado, Henna y Pigmentos',
        description: 'Catálogo oficial J. Denis Cejas: Kits de Planchado y Laminado con Cisteamina, Brow Henna, Pigmentos y Gel Fijador. Menudeo y mayoreo de fábrica.',
    },
    {
        route: 'pestanas',
        title: 'J. Denis Pestañas: Lash Lifting, Rizado y Adhesivos',
        h1: 'Productos para Pestañas J. Denis: Lash Lifting, Rizado Permanente, Extensiones y Adhesivos',
        description: 'Insumos profesionales J. Denis para pestañas: Lash Lifting Cisteamina, Rizado Jade, Extensiones, Adhesivos hipoalergénicos y Botox en México.',
    },
    {
        route: 'laminado-de-cejas',
        title: 'Laminado de Cejas Cisteamina y Planchado | J. Denis',
        h1: 'Laminado de Cejas y Planchado Profesional J. Denis con Cisteamina',
        description: 'Kit de Laminado y Planchado de Cejas J. Denis con Cisteamina (30 aplicaciones). Alinea cejas rebeldes sin daño. Menudeo y mayoreo en México.',
    },
    {
        route: 'lash-lifting',
        title: 'Kit Lash Lifting Cisteamina, Pads y Adhesivos | J. Denis',
        h1: 'Lash Lifting J. Denis con Cisteamina: Kits, Monodosis, Pads y Adhesivos',
        description: 'Catálogo Lash Lifting J. Denis: Kits Evolución con Cisteamina, monodosis, pads anatómicos, adhesivo hidrosoluble y Botox. Menudeo y mayoreo MX.',
    },
    {
        route: 'henna-y-pigmentos',
        title: 'Brow Henna, Rubor y Pigmentos para Cejas | J. Denis México',
        h1: 'Brow Henna, Rubor para Cejas y Pigmentos Profesionales J. Denis',
        description: 'Compra Brow Henna, Rubor para Cejas, Tintura Tópica, Activador Orgánico y Pigmentos J. Denis. Tonos Chocolate, Castaño y Negro. Menudeo y mayoreo.',
    },
    {
        route: 'tienda',
        title: 'Tienda Oficial Cejas, Pestañas y Mayoreo | J. Denis México',
        h1: 'Catálogo Oficial de Cosméticos para Cejas y Pestañas — Venta Menudeo y Mayoreo',
        description: 'Catálogo oficial J. Denis (+240 productos): laminado de cejas, lash lifting cisteamina, brow henna, pigmentos y adhesivos. Envíos a todo México.',
    },
    {
        route: 'nosotros',
        title: 'J. Denis Lindavista CDMX | Fábrica y Tienda Oficial',
        h1: 'J. Denis México — Creadores del Planchado de Cejas y Rizado de Pestañas desde 1998',
        description: 'Historia de J. Denis y la Mtra. Gabriela Elizalde en Av. Montevideo 136, Lindavista, CDMX. Fabricante mexicano de cejas y pestañas desde 1998.',
    },
    {
        route: 'academia',
        title: 'Academia J. Denis CDMX | Cursos Cejas y Pestañas DC-3 STPS',
        h1: 'Academia J. Denis — Cursos Certificados STPS DC-3 de Cejas, Pestañas y Lash Lifting',
        description: 'Cursos certificados STPS (DC-3) en Academia J. Denis: laminado y planchado de cejas, lash lifting con cisteamina, brow henna y extensiones.',
    },
    {
        route: 'registro-distribuidor',
        title: 'Distribuidores y Cosméticos por Mayoreo | J. Denis Fábrica',
        h1: 'Programa Oficial de Distribuidores y Mayoristas J. Denis en México',
        description: 'Compra cosméticos para cejas y pestañas al mayoreo directo de fábrica J. Denis. Precios de distribuidor para estéticas y academias en México.',
    },
    {
        route: 'blog',
        title: 'Blog Técnico Cejas, Pestañas y Lash Lifting | J. Denis',
        h1: 'Blog Técnico de Cosmética Profesional J. Denis',
        description: 'Guías técnicas J. Denis: protocolos de cisteamina, tiempos de pose de gel ondulante, lifting coreano vs clásico y colorimetría de Brow Henna.',
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
    const safeTitle = escapeHtml(clampSeoTitle(title, 60));
    const safeDesc = escapeHtml(clampSeoDescription(description, 160));
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

    // Fetch active products upfront so both static category hubs and product pages can include them (Catalog v2)
    const { data: rawProducts, error: prodErr } = await supabase
        .from('products')
        .select('product_id, slug, name, description, base_price_mxn, promo_price_mxn, distributor_price_mxn, category, image_url, total_stock, seo_title, seo_description')
        .eq('is_active', true);

    const activeProducts = !prodErr && rawProducts
        ? rawProducts.map((r) => {
              const base = Number(r.base_price_mxn ?? 0);
              const promo =
                  r.promo_price_mxn != null && Number(r.promo_price_mxn) > 0 && Number(r.promo_price_mxn) < base
                      ? Number(r.promo_price_mxn)
                      : null;
              return {
                  id: String(r.product_id),
                  slug: r.slug,
                  sku: `JD-${String(r.slug || r.product_id).toUpperCase().slice(0, 32)}`,
                  name: r.name,
                  description: r.description,
                  price: promo ?? base,
                  distributor_price: r.distributor_price_mxn,
                  category: r.category,
                  image_url: r.image_url,
                  stock: r.total_stock ?? 0,
                  seo_title: r.seo_title,
                  seo_description: r.seo_description,
              };
          })
        : [];

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
            {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                name: 'Ruta de navegación',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE_URL },
                    { '@type': 'ListItem', position: 2, name: item.h1, item: canonical },
                ],
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

            const title = clampSeoTitle(
                override?.title || `${p.name} ($${numPrice.toFixed(0)}) | J. Denis`,
                60
            );
            const description = clampSeoDescription(
                override?.description ||
                    `${p.name} ($${numPrice.toFixed(0)} MXN): ${String(
                        p.description || `${descriptor} fabricado en México por J. Denis.`
                    ).slice(0, 88)}. Menudeo y mayoreo J. Denis en México.`,
                160
            );

            const productSchema = {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: p.name,
                description,
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
                    validFrom: '2026-01-01',
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
            const isLiftingCoreano = post.slug === 'lifting-coreano-vs-clasico';
            const title = clampSeoTitle(
                isLiftingCoreano
                    ? 'Lifting Coreano vs Clásico: Moldes y Guía | J. Denis'
                    : `${post.title} | J. Denis`,
                60
            );
            const description = clampSeoDescription(
                isLiftingCoreano
                    ? '¿Lifting Coreano (rizo J/L con Cisteamina) o Clásico (curva C)? Compara moldes, tiempos de pose, tipo de ojo y duración de 6-8 semanas.'
                    : post.excerpt || `${post.title} — Guía técnica profesional por J. Denis México.`,
                160
            );

            const articleSchema = {
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: isLiftingCoreano ? title : post.title,
                description,
                image: post.featured_image || `${BASE_URL}/hero-products.jpg`,
                datePublished: post.published_at || new Date().toISOString(),
                author: { '@type': 'Organization', name: 'Equipo Técnico J. Denis México' },
                publisher: {
                    '@type': 'Organization',
                    name: 'J. Denis Cosméticos México',
                    url: BASE_URL,
                    logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-new.jpeg` },
                },
                mainEntityOfPage: canonicalUrl,
            };

            const blogSchemas = isLiftingCoreano
                ? [
                      articleSchema,
                      {
                          '@context': 'https://schema.org',
                          '@type': 'FAQPage',
                          mainEntity: [
                              {
                                  '@type': 'Question',
                                  name: '¿Cuál es la diferencia entre Lifting Coreano y Lash Lifting Clásico?',
                                  acceptedAnswer: {
                                      '@type': 'Answer',
                                      text: 'El Lifting Coreano utiliza moldes planos o semiplanos con Cisteamina Estabilizada y Shot 1.5 para lograr un rizo abierto tipo J o L de acabado natural, mientras que el Lifting Clásico emplea moldes nube o cilíndricos para una curvatura pronunciada tipo C o U.',
                                  },
                              },
                              {
                                  '@type': 'Question',
                                  name: '¿Cuánto dura el Lifting Coreano de pestañas con Cisteamina J. Denis?',
                                  acceptedAnswer: {
                                      '@type': 'Answer',
                                      text: 'Tanto el Lifting Coreano como el Lifting Clásico realizados con Cisteamina J. Denis tienen una duración de 6 a 8 semanas en un procedimiento de 45 a 60 minutos sin resecar la fibra capilar.',
                                  },
                              },
                          ],
                      },
                  ]
                : [articleSchema];

            const noscriptHtml = `<article><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(description)}</p></article>`;
            const html = buildRouteHtml(baseHtml, {
                title,
                description,
                canonical: canonicalUrl,
                ogType: 'article',
                image: post.featured_image || `${BASE_URL}/hero-products.jpg`,
                jsonLd: blogSchemas,
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
