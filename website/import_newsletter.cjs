const fs = require('fs');
const https = require('https');

const PROJECT_ID = 'kxoitidsrfeqxwvxjwsd';
const batches = JSON.parse(fs.readFileSync('newsletter_batches.json', 'utf-8'));

// We'll use the Supabase REST API directly with the service role or anon key
// But since RLS blocks anon inserts for 'import' source, let's use the SQL approach
// via the Supabase client with the anon key - but INSERT policy allows all inserts

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://kxoitidsrfeqxwvxjwsd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4b2l0aWRzcmZlcXh3dnhqd3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMDk1NzMsImV4cCI6MjA4OTY4NTU3M30._Wvl1H6c2lMIMANP4D3QARvPOnBRtTaDBgoaG856S2Y'
);

async function run() {
    console.log('Starting import of', batches.length, 'batches...');
    
    let totalInserted = 0;
    let errors = 0;
    
    for (let i = 0; i < batches.length; i++) {
        // Parse VALUES from the SQL to get records as objects
        const sql = batches[i];
        
        // Extract values between VALUES and ON CONFLICT
        const valuesMatch = sql.match(/VALUES\n([\s\S]+)\nON CONFLICT/);
        if (!valuesMatch) {
            console.log('Batch', i, ': could not parse');
            errors++;
            continue;
        }
        
        const valueRows = valuesMatch[1].split(/\),\n\(/);
        const records = valueRows.map(row => {
            // Clean up parentheses
            let clean = row.replace(/^\(/, '').replace(/\)$/, '');
            
            // Split by comma but respect quotes
            const parts = [];
            let current = '';
            let inQuote = false;
            for (let c = 0; c < clean.length; c++) {
                if (clean[c] === "'" && (c === 0 || clean[c-1] !== "'")) {
                    inQuote = !inQuote;
                    current += clean[c];
                } else if (clean[c] === ',' && !inQuote) {
                    parts.push(current.trim());
                    current = '';
                } else {
                    current += clean[c];
                }
            }
            parts.push(current.trim());
            
            const unquote = (v) => {
                if (v == null) return null;
                if (typeof v !== 'string') return v;
                if (v === 'NULL' || v === 'null') return null;
                if (v === 'true') return true;
                if (v === 'false') return false;
                if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1).replace(/''/g, "'");
                if (!isNaN(v) && v.trim() !== '') return parseFloat(v);
                return v;
            };
            
            return {
                email: unquote(parts[0]),
                name: unquote(parts[1]),
                phone: unquote(parts[2]),
                city: unquote(parts[3]),
                state: unquote(parts[4]),
                country: unquote(parts[5]),
                source: unquote(parts[6]),
                total_spent: unquote(parts[7]),
                purchase_count: unquote(parts[8]),
                is_active: unquote(parts[9])
            };
        });
        
        const { error } = await supabase
            .from('newsletter_subscribers')
            .upsert(records, { onConflict: 'email', ignoreDuplicates: true });
        
        if (error) {
            console.error('Batch error:', i, error);
            errors++;
        } else {
            totalInserted += records.length;
            if (i % 5 === 0) console.log('Batch', i, '/', batches.length, '- upserted', records.length);
        }
    }
    
    console.log('\nDone! Total inserted:', totalInserted, '| Errors:', errors);
    
    const { count } = await supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true });
    console.log('Total in DB:', count);
}

run().catch(e => console.error('Fatal:', e));
