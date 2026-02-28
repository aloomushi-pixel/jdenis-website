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

async function run() {
    console.log("Starting Deep Search Image Sync for Remaining Products...");

    // Get all products that don't have the hi-res tag
    const { data: products } = await supabase.from('products').select('id, name, slug, image_url').eq('is_active', true);

    let unmatched = products.filter(p => !p.image_url || !p.image_url.includes('-640-0.webp'));

    // For some products, they might legitimately not have a -640-0.webp image on jdenis.com.
    // Let's filter to just exactly those 58 we had before by re-running the logic or just using this list.

    console.log(`Found ${unmatched.length} candidates for Deep Search.`);

    let updatedCount = 0;

    for (const [index, p] of unmatched.entries()) {
        // Prepare search term. For "Abanicos | 2D | Curva B | 0.15 | 12 mm", "Abanicos 2D" is enough.
        // We'll strip special chars and take first 2 or 3 words if it's too long
        let query = p.name;
        if (query.includes('|')) {
            const parts = query.split('|').map(x => x.trim());
            query = parts[0] + ' ' + parts[1]; // e.g. "Abanicos 2D"
        }

        // Remove "Curva X" etc
        query = query.replace(/Curva [A-Z]/ig, '').replace(/[0-9.]+\s*mm/ig, '').trim();

        const searchUrl = `https://www.jdenis.com/search/?q=${encodeURIComponent(query)}`;
        console.log(`[${index + 1}/${unmatched.length}] Searching: ${query} (Original: ${p.name})`);

        try {
            const res = await fetch(searchUrl);
            const html = await res.text();

            // Find the first product link in the search results
            // Tiendanube items inside search usually look like: <a href="https://www.jdenis.com/productos/abanicos-2d/" class="item-link"
            const linkMatch = html.match(/href="(https:\/\/www\.jdenis\.com\/productos\/[^"]+)"/i);

            if (linkMatch && linkMatch[1]) {
                const productUrl = linkMatch[1];
                console.log(`  -> Found product listing: ${productUrl}`);

                // Fetch the product page
                const prodRes = await fetch(productUrl);
                const prodHtml = await prodRes.text();

                const imgMatch = prodHtml.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
                if (imgMatch && imgMatch[1]) {
                    let jdenisImageUrl = imgMatch[1].replace('http://', 'https://');
                    const cleanUrl = jdenisImageUrl.split('?')[0];
                    const cleanCurrent = p.image_url ? p.image_url.split('?')[0] : '';

                    if (cleanUrl !== cleanCurrent) {
                        console.log(`  -> ✨ Updating image to: ${cleanUrl}`);
                        await supabase.from('products').update({ image_url: cleanUrl }).eq('id', p.id);
                        updatedCount++;
                    } else {
                        console.log(`  -> ⏭️ Image already matched.`);
                    }
                } else {
                    console.log(`  -> ⚠️ No og:image found on product page.`);
                }
            } else {
                console.log(`  -> ⚠️ No search results found.`);
            }
        } catch (e) {
            console.error(`  -> ❌ Search Error: ${e.message}`);
        }
        await delay(300);
    }

    console.log(`\\n--- DEEP SEARCH COMPLETE ---`);
    console.log(`Successfully extracted and updated ${updatedCount} images.`);
}

run();
