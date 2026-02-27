import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    const email = 'distribuidor@jdenis.com';
    const password = 'Password123!';

    console.log(`Signing up ${email}...`);
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Distribuidor JDenis'
            }
        }
    });

    if (error) {
        console.error('Error signing up:', error.message);
    } else {
        console.log('Successfully signed up:', data.user?.id);

        // Now try to update the role via RPC
        const { error: rpcError } = await supabase.rpc('update_user_role_admin', {
            target_user_id: data.user?.id,
            new_role: 'DISTRIBUIDOR'
        });
        if (rpcError) {
            console.log("RPC update failed (likely RLS). You need an admin session or direct DB access to update the role:", rpcError.message);
        } else {
            console.log("Role successfully set to DISTRIBUIDOR via RPC!");
        }
    }
}
run();
