const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zdciwzeokkrwcxvsgusc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2l3emVva2tyd2N4dnNndXNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjY1Mzc1OSwiZXhwIjoyMDg4MjI5NzU5fQ.lJc_1aToupmwDc-f9LkL5KXleJxOxt-T88iWpAAFDNo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testGetUsers() {
    console.log("Using Service Role Key (bypassing RLS)...");

    const { data, error } = await supabase.from('users').select('*').eq('role', 'DISTRIBUIDOR');
    
    if (error) {
        console.error("Error fetching distributors:", error);
    } else {
        console.log(`Found ${data.length} distributors directly using role=DISTRIBUIDOR:`);
        data.forEach(d => console.log(`- ID: ${d.id} | Email: ${d.email} | Name: ${d.fullName} | active: ${d.is_active}`));
    }
    
    // Check all roles just in case
    const { data: allUsers, error: allErr } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (!allErr) {
        console.log(`\nTotal users in DB: ${allUsers.length}`);
        
        const anyDist = allUsers.filter(u => u.role && u.role.toLowerCase().includes('distribuidor'));
        console.log(`\nFound ${anyDist.length} users with 'distribuidor' in their role (case insensitive):`);
        anyDist.forEach(d => console.log(`- ${d.email} | exact role: "${d.role}" | active: ${d.is_active}`));
    }
}

testGetUsers();
