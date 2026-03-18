const fs = require('fs');

try {
  const missing = JSON.parse(fs.readFileSync('missing_products.json', 'utf8'));

  let sql = 'INSERT INTO products (id, name, slug, category, price, compare_at_price, stock, sku, description, is_active, is_featured, gallery, created_at, updated_at) VALUES\\n';

  const values = [];

  for (const row of missing) {
    const keys = Object.keys(row);
    const slugKey = keys.find(k => k.startsWith('tiendanube-')) || keys[0];
    const id = row[slugKey] ? row[slugKey].toString().trim() : `prod-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;
    const slug = id;
    const name = row['__EMPTY'] ? row['__EMPTY'].toString().trim() : 'Sin nombre';
    const category = row['__EMPTY_1'] ? row['__EMPTY_1'].toString().split('>')[0].trim() : 'General';
    const price = parseFloat(row['__EMPTY_8']) || 0;
    const compareAt = parseFloat(row['__EMPTY_9']) || null;
    const stock = parseInt(row['__EMPTY_14']) || 0;
    const sku = row['__EMPTY_15'] ? row['__EMPTY_15'].toString().trim() : null;
    const description = row['__EMPTY_19'] ? row['__EMPTY_19'].toString().trim() : '';

    const escapeStr = (str) => {
      if (str === null || str === undefined) return 'NULL';
      return "'" + str.replace(/'/g, "''") + "'";
    };

    const valStr = `(${escapeStr(id)}, ${escapeStr(name)}, ${escapeStr(slug)}, ${escapeStr(category)}, ${price}, ${compareAt === null ? 'NULL' : compareAt}, ${stock}, ${escapeStr(sku)}, ${escapeStr(description)}, true, false, '{}', NOW(), NOW())`;
    values.push(valStr);
  }

  sql += values.join(',\\n') + '\\nON CONFLICT (id) DO NOTHING;';

  fs.writeFileSync('import_products.sql', sql, 'utf8');
  console.log(`Generated SQL for ${values.length} products.`);

} catch (e) {
  console.error(e);
}
