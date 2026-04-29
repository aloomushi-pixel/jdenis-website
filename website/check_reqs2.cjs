const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zdciwzeokkrwcxvsgusc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2l3emVva2tyd2N4dnNndXNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjY1Mzc1OSwiZXhwIjoyMDg4MjI5NzU5fQ.lJc_1aToupmwDc-f9LkL5KXleJxOxt-T88iWpAAFDNo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDistributors() {
    console.log("Checking distributor_applications...");
    const { data: requests, error: reqErr } = await supabase.from('distributor_applications').select('*');
    
    if (reqErr) {
        console.error("Error fetching requests:", reqErr);
        return;
    }
    
    console.log(`Found ${requests.length} requests:`);
    for (const r of requests) {
        console.log(`- ID: ${r.id} | Email: ${r.email} | Status: ${r.status}`);
        if (requests.indexOf(r) === 0) console.log("Keys:", Object.keys(r));
    }
    
    console.log("\nChecking users table for those user_ids...");
    const emailsToCheck = ['caballeroangela49@gmail.com', 'aloomushi@gmail.com', 'angela.dani_3@hotmail.com'];
    for (const email of emailsToCheck) {
        const { data: users, error: userErr } = await supabase.from('users').select('*').eq('email', email);
        if (userErr) {
            console.error("Error fetching users:", userErr);
            continue;
        }
        if (users && users.length > 0) {
            console.log(`User ${email} found in users table! Role: ${users[0].role}`);
        } else {
            console.log(`User ${email} NOT FOUND in users table!`);
        }
    }
    
    console.log("\nChecking auth.users table for those emails...");
    const emailsToCheck2 = ['aloomushi@gmail.com', 'angela.dani_3@hotmail.com'];
    for (const email of emailsToCheck2) {
        const { data: authUsers, error: authErr } = await supabase.auth.admin.listUsers();
        if (authErr) {
            console.error("Error fetching auth users:", authErr);
            continue;
        }
        const user = authUsers.users.find(u => u.email === email);
        if (user) {
            console.log(`User ${email} found in auth.users! ID: ${user.id}`);
        } else {
            console.log(`User ${email} NOT FOUND in auth.users!`);
        }
    }
}

checkDistributors();
