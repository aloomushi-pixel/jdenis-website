const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zdciwzeokkrwcxvsgusc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2l3emVva2tyd2N4dnNndXNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDIxNTkzMywiZXhwIjoyMDU1NzkxOTMzfQ.xY8T1bW972gIqgZ4q89l_vQYc9_q5W-0pPq6fF8X8Zk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findUser() {
    const email = 'aloomushi@gmail.com';
    // Let's try to reset the password or generate a link to get the user object
    const { data, error } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email
    });
    
    if (error) {
        console.error("Error generating link:", error);
    } else {
        console.log("User object from link generation:", data.user);
        
        // Insert into users table!
        if (data.user) {
            const { error: insertErr } = await supabase.from('users').insert({
                id: data.user.id,
                email: data.user.email,
                fullName: 'Aloomushi',
                role: 'DISTRIBUIDOR',
                is_active: true
            });
            console.log("Insert result:", insertErr || "Success!");
        }
    }
}

findUser();
