const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.vqcjxzsibywdxpvkyysa:J-Denis2026@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true' });

async function run() {
    try {
        await client.connect();
        const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users';");
        console.log(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
