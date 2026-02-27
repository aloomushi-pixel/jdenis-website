import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '../website/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vqcjxzsibywdxpvkyysa.supabase.co';
// Need a service key or anon key with RLS bypass if RLS blocks us, assuming anon key works based on prior steps
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyVariants() {
    const dataPath = 'proposed_variants.json';
    if (!fs.existsSync(dataPath)) {
        console.error('proposed_variants.json not found. Run analyze_variants.mjs first.');
        process.exit(1);
    }

    const { groups } = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const groupKeys = Object.keys(groups);

    if (groupKeys.length === 0) {
        console.log('No groups to apply.');
        return;
    }

    console.log(`Starting to apply ${groupKeys.length} variant groups...`);

    // 1. Clear existing variant configurations to avoid orphans/duplicates
    console.log('Clearing existing product_variants and variant_groups...');

    // Deleting groups should cascade to variants if FK is setup right. If not, delete variants first.
    const { error: delVarErr } = await supabase.from('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
    if (delVarErr) {
        console.error('Error clearing product_variants', delVarErr);
    }

    const { error: delGrpErr } = await supabase.from('variant_groups').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
    if (delGrpErr) {
        console.error('Error clearing variant_groups', delGrpErr);
    }

    // 2. Iterate and insert groups
    for (const key of groupKeys) {
        const groupData = groups[key];

        // Determine all unique attribute names across variants in this group
        const allAttrNames = new Set();
        for (const v of groupData.variants) {
            Object.keys(v.attributes).forEach(attr => allAttrNames.add(attr));
        }

        const attribute_names = Array.from(allAttrNames);

        console.log(`Creating group: ${groupData.baseName} with attrs [${attribute_names.join(', ')}]`);

        // Insert variant_group
        const { data: insertedGroup, error: grpErr } = await supabase
            .from('variant_groups')
            .insert({
                name: groupData.baseName,
                attribute_names
            })
            .select('id')
            .single();

        if (grpErr) {
            console.error(`  -> Error inserting group ${groupData.baseName}:`, grpErr);
            continue;
        }

        const groupId = insertedGroup.id;

        // Insert variants
        const variantsToInsert = groupData.variants.map(v => ({
            group_id: groupId,
            product_id: v.product_id,
            attributes: v.attributes
        }));

        const { error: varErr } = await supabase
            .from('product_variants')
            .insert(variantsToInsert);

        if (varErr) {
            console.error(`  -> Error inserting variants for ${groupData.baseName}:`, varErr);
        } else {
            console.log(`  -> Inserted ${variantsToInsert.length} variants successfully.`);
        }
    }

    console.log('Finished applying variants.');
}

applyVariants();
