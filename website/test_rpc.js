import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRpc() {
    console.log("Testing RPC existence...");
    const dummyId = "00000000-0000-0000-0000-000000000000";
    const dummyRole = "ADMIN";

    const { data, error } = await supabase.rpc('update_user_role_admin', {
        target_user_id: dummyId,
        new_role: dummyRole
    });

    if (error) {
        console.log("RPC Call Error Result:", error.message);
        if (error.message.includes("Could not find the function") || error.code === "PGRST202") {
            console.log("❌ The function DOES NOT exist. Please make sure you executed the SQL.");
            process.exit(1);
        } else if (error.message.includes("Unauthorized: only admins can change user roles") || error.message.includes("JWT") || error.message.includes("Valid JWT required")) {
            console.log("✅ The function EXIsTS! Expected auth error returned because we run it anonymously.");
            process.exit(0);
        } else {
            console.log("❓ Got an error, but function might exist: ", error);
            process.exit(0);
        }
    } else {
        console.log("✅ The function EXIsTS and executed (unexpected success for anonymous).");
        process.exit(0);
    }
}

testRpc();
