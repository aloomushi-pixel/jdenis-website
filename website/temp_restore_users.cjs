const { Client } = require('pg');

async function main() {
  const connectionString = 'postgresql://postgres:E4ae5d6c0c.@db.zdciwzeokkrwcxvsgusc.supabase.co:5432/postgres';
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    
    // Real distributors to restore
    const realEmails = [
      'aloomushi@gmail.com',
      'angela.dani_3@hotmail.com'
    ];

    const res = await client.query(`
        UPDATE users 
        SET role = 'DISTRIBUIDOR' 
        WHERE email = ANY($1::text[])
        RETURNING id, email;
    `, [realEmails]);

    console.log("Upgraded in users table:", res.rows);

    for (const row of res.rows) {
        const updateAuth = await client.query(`
            UPDATE auth.users
            SET raw_user_meta_data = jsonb_set(
              COALESCE(raw_user_meta_data, '{}'::jsonb),
              '{role}',
              '"DISTRIBUIDOR"'
            )
            WHERE id = $1
        `, [row.id]);
        console.log(`Updated auth.users for ${row.email}:`, updateAuth.rowCount);
    }

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
