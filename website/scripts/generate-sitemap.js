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

async function generateSitemap() {
    console.log('Generating sitemap...');
    const sitemapLines = [];

    sitemapLines.push('<?xml version="1.0" encoding="UTF-8"?>');
    sitemapLines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    const addUrl = (loc, lastmod, priority) => {
        sitemapLines.push('  <url>');
        sitemapLines.push(`    <loc>${BASE_URL}${loc}</loc>`);
        if (lastmod) sitemapLines.push(`    <lastmod>${lastmod.split('T')[0]}</lastmod>`);
        if (priority) sitemapLines.push(`    <priority>${priority}</priority>`);
        sitemapLines.push('  </url>');
    };

    // Static pages
    const today = new Date().toISOString();
    addUrl('/', today, '1.0');
    addUrl('/tienda', today, '0.9');
    addUrl('/academia', today, '0.8');
    addUrl('/blog', today, '0.8');
    addUrl('/nosotros', today, '0.8');
    addUrl('/contacto', today, '0.7');

    // Products
    const { data: products, error: pError } = await supabase
        .from('products')
        .select('id, updated_at')
        .eq('is_active', true);
    
    if (!pError && products) {
        products.forEach(p => addUrl(`/producto/${p.id}`, p.updated_at || today, '0.9'));
    }

    // Blog & News Posts
    const { data: posts, error: bError } = await supabase
        .from('blog_posts')
        .select('slug, post_type, updated_at')
        .eq('published', true);

    if (!bError && posts) {
        posts.forEach(p => {
            const prefix = p.post_type === 'news' ? '/noticias' : '/blog';
            addUrl(`${prefix}/${p.slug}`, p.updated_at || today, '0.8');
        });
    }

    sitemapLines.push('</urlset>');

    const sitemapContent = sitemapLines.join('\n');
    fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), sitemapContent);
    console.log('Sitemap successfully generated at public/sitemap.xml');
}

generateSitemap().catch(console.error);
