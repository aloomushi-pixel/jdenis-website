const { Client } = require('pg');
const fs = require('fs');

async function main() {
  const connectionString = 'postgresql://postgres:J-denis2025@db.vqcjxzsibywdxpvkyysa.supabase.co:5432/postgres';
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    const sql = fs.readFileSync('import_products.sql', 'utf8');
    await client.connect();
    console.log("Connected to Supabase.");
    
    const res = await client.query(sql);
    console.log("Executed successfully:", res.rowCount, "rows affected.");
  } catch (err) {
    console.error("Execution error:", err.message);
  } finally {
    await client.end();
  }
}

main();
