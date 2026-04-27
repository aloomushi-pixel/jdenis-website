const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zdciwzeokkrwcxvsgusc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjY1Mzc1OSwiZXhwIjoyMDg4MjI5NzU5fQ.lJc_1aToupmwDc-f9LkL5KXleJxOxt-T88iWpAAFDNo';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  try {
    console.log("Fetching users...");
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;
    
    let user = usersData.users.find(u => u.email === 'caballeroangela49@gmail.com');
    
    if (!user) {
      console.log("User not found, creating...");
      const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
        email: 'caballeroangela49@gmail.com',
        password: 'E4ae5d6c0c.',
        email_confirm: true,
        user_metadata: { first_name: 'Angela', last_name: 'Caballero', role: 'admin' }
      });
      if (createError) throw createError;
      user = createdUser.user;
      console.log("Created user:", user.id);
    } else {
      console.log("User already exists:", user.id);
      console.log("Updating password...");
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, { password: 'E4ae5d6c0c.' });
      if (updateError) throw updateError;
    }

    console.log("Updating role to admin in public.users...");
    const { error: dbError } = await supabase.from('users').upsert({
      id: user.id,
      email: 'caballeroangela49@gmail.com',
      first_name: 'Angela',
      last_name: 'Caballero',
      role: 'admin'
    });
    
    if (dbError) throw dbError;
    console.log("SUCCESS: User is now admin and registered in the database.");
  } catch (err) {
    console.error("Error during process:", err);
  }
}

main();
