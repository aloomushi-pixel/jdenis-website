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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function normalizeString(str) {
    if (!str) return '';
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

async function fetchSitemap() {
    console.log("Fetching sitemap.xml to build true URL map...");
    const response = await fetch('https://www.jdenis.com/sitemap.xml');
    const xml = await response.text();

    // Extract locs
    const locs = xml.match(/<loc>(.*?)<\/loc>/g)?.map(l => l.replace('<loc>', '').replace('</loc>', '')) || [];
    const productUrls = locs.filter(l => l.includes('/productos/'));

    console.log(`Found ${productUrls.length} product URLs in sitemap.`);

    const sitemapMap = [];
    for (const url of productUrls) {
        // extract the slug part: https://www.jdenis.com/productos/nombre-del-producto/
        const parts = url.split('/');
        const urlSlug = parts[parts.length - 2] || parts[parts.length - 1]; // last non-empty part
        sitemapMap.push({
            url,
            normalized: normalizeString(urlSlug.replace(/-/g, ' '))
        });
    }
    return sitemapMap;
}

// Function to calculate similarity between two strings
function getSimilarityScore(s1, s2) {
    let matches = 0;
    const len = Math.max(s1.length, s2.length);
    if (len === 0) return 1;
    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
        if (s1[i] === s2[i]) matches++;
    }
    return matches / len;
}

async function run() {
    console.log("Starting Image Synchronization Process Level 2...");

    const sitemapFiles = await fetchSitemap();

    const { data: products, error } = await supabase
        .from('products')
        .select('id, slug, name, image_url')
        .eq('is_active', true);

    if (error) {
        console.error("Error fetching products:", error.message);
        return;
    }

    console.log(`Found ${products.length} active products to check.`);

    let updatedCount = 0;
    let notFoundCount = 0;
    let errorCount = 0;

    for (const [index, product] of products.entries()) {
        const normName = normalizeString(product.name);
        const normSlug = normalizeString(product.slug.replace(/-/g, ' '));

        // Let's try to match the product to the sitemap URLs
        let bestMatchUrl = `https://www.jdenis.com/productos/${product.slug}/`;
        let highestScore = 0;

        for (const item of sitemapFiles) {
            let score = 0;
            if (item.normalized === normSlug || item.normalized === normName) {
                // Exact match
                score = 1;
            } else if (normName.includes(item.normalized) || item.normalized.includes(normName)) {
                score = 0.8;
            } else {
                score = Math.max(getSimilarityScore(normName, item.normalized), getSimilarityScore(normSlug, item.normalized));
                // Add penalty based on length difference
                score *= Math.min(normName.length, item.normalized.length) / Math.max(normName.length, item.normalized.length);
            }
            if (score > highestScore) {
                highestScore = score;
                bestMatchUrl = item.url;
            }
        }

        if (highestScore < 0.6) {
            // No good match
            console.log(`[${index + 1}/${products.length}] ⚠️ No suitable sitemap URL for: ${product.name} (Best score: ${highestScore.toFixed(2)})`);

            // Fallback to naive slug URL just in case
            bestMatchUrl = `https://www.jdenis.com/productos/${product.slug}/`;
        } else {
            console.log(`[${index + 1}/${products.length}] 🌐 Fetching via sitemap match: ${bestMatchUrl} for ${product.name} (Score: ${highestScore.toFixed(2)})`);
        }

        try {
            const response = await fetch(bestMatchUrl);
            if (!response.ok) {
                console.log(`  -> ⚠️ Failed to load page ${bestMatchUrl}`);
                notFoundCount++;
                continue;
            }

            const html = await response.text();
            const match = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);

            if (match && match[1]) {
                let jdenisImageUrl = match[1];
                if (jdenisImageUrl.startsWith('http://')) {
                    jdenisImageUrl = jdenisImageUrl.replace('http://', 'https://');
                }

                // Tiendanube appends ?v=123 to og:image sometimes, strip it to avoid redundant updates if only the version param changed
                const cleanUrl = jdenisImageUrl.split('?')[0];
                const cleanCurrent = product.image_url ? product.image_url.split('?')[0] : '';

                if (cleanCurrent === cleanUrl) {
                    console.log(`  -> ⏭️ Image already matched.`);
                } else {
                    console.log(`  -> ✨ Updating image to: ${jdenisImageUrl}`);
                    await supabase.from('products').update({ image_url: jdenisImageUrl }).eq('id', product.id);
                    updatedCount++;
                }
            } else {
                console.log(`  -> ⚠️ No og:image found on ${bestMatchUrl}`);
                notFoundCount++;
            }
        } catch (e) {
            console.error(`  -> ❌ Error:`, e.message);
            errorCount++;
        }
        await delay(150);
    }

    console.log('\\n----- DONE -----');
    console.log(`✅ Updated:  ${updatedCount}`);
    console.log(`⚠️ Unmatched: ${notFoundCount}`);
}

run();
