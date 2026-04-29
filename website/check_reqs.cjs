const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zdciwzeokkrwcxvsgusc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2l3emVva2tyd2N4dnNndXNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDIxNTkzMywiZXhwIjoyMDU1NzkxOTMzfQ.xY8T1bW972gIqgZ4q89l_vQYc9_q5W-0pPq6fF8X8Zk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);


async function checkDistributors() {
    console.log("Checking distributor_requests...");
    const { data: requests, error: reqErr } = await supabase.from('distributor_requests').select('*');
    
    if (reqErr) {
        console.error("Error fetching requests:", reqErr);
        return;
    }
    
    console.log(`Found ${requests.length} requests:`);
    for (const r of requests) {
        console.log(`- ID: ${r.id} | Email: ${r.email} | Status: ${r.status} | user_id: ${r.user_id}`);
    }
    
    console.log("\nChecking users table for those user_ids...");
    const { data: users, error: userErr } = await supabase.from('users').select('*');
    if (userErr) {
        console.error("Error fetching users:", userErr);
        return;
    }
    
    for (const r of requests) {
        if (r.user_id) {
            const u = users.find(user => user.id === r.user_id);
            if (u) {
                console.log(`User ${r.email} has role in users table: ${u.role}`);
            } else {
                console.log(`User ${r.email} NOT FOUND in users table!`);
            }
        }
    }
}

checkDistributors();
