import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';

// Needs service role key to upload to storage without user authentication if RLS applies.
// But we actually created a policy that allows ADMIN, so we need a token or service role.
// Wait, the anon key is used, but we need authenticated ADMIN token to upload if we rely on RLS.
// Or we can just use the service role key. Let's try to see if process.env.SUPABASE_SERVICE_KEY is available or just read it from .env.local

// Because we don't have the service role key hardcoded, let's bypass RLS by temporarily granting public insert or just use service_role if available.
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const client = createClient(supabaseUrl, serviceRoleKey || supabaseKey);

async function run() {
    const { data: reels, error } = await client.from('social_reels').select('*');
    if (error) {
        console.error('Error fetching reels:', error);
        process.exit(1);
    }

    if (!fs.existsSync('reels_output')) {
        fs.mkdirSync('reels_output');
    }

    for (const reel of reels) {
        if (reel.video_url) {
            console.log(`Reel ${reel.id} already has a video_url, skipping...`);
            continue;
        }

        console.log(`Processing ${reel.platform} reel: ${reel.url}`);

        try {
            // Check if file already downloaded
            const files = fs.readdirSync('reels_output');
            let downloadedFile = files.find(f => f.startsWith(reel.id + '.'));

            if (!downloadedFile) {
                // Download using yt-dlp
                execSync(`.\\yt-dlp.exe -f "b[ext=mp4]/best" -o "reels_output/${reel.id}.%(ext)s" "${reel.url}"`, { stdio: 'inherit' });
                const newFiles = fs.readdirSync('reels_output');
                downloadedFile = newFiles.find(f => f.startsWith(reel.id + '.'));
            }

            if (!downloadedFile) {
                console.error(`Failed to download ${reel.url}`);
                continue;
            }

            const filePath = path.join('reels_output', downloadedFile);
            const fileData = fs.readFileSync(filePath);

            console.log(`Uploading ${downloadedFile} to Supabase storage...`);

            const { data: uploadData, error: uploadError } = await client
                .storage
                .from('reels')
                .upload(`${reel.id}.mp4`, fileData, {
                    contentType: 'video/mp4',
                    upsert: true
                });

            if (uploadError) {
                console.error('Upload Error:', uploadError);
                continue;
            }

            const { data: publicUrlData } = client.storage.from('reels').getPublicUrl(`${reel.id}.mp4`);
            const videoUrl = publicUrlData.publicUrl;

            console.log(`Updating database with video_url: ${videoUrl}`);

            const { error: updateError } = await client
                .from('social_reels')
                .update({ video_url: videoUrl })
                .eq('id', reel.id);

            if (updateError) {
                console.error('Update Error:', updateError);
            } else {
                console.log(`Successfully migrated reel ${reel.id}`);
            }

        } catch (err) {
            console.error(`Error processing reel ${reel.id}:`, err.message);
        }
    }
}

run();
