const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.vqcjxzsibywdxpvkyysa:Manchasycaramelo@aws-0-us-west-2.pooler.supabase.com:6543/postgres'
});

async function run() {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL successfully!');

        // Create missing tables
        await client.query(`
      CREATE TABLE IF NOT EXISTS resource_categories (id uuid primary key default gen_random_uuid(), name text);
      CREATE TABLE IF NOT EXISTS resources (id uuid primary key default gen_random_uuid(), category_id uuid, quantity int, min_quantity int, unit_cost numeric, is_active boolean);
      CREATE TABLE IF NOT EXISTS sales_orders (id uuid primary key default gen_random_uuid(), total numeric, created_at timestamp, status text);
      CREATE TABLE IF NOT EXISTS purchase_orders (id uuid primary key default gen_random_uuid(), total numeric, created_at timestamp, status text);
      CREATE TABLE IF NOT EXISTS production_orders (id uuid primary key default gen_random_uuid(), status text, actual_loss numeric);
    `);
        console.log('Tables created or verified.');

        // Insert admin users into public.users
        const res = await client.query(`
      INSERT INTO public.users (id, email, full_name, role)
      SELECT id, email, 'Admin User', 'ADMIN'
      FROM auth.users
      WHERE email IN ('caballeroangela49@gmail.com', 'juangarcia@aionia.com.mx', 'juangarcia@ccurity.com.mx')
      ON CONFLICT (id) DO UPDATE SET role = 'ADMIN';
    `);
        console.log('Admin users synchronized. Rows affected:', res.rowCount);

    } catch (err) {
        console.error('Database Error:', err.message);
    } finally {
        await client.end();
    }
}

run();
