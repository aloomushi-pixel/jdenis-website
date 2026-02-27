import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    console.log('Logging in as distribuidor@jdenis.com...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'distribuidor@jdenis.com',
        password: 'Password123!',
    });

    if (signInError) {
        console.error('Login Failed:', signInError.message);
        return;
    }

    console.log('Login Success. Session ID:', signInData.session?.user.id);

    // Now that we're authenticated, let's call the RPC
    console.log('Targeting RPC...');
    const { error: rpcError } = await supabase.rpc('update_user_role_admin', {
        target_user_id: signInData.user?.id,
        new_role: 'DISTRIBUIDOR'
    });

    if (rpcError) {
        console.error("RPC Failed:", rpcError);
    } else {
        console.log("Successfully set role to DISTRIBUIDOR!");
    }
}
run();
