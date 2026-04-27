const { Client } = require('pg');
const fs = require('fs');
const client = new Client({ connectionString: 'postgresql://postgres.zdciwzeokkrwcxvsgusc:E4ae5d6c0c.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true' });

async function run() {
    await client.connect();
    
    const sql = fs.readFileSync('fix_rpcs.sql', 'utf8');
    await client.query(sql);
    await client.query("NOTIFY pgrst, 'reload schema'");
    
    console.log("RPCs updated and schema reloaded!");
    await client.end();
}

run().catch(console.error);
