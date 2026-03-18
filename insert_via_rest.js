const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  try {
    const missing = JSON.parse(fs.readFileSync('missing_products.json', 'utf8'));
    console.log(`Loaded ${missing.length} missing products.`);

    const records = missing.map(row => {
      const keys = Object.keys(row);
      const slugKey = keys.find(k => k.startsWith('tiendanube-')) || keys[0];
      const id = row[slugKey] ? row[slugKey].toString().trim() : `prod-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;
      let slug = id;
      slug = slug + '-' + Math.random().toString(36).substr(2, 5);
      const name = row['__EMPTY'] ? row['__EMPTY'].toString().trim() : 'Sin nombre';
      const category = row['__EMPTY_1'] ? row['__EMPTY_1'].toString().split('>')[0].trim() : 'General';
      const price = parseFloat(row['__EMPTY_8']) || 0;
      const compareAt = parseFloat(row['__EMPTY_9']) || null;
      const stock = parseInt(row['__EMPTY_14']) || 0;
      const sku = row['__EMPTY_15'] ? row['__EMPTY_15'].toString().trim() : null;
      const description = row['__EMPTY_19'] ? row['__EMPTY_19'].toString().trim() : '';

      return {
        id,
        name,
        slug,
        category,
        price,
        compare_at_price: compareAt,
        stock,
        sku,
        description,
        is_active: true,
        is_featured: false,
        gallery: []
      };
    });

    // Deduplicate records by id
    const uniqueRecordsMap = new Map();
    records.forEach(r => uniqueRecordsMap.set(r.id, r));
    const uniqueRecords = Array.from(uniqueRecordsMap.values());

    console.log(`Deduplicated to ${uniqueRecords.length} unique products.`);
    console.log('Inserting into Supabase...');
    
    // We can insert 50 at a time to be safe
    const chunkSize = 50;
    for (let i = 0; i < uniqueRecords.length; i += chunkSize) {
      const chunk = uniqueRecords.slice(i, i + chunkSize);
      const { data, error } = await supabase
        .from('products')
        .upsert(chunk, { onConflict: 'id' });

      if (error) {
        console.error(`Error inserting chunk ${i/chunkSize}:`, error.message);
      } else {
        console.log(`Successfully inserted chunk ${i/chunkSize} (${chunk.length} items)`);
      }
    }
    
    console.log('Done.');

  } catch (err) {
    console.error('Script Error:', err);
  }
}

main();
