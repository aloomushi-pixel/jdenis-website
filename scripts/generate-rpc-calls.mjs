/**
 * Split JSON batches into smaller 25-product chunks for MCP execution
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const batchDir = resolve(__dirname, 'json-batches');
const outDir = resolve(__dirname, 'rpc-calls');
mkdirSync(outDir, { recursive: true });

const batchFiles = readdirSync(batchDir).filter(f => f.startsWith('batch_') && f.endsWith('.json')).sort();

let callIdx = 1;
for (const bf of batchFiles) {
    const products = JSON.parse(readFileSync(resolve(batchDir, bf), 'utf-8'));
    // Split into chunks of 25
    const CHUNK = 25;
    for (let i = 0; i < products.length; i += CHUNK) {
        const chunk = products.slice(i, i + CHUNK);
        const json = JSON.stringify(chunk);
        const escaped = json.replace(/'/g, "''");
        const sql = `SELECT bulk_upsert_products('${escaped}'::jsonb);`;
        const fname = `rpc_${String(callIdx).padStart(2, '0')}.sql`;
        writeFileSync(resolve(outDir, fname), sql, 'utf-8');
        console.log(`${fname}: ${chunk.length} products, ${(sql.length / 1024).toFixed(1)}KB`);
        callIdx++;
    }
}

console.log(`\n✅ Generated ${callIdx - 1} RPC call files in scripts/rpc-calls/`);
