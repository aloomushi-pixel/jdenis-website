
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Adjust path to point to website/.env
dotenv.config({ path: 'c:/Users/ccuri/Documents/Desarrollo/JDenis/website/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    console.error('URL:', supabaseUrl);
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
                role: 'ADMIN'
            }
        }
    });

    if (authError) {
        console.error('Error creating user:', authError.message);
        return;
    }

    if (!authData.user) {
        console.error('User creation failed (no user returned). User might already exist.');

        // Try signing in to check
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (signInData.user) {
            console.log('User already exists. ID:', signInData.user.id);
            return;
        }
        return;
    }

    console.log('User created successfully:', authData.user.id);
}

createAdmin();
