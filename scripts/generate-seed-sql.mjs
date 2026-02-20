/**
 * Reads data/products.ts and generates SQL to update
 * existing Supabase products with rich content fields.
 * Also generates INSERT statements for variant_groups and product_variants.
 * 
 * Usage: node scripts/generate-seed-sql.mjs
 * Output: scripts/seed-rich-content.sql
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const productsFile = resolve(__dirname, '..', 'website', 'src', 'data', 'products.ts');

// Read and parse the TS file
const raw = readFileSync(productsFile, 'utf-8');

// --- Extract Products Array ---
// Find the products array between "export const products: Product[] = [" and the matching "];"
const productsMatch = raw.match(/export\s+const\s+products\s*:\s*Product\[\]\s*=\s*\[([\s\S]*?)\n\];\s*\n/);
if (!productsMatch) { console.error('Could not find products array'); process.exit(1); }

// Parse products using a safer approach — eval with minimized risk
// Replace TS-specific syntax
let productsStr = productsMatch[1];
// The data is plain JS object literals, so we can eval it
const productsArray = eval(`[${productsStr}]`);

console.log(`Found ${productsArray.length} products`);

// --- Extract Variant Groups ---
const variantMatch = raw.match(/export\s+const\s+variantGroups\s*:\s*VariantGroup\[\]\s*=\s*\[([\s\S]*?)\n\];\s*\n/);
let variantGroups = [];
if (variantMatch) {
    variantGroups = eval(`[${variantMatch[1]}]`);
    console.log(`Found ${variantGroups.length} variant groups`);
}

// --- Extract Bestseller IDs ---
const bestsellersMatch = raw.match(/const\s+bestsellersIds\s*=\s*\[([\s\S]*?)\];/);
let bestsellersIds = [];
if (bestsellersMatch) {
    bestsellersIds = eval(`[${bestsellersMatch[1]}]`);
    console.log(`Found ${bestsellersIds.length} bestseller IDs`);
}

// --- SQL Escape Helper ---
function esc(val) {
    if (val === null || val === undefined) return 'NULL';
    return `'${String(val).replace(/'/g, "''")}'`;
}

function arrLit(arr) {
    if (!arr || arr.length === 0) return "'{}'";
    const items = arr.map(v => `"${String(v).replace(/"/g, '\\"').replace(/'/g, "''")}"`).join(',');
    return `'{${items}}'`;
}

// --- Generate SQL ---
let sql = `-- Auto-generated seed: Rich content for products table
-- Generated: ${new Date().toISOString()}
-- Source: website/src/data/products.ts
-- Products: ${productsArray.length} | Variant Groups: ${variantGroups.length}

BEGIN;

`;

// 1) UPSERT products with all rich content
for (const p of productsArray) {
    const slug = p.id;
    const updates = [];

    if (p.description) updates.push(`description = ${esc(p.description)}`);
    if (p.image) updates.push(`image_url = ${esc(p.image)}`);
    if (p.benefits && p.benefits.length > 0) updates.push(`benefits = ${arrLit(p.benefits)}`);
    if (p.includes && p.includes.length > 0) updates.push(`includes = ${arrLit(p.includes)}`);
    if (p.performance) updates.push(`performance = ${esc(p.performance)}`);
    if (p.specifications && p.specifications.length > 0) updates.push(`specifications = ${arrLit(p.specifications)}`);
    if (p.gallery && p.gallery.length > 0) updates.push(`gallery = ${arrLit(p.gallery)}`);
    if (p.video) updates.push(`video = ${esc(p.video)}`);
    if (p.relatedCategories && p.relatedCategories.length > 0) updates.push(`related_categories = ${arrLit(p.relatedCategories)}`);
    if (p.originalPrice) updates.push(`original_price = ${p.originalPrice}`);
    if (p.distributorPrice) updates.push(`distributor_price = ${p.distributorPrice}`);
    if (p.promotion) updates.push(`promotion = ${esc(p.promotion)}`);

    if (updates.length === 0) continue;

    // Check if the product exists in Supabase (by slug)
    // Use INSERT ON CONFLICT for products that might not exist yet
    sql += `-- Product: ${p.name}
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  ${esc(slug)},
  ${esc(p.name)},
  ${p.price},
  ${p.originalPrice ? p.originalPrice : 'NULL'},
  ${p.image ? esc(p.image) : 'NULL'},
  ${esc(p.category)},
  ${p.isFeatured ? 'true' : 'false'},
  ${p.description ? esc(p.description) : 'NULL'},
  ${p.benefits ? arrLit(p.benefits) : "'{}'"},
  ${p.includes ? arrLit(p.includes) : "'{}'"},
  ${p.performance ? esc(p.performance) : 'NULL'},
  ${p.specifications ? arrLit(p.specifications) : "'{}'"},
  ${p.gallery ? arrLit(p.gallery) : "'{}'"},
  ${p.video ? esc(p.video) : 'NULL'},
  ${p.relatedCategories ? arrLit(p.relatedCategories) : "'{}'"},
  ${p.originalPrice ? p.originalPrice : 'NULL'},
  ${p.distributorPrice ? p.distributorPrice : 'NULL'},
  ${p.promotion ? esc(p.promotion) : 'NULL'}
)
ON CONFLICT (slug) DO UPDATE SET
  ${updates.join(',\n  ')},
  updated_at = CURRENT_TIMESTAMP;

`;
}

// 2) Mark bestsellers as featured
if (bestsellersIds.length > 0) {
    const slugList = bestsellersIds.map(id => esc(id)).join(', ');
    sql += `-- Mark bestsellers as featured
UPDATE products SET is_featured = true WHERE slug IN (${slugList});

`;
}

// 3) Insert variant groups and their product_variants
if (variantGroups.length > 0) {
    sql += `-- =============================================
-- VARIANT GROUPS AND PRODUCT VARIANTS
-- =============================================

-- Clear existing variant data to re-seed
DELETE FROM product_variants;
DELETE FROM variant_groups;

`;
    for (let i = 0; i < variantGroups.length; i++) {
        const vg = variantGroups[i];
        const attrNamesJson = JSON.stringify(vg.attributeNames).replace(/'/g, "''");

        sql += `-- Variant Group ${i + 1}: ${vg.parentName}
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), ${esc(vg.parentName)}, '${attrNamesJson}'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = ${esc(vg.parentName)} LIMIT 1;
  
`;
        for (const v of vg.variants) {
            const attrsJson = JSON.stringify(v.attributes).replace(/'/g, "''");
            sql += `  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, ${esc(v.productId)}, '${attrsJson}'::jsonb);
`;
        }

        sql += `END $$;

`;
    }
}

sql += `COMMIT;
`;

// Write output
const outPath = resolve(__dirname, 'seed-rich-content.sql');
writeFileSync(outPath, sql, 'utf-8');
console.log(`\n✅ Generated SQL written to: ${outPath}`);
console.log(`   Products: ${productsArray.length}`);
console.log(`   Variant Groups: ${variantGroups.length}`);
console.log(`   Bestsellers: ${bestsellersIds.length}`);
