const fs = require('fs');

try {
  const excelData = JSON.parse(fs.readFileSync('output2.json', 'utf8'));
  const dbText = fs.readFileSync('C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\41729ba2-3059-41d7-a3db-176be8467cf0\\.system_generated\\steps\\57\\output.txt', 'utf8');
  
  let dbProducts = [];
  try {
     const topJson = JSON.parse(dbText);
     const resString = topJson.result;
     
     // Extract the array using simple string manipulation since we know the format
     const startIdx = resString.indexOf('[');
     const endIdx = resString.lastIndexOf(']') + 1;
     
     if (startIdx !== -1 && endIdx !== -1) {
         const jsonArrayStr = resString.substring(startIdx, endIdx);
         dbProducts = JSON.parse(jsonArrayStr);
     }
  } catch(e) { console.error("Parse error top level", e.message); }

  console.log("DB Products parsed:", dbProducts.length);

  const dbNames = new Set(dbProducts.map(p => (p.name || '').trim().toLowerCase()));
  const dbIds = new Set(dbProducts.map(p => (p.id || '').trim().toLowerCase()));

  const missingProducts = [];
  const itemsToProcess = excelData[0]["__EMPTY"] === "Nombre" ? excelData.slice(1) : excelData;

  for (const row of itemsToProcess) {
    const keys = Object.keys(row);
    const slugKey = keys.find(k => k.startsWith('tiendanube-')) || keys[0];
    const slug = (row[slugKey] || '').trim().toLowerCase();
    const name = (row['__EMPTY'] || '').trim();
    const nameLower = name.toLowerCase();

    // Check if it exists in DB by name or slug
    if (!dbNames.has(nameLower) && !dbIds.has(slug)) {
      missingProducts.push(row);
    }
  }

  fs.writeFileSync('missing_products.json', JSON.stringify(missingProducts, null, 2), 'utf8');
  console.log(`Found ${missingProducts.length} missing products out of ${itemsToProcess.length} excel items.`);
} catch (e) {
  console.error(e.message);
  console.error(e.stack);
}
