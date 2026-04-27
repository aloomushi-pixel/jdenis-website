const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');

const supabaseUrl = 'https://zdciwzeokkrwcxvsgusc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2l3emVva2tyd2N4dnNndXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTM3NTksImV4cCI6MjA4ODIyOTc1OX0.qbXG0M2Zsjz-rOXY0CgAV2RfLledS67nqBw_dnvzkbg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dbConnectionString = 'postgresql://postgres.zdciwzeokkrwcxvsgusc:E4ae5d6c0c.@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

async function main() {
  const client = new Client({ connectionString: dbConnectionString });
  await client.connect();

  try {
    // 1. Check if user already exists in auth.users via DB
    const res = await client.query("SELECT id FROM auth.users WHERE email = $1", ['caballeroangela49@gmail.com']);
    
    let userId;
    if (res.rows.length === 0) {
      console.log("User not found, signing up via API...");
      const { data, error } = await supabase.auth.signUp({
        email: 'caballeroangela49@gmail.com',
        password: 'E4ae5d6c0c.',
        options: {
          data: { first_name: 'Angela', last_name: 'Caballero', role: 'admin' }
        }
      });
      if (error) throw error;
      
      // The API might not return the user ID if email confirmation is required and we aren't using service_role,
      // but let's query the DB again to get the ID.
      console.log("Signup API call completed. Waiting 2s for triggers...");
      await new Promise(r => setTimeout(r, 2000));
      
      const newRes = await client.query("SELECT id FROM auth.users WHERE email = $1", ['caballeroangela49@gmail.com']);
      if (newRes.rows.length === 0) throw new Error("Failed to find user in DB after signup");
      userId = newRes.rows[0].id;
    } else {
      console.log("User already exists in auth.users.");
      userId = res.rows[0].id;
    }

    console.log("User ID:", userId);

    // 2. Auto-confirm email
    console.log("Auto-confirming email...");
    await client.query("UPDATE auth.users SET email_confirmed_at = now() WHERE id = $1", [userId]);

    // 3. Ensure user exists in public.users and is an admin
    console.log("Setting role to admin in public.users...");
    
    // Using UPSERT (INSERT ... ON CONFLICT DO UPDATE)
    const upsertQuery = `
      INSERT INTO public.users (id, email, full_name, role, updated_at)
      VALUES ($1, $2, 'Angela Caballero', 'ADMIN', now())
      ON CONFLICT (id) DO UPDATE SET 
        role = 'ADMIN',
        full_name = 'Angela Caballero',
        updated_at = now();
    `;
    await client.query(upsertQuery, [userId, 'caballeroangela49@gmail.com']);

    console.log("Success! The user is registered, confirmed, and has admin rights.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

main();
