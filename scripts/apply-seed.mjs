/**
 * Applies each SQL batch file to Supabase using the pg module directly.
 * Usage: node scripts/apply-seed.mjs
 */
import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const batchDir = resolve(__dirname, 'batches');

// Read Supabase connection from env or hardcode the project URL
// Using the DATABASE_URL format for direct Postgres connection
const DATABASE_URL = process.env.DATABASE_URL ||
    `postgresql://postgres.vqcjxzsibywdxpvkyysa:${process.env.SUPABASE_DB_PASSWORD}@aws-0-us-west-2.pooler.supabase.com:6543/postgres`;

if (!process.env.SUPABASE_DB_PASSWORD && !process.env.DATABASE_URL) {
    console.error('❌ Set SUPABASE_DB_PASSWORD or DATABASE_URL env var');
    console.error('   Example: $env:SUPABASE_DB_PASSWORD="your-password"; node scripts/apply-seed.mjs');
    process.exit(1);
}

const client = new pg.Client({ connectionString: DATABASE_URL });

async function main() {
    await client.connect();
    console.log('✅ Connected to Supabase Postgres');

    const files = readdirSync(batchDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    console.log(`Found ${files.length} batch files to apply`);

    for (const file of files) {
        const sql = readFileSync(resolve(batchDir, file), 'utf-8');
        console.log(`\n📦 Applying ${file} (${(sql.length / 1024).toFixed(1)}KB)...`);
        try {
            await client.query(sql);
            console.log(`   ✅ ${file} applied successfully`);
        } catch (err) {
            console.error(`   ❌ Error in ${file}: ${err.message}`);
            // Continue with next batch
        }
    }

    await client.end();
    console.log('\n🎉 All batches applied!');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
