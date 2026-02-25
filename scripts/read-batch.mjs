/**
 * Reads batch files content and outputs them as JSON for MCP consumption.
 * Usage: node scripts/read-batch.mjs <batch_number>
 */
import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const batchDir = resolve(__dirname, 'batches');

const arg = process.argv[2];

if (arg === 'list') {
    const files = readdirSync(batchDir).filter(f => f.endsWith('.sql')).sort();
    console.log(JSON.stringify(files));
} else {
    const content = readFileSync(resolve(batchDir, arg), 'utf-8');
    // Output the raw SQL — use process.stdout.write to preserve encoding
    process.stdout.write(content);
}
