const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.zdciwzeokkrwcxvsgusc:E4ae5d6c0c.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true' });

client.connect()
    .then(() => client.query("NOTIFY pgrst, 'reload schema'"))
    .then(() => {
        console.log('Schema reloaded successfully!');
        client.end();
    })
    .catch(console.error);
