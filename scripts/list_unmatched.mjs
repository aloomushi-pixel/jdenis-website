import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../website/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';

const supabase = createClient(supabaseUrl, supabaseKey);

function normalizeString(str) {
    if (!str) return '';
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

function getSimilarityScore(s1, s2) {
    let matches = 0;
    const len = Math.max(s1.length, s2.length);
    if (len === 0) return 1;
    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
        if (s1[i] === s2[i]) matches++;
    }
    return matches / len;
}

async function fetchSitemap() {
    const response = await fetch('https://www.jdenis.com/sitemap.xml');
    const xml = await response.text();
    const locs = xml.match(/<loc>(.*?)<\/loc>/g)?.map(l => l.replace('<loc>', '').replace('</loc>', '')) || [];
    const productUrls = locs.filter(l => l.includes('/productos/'));

    const sitemapMap = [];
    for (const url of productUrls) {
        const parts = url.split('/');
        const urlSlug = parts[parts.length - 2] || parts[parts.length - 1];
        sitemapMap.push({
            url,
            normalized: normalizeString(urlSlug.replace(/-/g, ' '))
        });
    }
    return sitemapMap;
}

async function check() {
    console.log("Fetching sitemap...");
    const sitemapFiles = await fetchSitemap();

    const { data: products } = await supabase.from('products').select('id, name, slug').eq('is_active', true);

    let unmatched = [];

    for (const product of products) {
        const normName = normalizeString(product.name);
        const normSlug = normalizeString(product.slug.replace(/-/g, ' '));

        let highestScore = 0;
        for (const item of sitemapFiles) {
            let score = 0;
            if (item.normalized === normSlug || item.normalized === normName) {
                score = 1;
            } else if (normName.includes(item.normalized) || item.normalized.includes(normName)) {
                score = 0.8;
            } else {
                score = Math.max(getSimilarityScore(normName, item.normalized), getSimilarityScore(normSlug, item.normalized));
                score *= Math.min(normName.length, item.normalized.length) / Math.max(normName.length, item.normalized.length);
            }
            if (score > highestScore) highestScore = score;
        }

        if (highestScore < 0.6) {
            unmatched.push(product);
        }
    }

    console.log(`Unmatched count: ${unmatched.length}`);
    unmatched.forEach(u => console.log(`- ${u.name}`));
}

check();
