const { Client } = require('pg');

async function main() {
  const connectionString = 'postgresql://postgres.zdciwzeokkrwcxvsgusc:J-denis2025@aws-0-us-east-1.pooler.supabase.com:6543/postgres';
  // or postgresql://postgres:J-denis2025@db.zdciwzeokkrwcxvsgusc.supabase.co:5432/postgres
  
  const client = new Client({ 
    connectionString: 'postgresql://postgres:J-denis2025@db.zdciwzeokkrwcxvsgusc.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log("Connected to Supabase DB.");
    
    const res = await client.query(`
      SELECT polname, polcmd, polroles, polqual
      FROM pg_policy
      WHERE polrelid = 'public.users'::regclass;
    `);
    
    console.log("RLS Policies for 'users':");
    res.rows.forEach(r => console.log(r));
    
  } catch (err) {
    console.error("Execution error:", err.message);
  } finally {
    await client.end();
  }
}

main();
