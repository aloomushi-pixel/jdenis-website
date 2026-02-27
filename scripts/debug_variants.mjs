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

async function check() {
    const { data: groups, error: err1 } = await supabase.from('variant_groups').select('*');
    const { data: variants, error: err2 } = await supabase.from('product_variants').select('*');
    const { data: products, error: err3 } = await supabase.from('products').select('id, name').limit(15);

    console.log('Groups fetch err:', err1?.message, 'count:', groups?.length);
    console.log('Variants fetch err:', err2?.message, 'count:', variants?.length);

    // Pick 'Abanicos | 2D' from products
    const abanicos = products.filter(p => p.name.includes('Abanicos | 2D'));
    console.log('Sample Abanicos 2D UUIDs:', abanicos);

    // Are these UUIDs in variants?
    abanicos.forEach(a => {
        const v = variants.find(v => v.product_id === a.id);
        console.log(`Product ${a.id} "${a.name}" found in variants? ${!!v}`);
    });
}
check();
