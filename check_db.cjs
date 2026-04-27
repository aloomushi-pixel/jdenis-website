const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.zdciwzeokkrwcxvsgusc:E4ae5d6c0c.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true' });

async function run() {
    try {
        await client.connect();
        const res = await client.query(`
          SELECT enumlabel 
          FROM pg_enum e 
          JOIN pg_type t ON e.enumtypid = t.oid 
          WHERE t.typname = 'UserRole' OR t.typname = 'userrole';
        `);
        console.log("Enum values:", res.rows.map(r => r.enumlabel));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
