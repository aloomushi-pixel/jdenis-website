/**
 * Generate JSON product data files for bulk_upsert_products RPC calls.
 * Splits products into JSON batches of 50 for the Supabase RPC function.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const productsFile = resolve(__dirname, '..', 'website', 'src', 'data', 'products.ts');
const raw = readFileSync(productsFile, 'utf-8');

const productsMatch = raw.match(/export\s+const\s+products\s*:\s*Product\[\]\s*=\s*\[([\s\S]*?)\n\];\s*\n/);
if (!productsMatch) { console.error('Could not find products array'); process.exit(1); }
const productsArray = eval(`[${productsMatch[1]}]`);

// Map to database column format
const dbProducts = productsArray.map(p => ({
    slug: p.id,
    name: p.name,
    price: p.price,
    compare_at_price: p.originalPrice || null,
    image_url: p.image || null,
    category: p.category,
    is_featured: p.isFeatured || false,
    description: p.description || null,
    benefits: p.benefits || [],
    includes: p.includes || [],
    performance: p.performance || null,
    specifications: p.specifications || [],
    gallery: p.gallery || [],
    video: p.video || null,
    related_categories: p.relatedCategories || [],
    original_price: p.originalPrice || null,
    distributor_price: p.distributorPrice || null,
    promotion: p.promotion || null
}));

console.log(`Total products: ${dbProducts.length}`);

// Split into batches of 50
const BATCH = 50;
const outDir = resolve(__dirname, 'json-batches');
mkdirSync(outDir, { recursive: true });

const totalBatches = Math.ceil(dbProducts.length / BATCH);
for (let i = 0; i < totalBatches; i++) {
    const batch = dbProducts.slice(i * BATCH, (i + 1) * BATCH);
    const json = JSON.stringify(batch);
    const path = resolve(outDir, `batch_${String(i + 1).padStart(2, '0')}.json`);
    writeFileSync(path, json, 'utf-8');
    console.log(`  batch_${String(i + 1).padStart(2, '0')}.json: ${batch.length} products, ${(json.length / 1024).toFixed(1)}KB`);
}

// Also generate the SQL call for each batch
for (let i = 0; i < totalBatches; i++) {
    const batch = dbProducts.slice(i * BATCH, (i + 1) * BATCH);
    const json = JSON.stringify(batch);
    const sql = `SELECT bulk_upsert_products('${json.replace(/'/g, "''")}'::jsonb);`;
    const path = resolve(outDir, `call_${String(i + 1).padStart(2, '0')}.sql`);
    writeFileSync(path, sql, 'utf-8');
    console.log(`  call_${String(i + 1).padStart(2, '0')}.sql: ${(sql.length / 1024).toFixed(1)}KB`);
}

console.log(`\n✅ Generated ${totalBatches} JSON batches and SQL calls in scripts/json-batches/`);
