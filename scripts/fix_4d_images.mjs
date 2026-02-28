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
    console.log("Extracting correct Abanicos 4D Image URL from sitemap...");
    const t = fs.readFileSync('sitemap.xml', 'utf8');
    const m = t.split('<url>');
    const d4d = m.filter(x => x.includes('dimensional-4d'));

    let goodImage = '';
    d4d.forEach(block => {
        const img = block.match(/<image:loc>([^<]+)/)?.[1];
        if (img && !goodImage) {
            goodImage = img;
        }
    });

    if (!goodImage) {
        console.error("Could not find image in sitemap!");
        return;
    }

    // Tiendanube sitemap outputs 1024-1024.webp. We want 640-0.webp for consistency if possible, but 1024 is fine.
    console.log("Found High-Res Image:", goodImage);

    console.log("Patching 'Abanicos 4D' variants in Supabase...");

    const { data: prods, error } = await supabase.from('products')
        .select('id, name')
        .ilike('name', '%Abanicos | 4D%');

    if (error) {
        console.error("Supabase error:", error);
        return;
    }

    console.log(`Found ${prods.length} products to patch.`);
    for (const p of prods) {
        await supabase.from('products').update({ image_url: goodImage }).eq('id', p.id);
        console.log(` -> Patched ${p.name}`);
    }
    console.log("Done.");
}

run();
