const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  try {
    // 1. Fetch all existing products from DB
    console.log('Fetching products from database...');
    let allDbProducts = [];
    let page = 0;
    const pageSize = 1000;
    
    while (true) {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, slug')
        .range(page * pageSize, (page + 1) * pageSize - 1);
        
      if (error) throw error;
      if (!data || data.length === 0) break;
      allDbProducts = allDbProducts.concat(data);
      page++;
    }
    
    console.log(`Fetched ${allDbProducts.length} products from database.`);
    
    // Create lookup maps
    const dbByName = new Map();
    const dbById = new Map();
    const dbBySlug = new Map();
    
    for (const p of allDbProducts) {
      if (p.name) dbByName.set(p.name.trim().toLowerCase(), p);
      if (p.id) dbById.set(p.id.trim().toLowerCase(), p);
      if (p.slug) dbBySlug.set(p.slug.trim().toLowerCase(), p);
    }

    // 2. Read Excel Data
    console.log('Reading Excel data...');
    const excelData = JSON.parse(fs.readFileSync('output2.json', 'utf8'));
    const itemsToProcess = excelData[0]["__EMPTY"] === "Nombre" ? excelData.slice(1) : excelData;
    
    console.log(`Processing ${itemsToProcess.length} rows from Excel...`);
    
    const updatesMap = new Map(); // id -> stock

    for (const row of itemsToProcess) {
      const keys = Object.keys(row);
      const slugKey = keys.find(k => k.startsWith('tiendanube-')) || keys[0];
      const excelSlug = (row[slugKey] || '').toString().trim().toLowerCase();
      const excelName = (row['__EMPTY'] || '').toString().trim().toLowerCase();
      
      const stockVal = row['__EMPTY_14'];
      let stock = 0;
      if (stockVal !== undefined && stockVal !== null) {
        stock = parseInt(stockVal.toString().replace(/,/g, ''), 10) || 0;
      }
      
      // Match strategy:
      let matchedDbItem = null;
      if (dbByName.has(excelName)) {
        matchedDbItem = dbByName.get(excelName);
      } else if (dbById.has(excelSlug)) {
        matchedDbItem = dbById.get(excelSlug);
      } else if (dbBySlug.has(excelSlug)) {
        matchedDbItem = dbBySlug.get(excelSlug);
      }
      
      if (matchedDbItem) {
        updatesMap.set(matchedDbItem.id, stock);
      }
    }
    
    const updates = Array.from(updatesMap.entries()).map(([id, stock]) => ({ id, stock }));
    console.log(`Found ${updates.length} products to update stock.`);
    
    // 3. Apply updates in chunks
    console.log('Applying stock updates to database...');
    let successCount = 0;
    let errorCount = 0;
    
    const chunkSize = 20; // smaller chunks for parallel updates
    for (let i = 0; i < updates.length; i += chunkSize) {
      const chunk = updates.slice(i, i + chunkSize);
      const promises = chunk.map(update => {
        return supabase
          .from('products')
          .update({ stock: update.stock })
          .eq('id', update.id);
      });
      
      const results = await Promise.all(promises);
      for (const res of results) {
        if (res.error) {
          errorCount++;
          console.error('Update error:', res.error.message);
        } else {
          successCount++;
        }
      }
      process.stdout.write(`\rProgress: ${Math.min(i + chunkSize, updates.length)} / ${updates.length}`);
    }
    
    console.log(`\n\nStock update complete. Success: ${successCount}, Errors: ${errorCount}`);

  } catch (err) {
    console.error('Script Error:', err);
  }
}

main();
