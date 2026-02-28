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

async function check() {
    const { data: products } = await supabase.from('products').select('id, name, slug, image_url').eq('is_active', true);

    // We consider it "unmatched" if it does not have a mitiendanube high-res URL.
    const unmatched = products.filter(p => !p.image_url || !p.image_url.includes('mitiendanube.com'));

    let out = `Total Unmatched: ${unmatched.length}\n\n`;
    for (const u of unmatched) {
        out += `- ${u.name}\n`;
    }

    fs.writeFileSync(path.join(__dirname, 'unmatched_report.txt'), out);
    console.log(`Report written. Found ${unmatched.length} unmatched products.`);
}

check();
