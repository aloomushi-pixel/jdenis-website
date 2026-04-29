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
        DELETE FROM distributor_applications 
        WHERE email IN ('danielaluna05072000+1@gmail.com', 'aloomushi@gmail.com', 'angela.dani_3@hotmail.com');
    `);
    console.log("Deleted distributor_applications:", res.rowCount);

    const res2 = await client.query(`
        SELECT email FROM distributor_applications;
    `);
    console.log("Remaining:", res2.rows.map(r => r.email));

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
