import { getProductionStats } from './src/lib/supabase';

async function test() {
    console.log('prod', await getProductionStats());
}

test().catch(console.error);
