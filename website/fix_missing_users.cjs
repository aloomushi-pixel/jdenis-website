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
    const res = await client.query(`SELECT id, email FROM auth.users WHERE email IN ('aloomushi@gmail.com', 'angela.dani_3@hotmail.com');`);
    console.log("Found in auth.users:");
    for (const r of res.rows) {
        console.log(`- ${r.email}: ${r.id}`);
        // Now check if they are in public.users
        const uRes = await client.query(`SELECT id, role FROM public.users WHERE id = $1`, [r.id]);
        if (uRes.rowCount > 0) {
            console.log(`  -> Exists in public.users with role ${uRes.rows[0].role}`);
        } else {
            console.log(`  -> MISSING from public.users! Inserting...`);
            await client.query(`INSERT INTO public.users (id, email, full_name, role, is_active, created_at, updated_at) VALUES ($1, $2, $3, 'DISTRIBUIDOR', true, now(), now())`, [r.id, r.email, r.email]);
            console.log(`  -> Inserted!`);
        }
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
