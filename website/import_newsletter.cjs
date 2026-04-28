const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

// Proyecto de PRODUCCIÓN correcto (zdciwzeokkrwcxvsgusc)
const supabase = createClient(
    'https://zdciwzeokkrwcxvsgusc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2l3emVva2tyd2N4dnNndXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTM3NTksImV4cCI6MjA4ODIyOTc1OX0.qbXG0M2Zsjz-rOXY0CgAV2RfLledS67nqBw_dnvzkbg'
);

async function importNewsletter() {
    const wb = XLSX.readFile('C:\\Users\\info\\Downloads\\Clientes News Letter.xlsx');
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
    
    // Build unique records
    const seenEmails = new Set();
    const records = [];
    
    for (let i = 2; i < rows.length; i++) {
        const row = rows[i];
        const email = (row[1] || '').toString().toLowerCase().trim();
        if (!email || seenEmails.has(email)) continue;
        seenEmails.add(email);
        
        records.push({
            email,
            name: (row[0] || '').toString().trim() || null,
            phone: row[2] ? row[2].toString().trim() : null,
            city: (row[8] || '').toString().trim() || null,
            state: (row[10] || '').toString().trim() || null,
            country: (row[12] || 'México').toString().trim(),
            source: 'import',
            total_spent: parseFloat(row[13]) || 0,
            purchase_count: parseInt(row[14]) || 0,
            is_active: true
        });
    }
    
    console.log(`Total unique records to import: ${records.length}`);
    
    // Use UPSERT to avoid duplicate errors - much faster!
    const BATCH = 200;
    let processed = 0;
    let errors = 0;
    
    for (let i = 0; i < records.length; i += BATCH) {
        const batch = records.slice(i, i + BATCH);
        
        const { error } = await supabase
            .from('newsletter_subscribers')
            .upsert(batch, { onConflict: 'email', ignoreDuplicates: true });
        
        if (error) {
            errors++;
            console.error(`  Batch ${Math.floor(i/BATCH)} error:`, error.message);
        } else {
            processed += batch.length;
        }
        
        if ((i / BATCH) % 5 === 0) {
            console.log(`Progress: ${Math.min(i + BATCH, records.length)}/${records.length} | Processed: ${processed} | Batch Errors: ${errors}`);
        }
    }
    
    console.log(`\n=== IMPORT COMPLETE ===`);
    console.log(`Processed: ${processed}`);
    console.log(`Batch errors: ${errors}`);
    
    // Final count
    const { count } = await supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true });
    console.log(`Total records in DB: ${count}`);
}

importNewsletter().catch(e => console.error('Fatal:', e.message));
