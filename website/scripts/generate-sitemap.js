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

function escapeXml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

async function generateSitemapAndFeeds() {
    console.log('Generating sitemap.xml, sitemap-productos.xml & google-merchant-feed.xml...');
    const sitemapLines = [];
    const productSitemapLines = [];
    const merchantFeedLines = [];

    sitemapLines.push('<?xml version="1.0" encoding="UTF-8"?>');
    sitemapLines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');

    productSitemapLines.push('<?xml version="1.0" encoding="UTF-8"?>');
    productSitemapLines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');

    merchantFeedLines.push('<?xml version="1.0" encoding="UTF-8"?>');
    merchantFeedLines.push('<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">');
    merchantFeedLines.push('  <channel>');
    merchantFeedLines.push('    <title>J. Denis Cosméticos México — Catálogo Oficial de Productos</title>');
    merchantFeedLines.push(`    <link>${BASE_URL}</link>`);
    merchantFeedLines.push('    <description>Catálogo oficial de productos profesionales J. Denis para cejas, pestañas, laminado, lash lifting con cisteamina, brow henna y pigmentos en México.</description>');

    const addUrl = (targetLines, loc, lastmod, priority, changefreq = 'weekly', imageObj = null) => {
        targetLines.push('  <url>');
        targetLines.push(`    <loc>${escapeXml(`${BASE_URL}${loc}`)}</loc>`);
        if (lastmod) targetLines.push(`    <lastmod>${lastmod.split('T')[0]}</lastmod>`);
        if (changefreq) targetLines.push(`    <changefreq>${changefreq}</changefreq>`);
        if (priority) targetLines.push(`    <priority>${priority}</priority>`);
        if (imageObj && imageObj.url) {
            targetLines.push('    <image:image>');
            targetLines.push(`      <image:loc>${escapeXml(imageObj.url)}</image:loc>`);
            if (imageObj.title) targetLines.push(`      <image:title>${escapeXml(imageObj.title)}</image:title>`);
            targetLines.push('    </image:image>');
        }
        targetLines.push('  </url>');
    };

    const today = new Date().toISOString();

    // Core Public Pages & Dedicated SEO Category Hubs
    addUrl(sitemapLines, '/', today, '1.0', 'daily');
    addUrl(sitemapLines, '/tienda', today, '0.95', 'daily');
    addUrl(sitemapLines, '/cejas', today, '0.95', 'daily');
    addUrl(sitemapLines, '/pestanas', today, '0.95', 'daily');
    addUrl(sitemapLines, '/laminado-de-cejas', today, '0.95', 'daily');
    addUrl(sitemapLines, '/lash-lifting', today, '0.95', 'daily');
    addUrl(sitemapLines, '/henna-y-pigmentos', today, '0.95', 'daily');
    addUrl(sitemapLines, '/registro-distribuidor', today, '0.9', 'weekly');
    addUrl(sitemapLines, '/academia', today, '0.85', 'weekly');
    addUrl(sitemapLines, '/blog', today, '0.85', 'daily');
    addUrl(sitemapLines, '/nosotros', today, '0.8', 'monthly');
    addUrl(sitemapLines, '/solicitar-factura', today, '0.6', 'monthly');
    addUrl(sitemapLines, '/aviso-de-privacidad', today, '0.5', 'yearly');
    addUrl(sitemapLines, '/politica-de-devoluciones', today, '0.6', 'yearly');

    // Category Landing Views (Catalog v2 — 10 official categories)
    const categoryIds = [
        'lash-lifting',
        'diseno-de-cejas-y-microblading',
        'pigmentos-y-brow-henna',
        'extensiones-y-pestanas',
        'lash-curling-y-botox',
        'adhesivos-higiene-y-preparadores',
        'mascaras-y-tratamientos',
        'herramientas-pinzas-y-equipo',
        'accesorios-y-consumibles',
        'paquetes-buen-fin',
    ];
    for (const catId of categoryIds) {
        addUrl(sitemapLines, `/tienda?cat=${catId}`, today, '0.88', 'daily');
    }

    // Active Products (Catalog v2 schema)
    const { data: rawProducts, error: pError } = await supabase
        .from('products')
        .select('product_id, slug, name, description, base_price_mxn, promo_price_mxn, category, image_url, total_stock, updated_at')
        .eq('is_active', true)
        .order('name', { ascending: true });

    const products = (rawProducts || []).map((r) => {
        const base = Number(r.base_price_mxn ?? 0);
        const promo = r.promo_price_mxn != null && Number(r.promo_price_mxn) > 0 && Number(r.promo_price_mxn) < base
            ? Number(r.promo_price_mxn)
            : null;
        return {
            id: String(r.product_id),
            slug: r.slug,
            sku: `JD-${String(r.slug || r.product_id).toUpperCase().slice(0, 32)}`,
            name: r.name,
            description: r.description,
            price: promo ?? base,
            category: r.category,
            image_url: r.image_url,
            stock: r.total_stock ?? 0,
            updated_at: r.updated_at,
        };
    });

    if (!pError && products.length > 0) {
        const seenSlugs = new Set();
        products.forEach((p) => {
            const key = p.slug || p.id;
            if (seenSlugs.has(key)) return;
            seenSlugs.add(key);

            const locPath = `/producto/${encodeURIComponent(key)}`;
            const fullUrl = `${BASE_URL}${locPath}`;
            const imgUrl = p.image_url
                ? p.image_url.startsWith('http')
                    ? p.image_url
                    : `${BASE_URL}${p.image_url}`
                : `${BASE_URL}/hero-products.jpg`;
            const skuCode = p.sku || `JD-${String(key).toUpperCase().slice(0, 32)}`;
            const numPrice = Number(p.price || 0) > 0 ? Number(p.price) : 100;
            const shippingCost = numPrice >= 2000 ? '0.00 MXN' : '200.00 MXN';

            const imageObj = {
                url: imgUrl,
                title: `${p.name} — ${p.category || 'Cosmético Profesional'} J. Denis México`,
            };

            addUrl(sitemapLines, locPath, p.updated_at || today, '0.9', 'weekly', imageObj);
            addUrl(productSitemapLines, locPath, p.updated_at || today, '0.95', 'daily', imageObj);

            // Google Merchant Center / Google Shopping Item
            merchantFeedLines.push('    <item>');
            merchantFeedLines.push(`      <g:id>${escapeXml(skuCode)}</g:id>`);
            merchantFeedLines.push(`      <g:title>${escapeXml(`${p.name} - ${p.category} Profesional J. Denis`)}</g:title>`);
            merchantFeedLines.push(
                `      <g:description>${escapeXml(
                    p.description || `${p.name} de la línea ${p.category} fabricado en México por J. Denis Cosméticos.`
                )}</g:description>`
            );
            merchantFeedLines.push(`      <g:link>${escapeXml(fullUrl)}</g:link>`);
            merchantFeedLines.push(`      <g:image_link>${escapeXml(imgUrl)}</g:image_link>`);
            merchantFeedLines.push('      <g:condition>new</g:condition>');
            merchantFeedLines.push(`      <g:availability>${p.stock === 0 ? 'out_of_stock' : 'in_stock'}</g:availability>`);
            merchantFeedLines.push(`      <g:price>${numPrice.toFixed(2)} MXN</g:price>`);
            merchantFeedLines.push('      <g:brand>J. Denis Cosméticos</g:brand>');
            merchantFeedLines.push(`      <g:mpn>${escapeXml(skuCode)}</g:mpn>`);
            merchantFeedLines.push('      <g:identifier_exists>no</g:identifier_exists>');
            merchantFeedLines.push(
                '      <g:google_product_category>Health &amp; Beauty &gt; Personal Care &gt; Cosmetics</g:google_product_category>'
            );
            merchantFeedLines.push(`      <g:product_type>${escapeXml(`Cosméticos > ${p.category || 'Cejas y Pestañas'}`)}</g:product_type>`);
            merchantFeedLines.push('      <g:shipping>');
            merchantFeedLines.push('        <g:country>MX</g:country>');
            merchantFeedLines.push('        <g:service>Envío Asegurado Nacional</g:service>');
            merchantFeedLines.push(`        <g:price>${shippingCost}</g:price>`);
            merchantFeedLines.push('      </g:shipping>');
            merchantFeedLines.push('    </item>');
        });
    }

    // Blog & News Posts
    const { data: posts, error: bError } = await supabase
        .from('blog_posts')
        .select('slug, post_type, updated_at')
        .eq('published', true);

    if (!bError && posts) {
        posts.forEach((p) => {
            const prefix = p.post_type === 'news' ? '/noticias' : '/blog';
            addUrl(sitemapLines, `${prefix}/${encodeURIComponent(p.slug)}`, p.updated_at || today, '0.8', 'weekly');
        });
    }

    sitemapLines.push('</urlset>');
    productSitemapLines.push('</urlset>');
    merchantFeedLines.push('  </channel>');
    merchantFeedLines.push('</rss>');

    const publicDir = path.resolve(__dirname, '../public');
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapLines.join('\n'), 'utf8');
    fs.writeFileSync(path.join(publicDir, 'sitemap-productos.xml'), productSitemapLines.join('\n'), 'utf8');
    fs.writeFileSync(path.join(publicDir, 'google-merchant-feed.xml'), merchantFeedLines.join('\n'), 'utf8');

    console.log(
        `Generated public/sitemap.xml, public/sitemap-productos.xml & public/google-merchant-feed.xml (${
            (products || []).length
        } products, ${(posts || []).length} posts)`
    );
}

generateSitemapAndFeeds().catch(console.error);
