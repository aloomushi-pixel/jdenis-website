import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zdciwzeokkrwcxvsgusc.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2l3emVva2tyd2N4dnNndXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTM3NTksImV4cCI6MjA4ODIyOTc1OX0.qbXG0M2Zsjz-rOXY0CgAV2RfLledS67nqBw_dnvzkbg';

const supabase = createClient(supabaseUrl, supabaseKey);
const BASE_URL = 'https://jdenis.store';

function escapeXml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

async function generateSitemap() {
    console.log('Generating sitemap...');
    const sitemapLines = [];

    sitemapLines.push('<?xml version="1.0" encoding="UTF-8"?>');
    sitemapLines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    const addUrl = (loc, lastmod, priority, changefreq = 'weekly') => {
        sitemapLines.push('  <url>');
        sitemapLines.push(`    <loc>${escapeXml(`${BASE_URL}${loc}`)}</loc>`);
        if (lastmod) sitemapLines.push(`    <lastmod>${lastmod.split('T')[0]}</lastmod>`);
        if (changefreq) sitemapLines.push(`    <changefreq>${changefreq}</changefreq>`);
        if (priority) sitemapLines.push(`    <priority>${priority}</priority>`);
        sitemapLines.push('  </url>');
    };

    const today = new Date().toISOString();

    // Core Public Pages & Dedicated SEO Category Hubs
    addUrl('/', today, '1.0', 'daily');
    addUrl('/tienda', today, '0.95', 'daily');
    addUrl('/cejas', today, '0.95', 'daily');
    addUrl('/pestanas', today, '0.95', 'daily');
    addUrl('/laminado-de-cejas', today, '0.95', 'daily');
    addUrl('/lash-lifting', today, '0.95', 'daily');
    addUrl('/henna-y-pigmentos', today, '0.95', 'daily');
    addUrl('/registro-distribuidor', today, '0.9', 'weekly');
    addUrl('/academia', today, '0.85', 'weekly');
    addUrl('/blog', today, '0.85', 'daily');
    addUrl('/nosotros', today, '0.8', 'monthly');
    addUrl('/solicitar-factura', today, '0.6', 'monthly');
    addUrl('/aviso-de-privacidad', today, '0.4', 'yearly');

    // Category Landing Views (B2C + B2B Wholesale SEO)
    const categoryIds = [
        'brow-henna',
        'cejas',
        'pigmentos',
        'lash-lifting',
        'lash-curling',
        'extensiones',
        'adhesivos',
        'tratamientos',
        'herramientas',
        'accesorios',
        'higiene',
        'pestanas-en-tira',
        'microblading'
    ];
    for (const catId of categoryIds) {
        addUrl(`/tienda?cat=${catId}`, today, '0.88', 'daily');
    }

    // Active Products (using canonical semantic slug)
    const { data: products, error: pError } = await supabase
        .from('products')
        .select('id, slug, updated_at')
        .eq('is_active', true);

    if (!pError && products) {
        const seenSlugs = new Set();
        products.forEach(p => {
            const key = p.slug || p.id;
            if (seenSlugs.has(key)) return;
            seenSlugs.add(key);
            addUrl(`/producto/${encodeURIComponent(key)}`, p.updated_at || today, '0.9', 'weekly');
        });
    }

    // Blog & News Posts
    const { data: posts, error: bError } = await supabase
        .from('blog_posts')
        .select('slug, post_type, updated_at')
        .eq('published', true);

    if (!bError && posts) {
        posts.forEach(p => {
            const prefix = p.post_type === 'news' ? '/noticias' : '/blog';
            addUrl(`${prefix}/${encodeURIComponent(p.slug)}`, p.updated_at || today, '0.8', 'weekly');
        });
    }

    sitemapLines.push('</urlset>');

    const sitemapContent = sitemapLines.join('\n');
    fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), sitemapContent);
    console.log(`Sitemap successfully generated at public/sitemap.xml (${(products || []).length} products, ${(posts || []).length} posts)`);
}

generateSitemap().catch(console.error);
