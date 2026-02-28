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

async function syncGroups() {
    const { data: groups } = await supabase.from('variant_groups').select('*, product_variants(*)');
    const { data: products } = await supabase.from('products').select('id, name, image_url');

    let updatedCount = 0;

    for (const group of groups) {
        if (!group.product_variants || group.product_variants.length === 0) continue;

        const groupProducts = group.product_variants.map(v => products.find(p => p.id === v.product_id)).filter(Boolean);

        // Find the "best" image. Og images have format like "-640-0.webp". The legacy ones might not.
        const highResProduct = groupProducts.find(p => p.image_url && p.image_url.includes('-640-0.webp')) || groupProducts[0];

        if (highResProduct && highResProduct.image_url) {
            console.log(`Group: ${group.name} -> Best image found: ${highResProduct.image_url}`);
            const needsUpdate = groupProducts.filter(p => p.image_url !== highResProduct.image_url);

            for (const p of needsUpdate) {
                console.log(`  -> Syncing variant: ${p.name}`);
                await supabase.from('products').update({ image_url: highResProduct.image_url }).eq('id', p.id);
                updatedCount++;
            }
        }
    }
    console.log(`\\n--- COMPLETE ---`);
    console.log(`Successfully synced ${updatedCount} child variant images across the variant groups.`);
}

syncGroups();
