import { supabase } from './src/lib/supabase';

async function testRpc() {
    console.log("Testing RPC existence...");
    // We'll call the RPC with a dummy UUID and role.
    // If it exists but we aren't an admin or if RLS/auth kicks in, it'll fail with "Unauthorized: only admins..."
    // If it doesn't exist, Supabase returns a generic function not found error.

    // Using a valid UUID format but a fake one to avoid actually updating anything
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
