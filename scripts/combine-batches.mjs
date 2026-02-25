/**
 * Apply all micro-batch SQL files using Supabase.rpc('exec_sql')
 * Since we can't use pg directly, we'll use fetch to the Supabase REST SQL endpoint.
 * 
 * The Supabase project has a database pooler at:
 * https://vqcjxzsibywdxpvkyysa.supabase.co
 * 
 * We'll use the service_role key approach via the management API.
 * OR simply read each file and post to the SQL execution endpoint.
 */
import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const batchDir = resolve(__dirname, 'micro-batches');

// Get all SQL files sorted
const files = readdirSync(batchDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

console.log(`Found ${files.length} batch files to apply.\n`);

// Combine all product files into one big SQL
const productFiles = files.filter(f => f.startsWith('p'));
const otherFiles = files.filter(f => !f.startsWith('p'));

let combinedSQL = '';
for (const f of productFiles) {
    combinedSQL += readFileSync(resolve(batchDir, f), 'utf-8') + '\n';
}

console.log(`Combined product SQL: ${(combinedSQL.length / 1024).toFixed(1)}KB`);
console.log(`Product files: ${productFiles.length}`);
console.log(`Other files: ${otherFiles.map(f => f).join(', ')}`);

// Output combined SQL to stdout for piping
// Actually, let's just write it to a file and give instructions
const outputPath = resolve(__dirname, 'all-products.sql');
import { writeFileSync } from 'fs';
writeFileSync(outputPath, combinedSQL, 'utf-8');

// Also combine variants
if (otherFiles.includes('variants.sql')) {
    const variantsSQL = readFileSync(resolve(batchDir, 'variants.sql'), 'utf-8');
    writeFileSync(resolve(__dirname, 'all-variants.sql'), variantsSQL, 'utf-8');
    console.log(`Variants SQL: ${(variantsSQL.length / 1024).toFixed(1)}KB`);
}

if (otherFiles.includes('bestsellers.sql')) {
    const bestsellersSQL = readFileSync(resolve(batchDir, 'bestsellers.sql'), 'utf-8');
    writeFileSync(resolve(__dirname, 'all-bestsellers.sql'), bestsellersSQL, 'utf-8');
    console.log(`Bestsellers SQL: ${(bestsellersSQL.length / 1024).toFixed(1)}KB`);
}

console.log(`\n✅ Combined files written to:`);
console.log(`   scripts/all-products.sql`);
console.log(`   scripts/all-variants.sql`);
console.log(`   scripts/all-bestsellers.sql`);
console.log(`\nTotal product lines (INSERT statements): ${combinedSQL.split('\n').filter(l => l.trim()).length}`);
