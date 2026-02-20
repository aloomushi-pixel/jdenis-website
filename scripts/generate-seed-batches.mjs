/**
 * Reads data/products.ts and applies product data directly
 * to Supabase via individual SQL chunks written to separate files.
 * 
 * Usage: node scripts/generate-seed-batches.mjs
 * Output: scripts/batches/batch_*.sql
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const productsFile = resolve(__dirname, '..', 'website', 'src', 'data', 'products.ts');

// Read and parse
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

// Generate one INSERT ON CONFLICT per product
function productSQL(p) {
    const updates = [];
    if (p.description) updates.push(`description = ${esc(p.description)}`);
    if (p.image) updates.push(`image_url = ${esc(p.image)}`);
    if (p.benefits?.length) updates.push(`benefits = ${arrLit(p.benefits)}`);
    if (p.includes?.length) updates.push(`includes = ${arrLit(p.includes)}`);
    if (p.performance) updates.push(`performance = ${esc(p.performance)}`);
    if (p.specifications?.length) updates.push(`specifications = ${arrLit(p.specifications)}`);
    if (p.gallery?.length) updates.push(`gallery = ${arrLit(p.gallery)}`);
    if (p.video) updates.push(`video = ${esc(p.video)}`);
    if (p.relatedCategories?.length) updates.push(`related_categories = ${arrLit(p.relatedCategories)}`);
    if (p.originalPrice) updates.push(`original_price = ${p.originalPrice}`);
    if (p.distributorPrice) updates.push(`distributor_price = ${p.distributorPrice}`);
    if (p.promotion) updates.push(`promotion = ${esc(p.promotion)}`);
    // Always update basic fields too
    updates.push(`name = ${esc(p.name)}`);
    updates.push(`price = ${p.price}`);
    updates.push(`category = ${esc(p.category)}`);
    if (p.originalPrice) updates.push(`compare_at_price = ${p.originalPrice}`);
    if (p.isFeatured) updates.push(`is_featured = true`);

    return `INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (${esc(p.id)}, ${esc(p.name)}, ${p.price}, ${p.originalPrice || 'NULL'}, ${p.image ? esc(p.image) : 'NULL'}, ${esc(p.category)}, ${p.isFeatured ? 'true' : 'false'}, ${p.description ? esc(p.description) : 'NULL'}, ${p.benefits ? arrLit(p.benefits) : "'{}'"}, ${p.includes ? arrLit(p.includes) : "'{}'"}, ${p.performance ? esc(p.performance) : 'NULL'}, ${p.specifications ? arrLit(p.specifications) : "'{}'"}, ${p.gallery ? arrLit(p.gallery) : "'{}'"}, ${p.video ? esc(p.video) : 'NULL'}, ${p.relatedCategories ? arrLit(p.relatedCategories) : "'{}'"}, ${p.originalPrice || 'NULL'}, ${p.distributorPrice || 'NULL'}, ${p.promotion ? esc(p.promotion) : 'NULL'})
ON CONFLICT (slug) DO UPDATE SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP;`;
}

// Split products into batches of 25
const BATCH_SIZE = 25;
const batchDir = resolve(__dirname, 'batches');
mkdirSync(batchDir, { recursive: true });

const totalBatches = Math.ceil(productsArray.length / BATCH_SIZE);
for (let i = 0; i < totalBatches; i++) {
    const batch = productsArray.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
    const sql = batch.map(p => productSQL(p)).join('\n\n');
    const path = resolve(batchDir, `batch_${String(i + 1).padStart(2, '0')}_products.sql`);
    writeFileSync(path, sql, 'utf-8');
}
console.log(`Generated ${totalBatches} product batches in scripts/batches/`);

// Variant groups batch
if (variantGroups.length > 0) {
    let vgSql = `DELETE FROM product_variants;\nDELETE FROM variant_groups;\n\n`;
    for (const vg of variantGroups) {
        const attrJson = JSON.stringify(vg.attributeNames).replace(/'/g, "''");
        vgSql += `INSERT INTO variant_groups (name, attribute_names) VALUES (${esc(vg.parentName)}, '${attrJson}'::jsonb);\n`;
    }
    vgSql += `\n`;
    for (const vg of variantGroups) {
        for (const v of vg.variants) {
            const attrJson = JSON.stringify(v.attributes).replace(/'/g, "''");
            vgSql += `INSERT INTO product_variants (group_id, product_id, attributes) VALUES ((SELECT id FROM variant_groups WHERE name = ${esc(vg.parentName)} LIMIT 1), ${esc(v.productId)}, '${attrJson}'::jsonb);\n`;
        }
    }
    writeFileSync(resolve(batchDir, 'batch_variants.sql'), vgSql, 'utf-8');
    console.log('Generated variant groups batch');
}

// Bestsellers batch
if (bestsellersIds.length > 0) {
    const slugList = bestsellersIds.map(id => esc(id)).join(', ');
    writeFileSync(resolve(batchDir, 'batch_bestsellers.sql'), `UPDATE products SET is_featured = true WHERE slug IN (${slugList});`, 'utf-8');
    console.log('Generated bestsellers batch');
}

console.log('\n✅ All batches ready. Apply them in order.');
