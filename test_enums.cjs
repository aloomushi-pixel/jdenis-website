const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.zdciwzeokkrwcxvsgusc:E4ae5d6c0c.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true' });

client.connect()
    .then(() => client.query("SELECT unnest(enum_range(NULL::\"SalesOrderStatus\"))::text AS value"))
    .then(res => {
        console.log('SalesOrderStatus Enum values:', res.rows);
        return client.query("SELECT unnest(enum_range(NULL::\"PurchaseOrderStatus\"))::text AS value");
    })
    .then(res => {
        console.log('PurchaseOrderStatus Enum values:', res.rows);
        client.end();
    })
    .catch(console.error);
