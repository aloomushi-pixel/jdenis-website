const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
    console.log("Checking product_reviews columns...");
    const { data, error } = await supabase.from('product_reviews').select('*, user_name').limit(1);
    if (error) {
        console.error("Error with product_reviews:", error.message);
    } else {
        console.log("product_reviews query succeeded!");
    }
}

test();
