
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: 'c:/Users/ccuri/Documents/Desarrollo/JDenis/website/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Using Anon key for client-side signup

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    const email = 'juangarcia@aionia.com.mx';
    const password = 'E4ae5d6c0c..';

    console.log(`Creating user: ${email}`);

    // 1. Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                fullName: 'Juan Garcia',
                role: 'ADMIN' // We hope this trigger handles it, or we update manually
            }
        }
    });

    if (authError) {
        console.error('Error creating user:', authError.message);
        return;
    }

    if (!authData.user) {
        console.error('User creation failed (no user returned)');
        return;
    }

    console.log('User created successfully:', authData.user.id);

    // 2. Force update role in public.users just in case the trigger didn't pick it up or we need to be explicit
    // Note: We can't update public.users directly with CLIENT key if RLS blocks it for other users, 
    // but usually users can update their own profile. 
    // However, setting 'ADMIN' role might be protected.
    // If this fails, we will use the MCP tool to update the table directly via SQL.

    console.log('User registered. Please check the database to confirm "ADMIN" role.');
}

createAdmin();
