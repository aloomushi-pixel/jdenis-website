const { Client } = require('pg');

async function main() {
  const connectionString = 'postgresql://postgres.zdciwzeokkrwcxvsgusc:E4ae5d6c0c.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log("Connected to DB.");
    
    const res = await client.query(`
        UPDATE auth.users 
        SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"ADMIN"')
        WHERE email IN ('juangarcia@ccurity.com.mx', 'caballeroangela49@gmail.com')
        RETURNING email, raw_user_meta_data;
    `);
    console.log("Updated Admin users:");
    for (const r of res.rows) {
        console.log(`- Email: ${r.email} | Meta:`, r.raw_user_meta_data);
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
