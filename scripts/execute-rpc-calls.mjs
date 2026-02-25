/**
 * Use Supabase REST API to execute SQL with proper UTF-8 encoding.
 * Uses the management API token to execute SQL queries.
 */
import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rpcDir = resolve(__dirname, 'rpc-calls');

// Read all rpc files
const files = readdirSync(rpcDir)
    .filter(f => f.startsWith('rpc_') && f.endsWith('.sql'))
    .sort();

console.log(`Found ${files.length} RPC call files to execute.`);

// Read the Supabase project URL and keys
const SUPABASE_URL = 'https://vqcjxzsibywdxpvkyysa.supabase.co';

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';

// Execute each file via the Supabase PostgREST RPC endpoint
async function executeRPC(filename) {
    const sql = readFileSync(resolve(rpcDir, filename), 'utf-8');

    // Extract the JSON from the SQL: SELECT bulk_upsert_products('...'::jsonb);
    const jsonMatch = sql.match(/SELECT bulk_upsert_products\('(.+)'::jsonb\);/s);
    if (!jsonMatch) {
        console.error(`${filename}: Could not extract JSON`);
        return false;
    }

    // Unescape the doubled quotes
    const jsonStr = jsonMatch[1].replace(/''/g, "'");

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/bulk_upsert_products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ products_json: JSON.parse(jsonStr) })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`${filename}: HTTP ${response.status} - ${errText}`);
            return false;
        }

        const result = await response.json();
        console.log(`✅ ${filename}: ${result} products upserted`);
        return true;
    } catch (e) {
        console.error(`${filename}: ${e.message}`);
        return false;
    }
}

// Execute sequentially to avoid overwhelming the server
async function main() {
    let success = 0;
    let fail = 0;

    for (const f of files) {
        const ok = await executeRPC(f);
        if (ok) success++; else fail++;
    }

    console.log(`\n📊 Results: ${success} succeeded, ${fail} failed out of ${files.length} total`);
}

main();
