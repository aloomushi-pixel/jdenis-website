import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import fs from 'fs';

// We need SUPABASE_URL and SUPABASE_ANON_KEY from env or we can pass it
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkImages() {
    const { data: products, error } = await supabase.from('products').select('id, name, image');
    if (error) {
        console.error("Supabase error:", error);
        process.exit(1);
    }

    let brokenLinks = 0;
    console.log(`Checking ${products.length} products...`);

    for (const product of products) {
        if (!product.image) {
            console.log(`[WARN] Product length has no image: ${product.name} (${product.id})`);
            brokenLinks++;
            continue;
        }

        // Some are relative URLs (e.g. /products/...)
        let url = product.image;
        if (url.startsWith('/')) {
            url = `http://localhost:5173${url}`; // Or target the public store URL
            // It's harder to test local assets if the server isn't running. We can check if file exists.
            const path = `../website/public${product.image}`;
            if (!fs.existsSync(path)) {
                console.log(`[ERROR] Local image missing: ${path} for ${product.name} (${product.id})`);
                brokenLinks++;
            }
        } else {
            try {
                const res = await fetch(url, { method: 'HEAD', timeout: 5000 });
                if (!res.ok) {
                    console.log(`[ERROR] Broken link (${res.status}): ${url} for ${product.name} (${product.id})`);
                    brokenLinks++;
                }
            } catch (e) {
                console.log(`[ERROR] Failed to fetch: ${url} for ${product.name} (${product.id}) - ${e.message}`);
                brokenLinks++;
            }
        }
    }
    console.log(`Finished checking. Total broken links: ${brokenLinks}`);
}

checkImages();
