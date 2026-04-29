const { Client } = require('pg');

async function main() {
  const connectionString = 'postgresql://postgres:E4ae5d6c0c.@db.zdciwzeokkrwcxvsgusc.supabase.co:5432/postgres';
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    
    const res = await client.query(`
        SELECT id, email, full_name, role FROM users WHERE role = 'DISTRIBUIDOR';
    `);
    console.log("Distributors in users table:", res.rows);

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
