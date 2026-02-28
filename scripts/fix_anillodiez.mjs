import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../website/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("Extracting correct Anillo Diez Image URL from sitemap...");
    const t = fs.readFileSync('sitemap.xml', 'utf8');
    const m = t.split('<url>');
    const d = m.filter(x => x.includes('anillodiez'));

    let goodImage = '';
    d.forEach(block => {
        const img = block.match(/<image:loc>([^<]+)/)?.[1];
        if (img && !goodImage) {
            goodImage = img;
        }
    });

    if (!goodImage) {
        console.error("Could not find image in sitemap!");
        return;
    }

    console.log("Found High-Res Image:", goodImage);
    const productId = 'fc5ea8d1-19e6-4667-8183-503096a3176f';

    console.log(`Patching product ${productId} in Supabase...`);
    const { data, error } = await supabase.from('products').update({ image_url: goodImage }).eq('id', productId);

    if (error) {
        console.error("Supabase error:", error);
    } else {
        console.log("Successfully patched product.");
    }
}

run();
