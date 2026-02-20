/**
 * Generate compact SQL batches using EXCLUDED syntax for ON CONFLICT.
 * This generates much shorter SQL per product.
 * 
 * Usage: node scripts/generate-compact-batches.mjs
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

const variantMatch = raw.match(/export\s+const\s+variantGroups\s*:\s*VariantGroup\[\]\s*=\s*\[([\s\S]*?)\n\];\s*\n/);
let variantGroups = [];
if (variantMatch) variantGroups = eval(`[${variantMatch[1]}]`);

const bestsellersMatch = raw.match(/const\s+bestsellersIds\s*=\s*\[([\s\S]*?)\];/);
let bestsellersIds = [];
if (bestsellersMatch) bestsellersIds = eval(`[${bestsellersMatch[1]}]`);

console.log(`Products: ${productsArray.length} | VarGroups: ${variantGroups.length} | Bestsellers: ${bestsellersIds.length}`);

function esc(val) {
    if (val === null || val === undefined) return 'NULL';
    return `'${String(val).replace(/'/g, "''")}'`;
}
function arrLit(arr) {
    if (!arr || arr.length === 0) return "'{}'";
    const items = arr.map(v => `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "''")}"`).join(',');
    return `'{${items}}'`;
}

// Generate compact INSERT using EXCLUDED for ON CONFLICT
const COLS = 'slug,name,price,compare_at_price,image_url,category,is_featured,description,benefits,includes,performance,specifications,gallery,video,related_categories,original_price,distributor_price,promotion';
const UPDATE_COLS = COLS.split(',').filter(c => c !== 'slug').map(c => `${c}=EXCLUDED.${c}`).join(',');
const ON_CONFLICT = `ON CONFLICT(slug) DO UPDATE SET ${UPDATE_COLS},updated_at=CURRENT_TIMESTAMP`;

function productSQL(p) {
    return `INSERT INTO products(${COLS}) VALUES(${esc(p.id)},${esc(p.name)},${p.price},${p.originalPrice || 'NULL'},${p.image ? esc(p.image) : 'NULL'},${esc(p.category)},${p.isFeatured ? 'true' : 'false'},${p.description ? esc(p.description) : 'NULL'},${p.benefits ? arrLit(p.benefits) : "'{}'"},${p.includes ? arrLit(p.includes) : "'{}'"},${p.performance ? esc(p.performance) : 'NULL'},${p.specifications ? arrLit(p.specifications) : "'{}'"},${p.gallery ? arrLit(p.gallery) : "'{}'"},${p.video ? esc(p.video) : 'NULL'},${p.relatedCategories ? arrLit(p.relatedCategories) : "'{}'"},${p.originalPrice || 'NULL'},${p.distributorPrice || 'NULL'},${p.promotion ? esc(p.promotion) : 'NULL'}) ${ON_CONFLICT};`;
}

// Generate batches of 50 products (compact format allows more per batch)
const BATCH_SIZE = 50;
const batchDir = resolve(__dirname, 'compact-batches');
mkdirSync(batchDir, { recursive: true });

const totalBatches = Math.ceil(productsArray.length / BATCH_SIZE);
for (let i = 0; i < totalBatches; i++) {
    const batch = productsArray.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
    const sql = batch.map(p => productSQL(p)).join('\n');
    const path = resolve(batchDir, `batch_${String(i + 1).padStart(2, '0')}.sql`);
    writeFileSync(path, sql, 'utf-8');
    console.log(`  batch_${String(i + 1).padStart(2, '0')}.sql: ${batch.length} products, ${(sql.length / 1024).toFixed(1)}KB`);
}

// Variant groups
if (variantGroups.length > 0) {
    let vgSql = `DELETE FROM product_variants;\nDELETE FROM variant_groups;\n`;
    for (const vg of variantGroups) {
        const attrJson = JSON.stringify(vg.attributeNames).replace(/'/g, "''");
        vgSql += `INSERT INTO variant_groups(name,attribute_names) VALUES(${esc(vg.parentName)},'${attrJson}'::jsonb);\n`;
    }
    for (const vg of variantGroups) {
        for (const v of vg.variants) {
            const attrJson = JSON.stringify(v.attributes).replace(/'/g, "''");
            vgSql += `INSERT INTO product_variants(group_id,product_id,attributes) VALUES((SELECT id FROM variant_groups WHERE name=${esc(vg.parentName)} LIMIT 1),${esc(v.productId)},'${attrJson}'::jsonb);\n`;
        }
    }
    writeFileSync(resolve(batchDir, 'batch_variants.sql'), vgSql, 'utf-8');
    console.log(`  batch_variants.sql: ${variantGroups.length} groups, ${(vgSql.length / 1024).toFixed(1)}KB`);
}

// Bestsellers
if (bestsellersIds.length > 0) {
    const slugList = bestsellersIds.map(id => esc(id)).join(',');
    writeFileSync(resolve(batchDir, 'batch_bestsellers.sql'), `UPDATE products SET is_featured=true WHERE slug IN(${slugList});`, 'utf-8');
}

console.log(`\n✅ Generated ${totalBatches} compact batches + variants + bestsellers in scripts/compact-batches/`);
