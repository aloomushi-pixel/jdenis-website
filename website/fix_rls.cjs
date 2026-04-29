const { Client } = require('pg');

async function main() {
  const connectionString = 'postgresql://postgres:E4ae5d6c0c.@db.zdciwzeokkrwcxvsgusc.supabase.co:5432/postgres';
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    
    // Let's create a SECURITY DEFINER function to reliably check user roles without recursion
    await client.query(`
        CREATE OR REPLACE FUNCTION public.get_user_role(user_uid uuid)
        RETURNS text
        LANGUAGE sql
        SECURITY DEFINER
        SET search_path = public
        STABLE
        AS $$
            SELECT role::text FROM public.users WHERE id = user_uid::text;
        $$;
    `);

    // Now update the policies for distributor_applications
    await client.query(`
        DROP POLICY IF EXISTS "Admins ven solicitudes de distribuidor" ON distributor_applications;
        CREATE POLICY "Admins ven solicitudes de distribuidor" ON distributor_applications
        FOR SELECT
        USING ( public.get_user_role(auth.uid()) = 'ADMIN' );

        DROP POLICY IF EXISTS "Admins actualizan solicitudes de distribuidor" ON distributor_applications;
        CREATE POLICY "Admins actualizan solicitudes de distribuidor" ON distributor_applications
        FOR UPDATE
        USING ( public.get_user_role(auth.uid()) = 'ADMIN' );
    `);

    // And fix the users table policy!
    await client.query(`
        DROP POLICY IF EXISTS "admin_ejecutivo_view_all_users" ON users;
        CREATE POLICY "admin_ejecutivo_view_all_users" ON users
        FOR SELECT
        USING ( public.get_user_role(auth.uid()) IN ('ADMIN', 'EJECUTIVO') );
    `);

    console.log("Policies updated to prevent infinite recursion!");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
