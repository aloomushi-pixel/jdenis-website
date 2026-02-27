const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.vqcjxzsibywdxpvkyysa:J-Denis2026@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to DB successfully.");
        const res = await client.query("SELECT email, role FROM users LIMIT 5");
        console.log("Current users:", res.rows);
    } catch (e) {
        console.error("DB Connection error:", e);
    } finally {
        await client.end();
    }
}
run();
