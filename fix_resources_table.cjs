const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.zdciwzeokkrwcxvsgusc:E4ae5d6c0c.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true' });

async function run() {
    await client.connect();
    
    const queries = [
        `ALTER TABLE resources ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES resource_categories(id)`,
        `ALTER TABLE resources ADD COLUMN IF NOT EXISTS custom_id text`,
        `ALTER TABLE resources ADD COLUMN IF NOT EXISTS description text`,
        `ALTER TABLE resources ADD COLUMN IF NOT EXISTS min_quantity numeric DEFAULT 10`,
        `ALTER TABLE resources ADD COLUMN IF NOT EXISTS unit_cost numeric DEFAULT 0`,
        `ALTER TABLE resources ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true`,
        `NOTIFY pgrst, 'reload schema'`
    ];

    for (const q of queries) {
        console.log("Executing:", q);
        await client.query(q);
    }
    
    console.log("Done!");
    await client.end();
}

run().catch(console.error);
