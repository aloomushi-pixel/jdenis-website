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

async function checkMissing() {
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, slug, image_url')
        .eq('is_active', true);

    if (error) {
        console.error(error);
        return;
    }

    // We consider "missing or default" if it's null, empty, or a generic placeholder.
    // Usually the sync script puts Tiendanube CDN URLs: https://acdn-us.mitiendanube.com/...
    // Let's see what URLs exist.
    const missing = products.filter(p => !p.image_url || !p.image_url.includes('mitiendanube.com'));

    console.log(`Found ${missing.length} products without a tiendanube image.`);
    console.log("---");
    missing.forEach(m => console.log(`- ${m.name} (Slug: ${m.slug}) | Current Image: ${m.image_url}`));
    console.log("---");
}

checkMissing();
