/**
 * Applies all SQL batch files to Supabase using the pg REST endpoint.
 * Uses the Supabase Management API via the service_role key.
 * 
 * Usage: node scripts/apply-batches-rest.mjs
 */
import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const batchDir = resolve(__dirname, 'batches');

const SUPABASE_URL = 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';

// We need the service_role key to execute raw SQL via postgREST
// Alternatively, use the pg pooler connection string
// Let's use MCP approach - output each file content for piping

// Get all batch files sorted
const files = readdirSync(batchDir).filter(f => f.endsWith('.sql')).sort();
console.log(`Found ${files.length} batch files:`);
files.forEach(f => {
    const size = readFileSync(resolve(batchDir, f), 'utf-8').length;
    console.log(`  ${f} (${(size / 1024).toFixed(1)}KB)`);
});

// Since we can't use the REST API with anon key for raw SQL,
// and the pg module may not be installed, let's use an alternative:
// Create a combined SQL file that can be copy-pasted into the SQL Editor

const outputFile = resolve(__dirname, 'combined-seed.sql');
let combined = '';
for (const f of files) {
    combined += `-- ===== ${f} =====\n`;
    combined += readFileSync(resolve(batchDir, f), 'utf-8');
    combined += '\n\n';
}

import { writeFileSync } from 'fs';
writeFileSync(outputFile, combined, 'utf-8');
console.log(`\nCombined SQL written to: scripts/combined-seed.sql (${(combined.length / 1024).toFixed(1)}KB)`);
console.log('You can paste this into the Supabase SQL Editor to apply all batches at once.');
