import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
    console.error("Missing anonymous key");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testLogin(email, password) {
    console.log("Testing login for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error(`LOGIN ERROR for ${email}:`, error);
        return;
    }

    console.log(`LOGIN SUCCESS for ${email}! User ID:`, data.user.id);
}

async function run() {
    await testLogin('ejecutivo@jdenis.com', 'ejecutivo123');
    await testLogin('cliente@jdenis.com', 'cliente123');
}

run();
