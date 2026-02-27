import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
    const email = 'deniselizalde@jdenis.com.mx';
    const password = 'jdenis2026';

    console.log(`Testing login for: ${email}`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error('Login Failed:', error.message);
    } else {
        console.log('Login Successful! User ID:', data.user.id);
    }
}

testLogin();
