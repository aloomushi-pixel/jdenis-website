const { Client } = require('pg');

async function main() {
  const connectionString = 'postgresql://postgres.zdciwzeokkrwcxvsgusc:E4ae5d6c0c.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    
    // Simulate authenticated request for juangarcia
    await client.query(`SET ROLE authenticated;`);
    await client.query(`SET request.jwt.claims = '{"sub": "7a4b7448-c6c1-4b27-bf0e-f596d9c462f1", "role": "authenticated"}';`);
    
    const res = await client.query(`SELECT * FROM distributor_applications`);
    console.log("Rows fetched:", res.rows.length);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
