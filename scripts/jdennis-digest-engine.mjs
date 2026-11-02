#!/usr/bin/env node
/**
 * J. DENIS — Motor de Diagnóstico por Consola (3D Telemetry + Dokploy Sensor + Google Search Console API)
 * Uso: node scripts/jdennis-digest-engine.mjs [--days=7]
 */
import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zdciwzeokkrwcxvsgusc.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2l3emVva2tyd2N4dnNndXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTM3NTksImV4cCI6MjA4ODIyOTc1OX0.qbXG0M2Zsjz-rOXY0CgAV2RfLledS67nqBw_dnvzkbg';
const PROD_URL = process.env.JDENNIS_PROD_URL || 'https://jdenis.store';

const daysArg = process.argv.find(a => a.startsWith('--days='));
const days = daysArg ? Number(daysArg.split('=')[1]) || 7 : 7;
const sinceIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

async function fetchSupabase(table, queryParams) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?${queryParams}`;
    const res = await fetch(url, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
        },
    });
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Supabase ${table} error (${res.status}): ${txt}`);
    }
    return res.json();
}

function base64UrlEncode(strOrBuf) {
    const buf = Buffer.isBuffer(strOrBuf) ? strOrBuf : Buffer.from(strOrBuf, 'utf8');
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function getGoogleSearchConsoleReport() {
    const credPath = path.resolve(process.cwd(), '.gsc-credentials.json');
    if (!fs.existsSync(credPath)) {
        return { connected: false, error: 'Missing .gsc-credentials.json' };
    }

    try {
        const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
        const now = Math.floor(Date.now() / 1000);
        const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
        const claimSet = base64UrlEncode(
            JSON.stringify({
                iss: creds.client_email,
                scope: 'https://www.googleapis.com/auth/webmasters.readonly',
                aud: creds.token_uri || 'https://oauth2.googleapis.com/token',
                exp: now + 3600,
                iat: now,
            })
        );
        const unsignedJwt = `${header}.${claimSet}`;
        const signer = crypto.createSign('RSA-SHA256');
        signer.update(unsignedJwt);
        signer.end();
        const signature = base64UrlEncode(signer.sign(creds.private_key));
        const jwt = `${unsignedJwt}.${signature}`;

        const tokenRes = await fetch(creds.token_uri || 'https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt,
            }),
        });
        if (!tokenRes.ok) {
            return { connected: false, error: `OAuth token error (${tokenRes.status})` };
        }
        const { access_token: token } = await tokenRes.json();

        // 1. List sites in GSC and match jdenis.store
        const sitesRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const sitesJson = await sitesRes.json();
        const allSites = (sitesJson.siteEntry || []).map(s => s.siteUrl);
        const targetSite =
            allSites.find(u => u === 'sc-domain:jdenis.store') ||
            allSites.find(u => u.includes('jdenis.store')) ||
            null;

        if (!targetSite) {
            return {
                connected: true,
                targetSite: null,
                allSites,
                error: 'jdenis.store property not found in this Service Account',
            };
        }

        const encodedSite = encodeURIComponent(targetSite);
        const endDate = new Date().toISOString().slice(0, 10);
        const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

        const [queriesRes, pagesRes, sitemapsRes] = await Promise.all([
            fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ startDate, endDate, dimensions: ['query'], rowLimit: 100 }),
            }).then(r => (r.ok ? r.json() : { rows: [] })),
            fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ startDate, endDate, dimensions: ['page'], rowLimit: 50 }),
            }).then(r => (r.ok ? r.json() : { rows: [] })),
            fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/sitemaps`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then(r => (r.ok ? r.json() : { sitemap: [] })),
        ]);

        return {
            connected: true,
            targetSite,
            startDate,
            endDate,
            queries: queriesRes.rows || [],
            pages: pagesRes.rows || [],
            sitemaps: sitemapsRes.sitemap || [],
        };
    } catch (err) {
        return { connected: false, error: err.message };
    }
}

async function checkDokployVersion() {
    let localSha = 'unknown';
    let prebuildSha = null;
    try {
        localSha = execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch {
        // Ignore git error
    }
    try {
        const localVersionFile = path.resolve(process.cwd(), 'website/public/__version.json');
        if (fs.existsSync(localVersionFile)) {
            const parsed = JSON.parse(fs.readFileSync(localVersionFile, 'utf8'));
            prebuildSha = parsed.fullSha || parsed.shortSha || null;
        }
    } catch {
        // Ignore file error
    }

    try {
        const res = await fetch(`${PROD_URL}/__version.json?t=${Date.now()}`, {
            headers: { 'Cache-Control': 'no-cache' },
        });
        const text = await res.text();
        if (!res.ok) {
            return {
                reachable: false,
                status: res.status,
                localSha,
                remoteSha: null,
                matchesHead: false,
            };
        }
        let json;
        try {
            json = JSON.parse(text);
        } catch {
            return {
                reachable: true,
                status: res.status,
                localSha,
                remoteSha: 'pre-sensor-build (SPA fallback)',
                matchesHead: false,
            };
        }
        const remoteSha = json.fullSha || json.commitSha || null;
        const matchesDirectHead = Boolean(remoteSha && (localSha.startsWith(remoteSha) || remoteSha.startsWith(localSha.slice(0, 7))));
        const matchesPrebuildArtifact = Boolean(remoteSha && prebuildSha && (remoteSha === prebuildSha || remoteSha.startsWith(prebuildSha.slice(0, 7))));
        return {
            reachable: true,
            status: res.status,
            localSha,
            remoteSha,
            builtAt: json.builtAt,
            commitMessage: json.commitMessage,
            matchesHead: matchesDirectHead || matchesPrebuildArtifact,
        };
    } catch (err) {
        return {
            reachable: false,
            error: err.message,
            localSha,
            remoteSha: null,
            matchesHead: false,
        };
    }
}

async function runDigest() {
    console.log('===================================================================');
    console.log(`📊 J. DENNIS — 3D TELEMETRY, GSC & DOKPLOY ENGINE (Last ${days}d)`);
    console.log('===================================================================\n');

    const [deployStatus, events, orders, quotations, gscReport] = await Promise.all([
        checkDokployVersion(),
        fetchSupabase('analytics_events', `select=*&created_at=gte.${encodeURIComponent(sinceIso)}&order=created_at.desc&limit=2500`).catch(e => {
            console.error('Warn fetching analytics_events:', e.message);
            return [];
        }),
        fetchSupabase('website_orders', `select=id,total,status,payment_status,created_at&created_at=gte.${encodeURIComponent(sinceIso)}`).catch(() => []),
        fetchSupabase('quotations', `select=id,total_amount,status,created_at&created_at=gte.${encodeURIComponent(sinceIso)}`).catch(() => []),
        getGoogleSearchConsoleReport(),
    ]);

    console.log('## 1. DOKPLOY AUTODEPLOY VERIFICATION (/__version.json)');
    console.log(`- Production URL: ${PROD_URL}/__version.json`);
    console.log(`- HTTP Status:    ${deployStatus.status || 'ERR'}`);
    console.log(`- Local HEAD SHA: ${deployStatus.localSha}`);
    console.log(`- Remote SHA:     ${deployStatus.remoteSha || 'N/A'}`);
    console.log(`- Built At:       ${deployStatus.builtAt || 'N/A'}`);
    console.log(`- Deploy Synced:  ${deployStatus.matchesHead ? '✅ YES (LIVE)' : '⏳ PENDING DEPLOY SYNC'}\n`);

    const humanEvents = events.filter(e => !e.is_bot);
    const botEvents = events.filter(e => e.is_bot || e.event_name === 'ai_or_search_bot_crawl');

    const uniqueSessions = new Set(humanEvents.map(e => e.session_id)).size;
    const pwaSessions = new Set(humanEvents.filter(e => e.app_context === 'pwa_standalone' || e.is_pwa).map(e => e.session_id)).size;

    const byEventName = {};
    for (const ev of humanEvents) {
        byEventName[ev.event_name] = (byEventName[ev.event_name] || 0) + 1;
    }

    console.log('## 2. DIMENSION A: WEB & E-COMMERCE FUNNEL');
    console.log(`- Total Human Events: ${humanEvents.length} across ${uniqueSessions} sessions`);
    console.log(`- Page Views:         ${byEventName.page_view || 0}`);
    console.log(`- Product Views:      ${byEventName.product_view || 0}`);
    console.log(`- Add to Cart:        ${byEventName.add_to_cart || 0}`);
    console.log(`- Checkout Start:     ${byEventName.checkout_start || 0}`);
    console.log(`- Payment Attempt:    ${byEventName.payment_attempt || 0}`);
    console.log(`- Purchase Complete:  ${byEventName.purchase_complete || 0}`);
    console.log(`- Website Orders DB:  ${orders.length} ($${orders.reduce((a, o) => a + (Number(o.total) || 0), 0).toFixed(2)} MXN)\n`);

    const searches = humanEvents.filter(e => e.event_name === 'product_search');
    const zeroResultSearches = searches.filter(s => Number(s.metadata?.results_count ?? 1) === 0);

    console.log('## 3. SEO GENERIC, INTERNAL SEARCH & GEO BOTS');
    console.log(`- Internal Searches:  ${searches.length} (${zeroResultSearches.length} with 0 results)`);
    if (zeroResultSearches.length > 0) {
        const zeroTerms = [...new Set(zeroResultSearches.map(s => s.metadata?.query))];
        console.log(`- Zero-Result Terms:  ${zeroTerms.join(', ')}`);
    }
    console.log(`- Bot Crawl Events:   ${botEvents.length}\n`);

    console.log('## 4. DIMENSION B: INSTALLED APP (PWA STANDALONE)');
    console.log(`- PWA Sessions:       ${pwaSessions}`);
    console.log(`- PWA Prompts Shown:  ${byEventName.pwa_prompt_shown || 0}`);
    console.log(`- PWA Installed:      ${byEventName.pwa_installed || 0}\n`);

    const quoteSaved = humanEvents.filter(e => e.event_name === 'quote_flow_saved');
    const quoteErrors = humanEvents.filter(e => e.event_name === 'quote_save_error');
    const apiLatency = humanEvents.filter(e => e.event_name === 'api_latency_or_error');
    const uxFriction = humanEvents.filter(e => ['rage_click', 'dead_click', 'form_abandon', 'payment_error'].includes(e.event_name));

    console.log('## 5. DIMENSION C: INTERNAL OPERATIONS (QUOTER & ERP)');
    console.log(`- Quotations in DB:   ${quotations.length} ($${quotations.reduce((a, q) => a + (Number(q.total_amount) || 0), 0).toFixed(2)} MXN)`);
    console.log(`- Quote Flows Saved:  ${quoteSaved.length}`);
    console.log(`- Quote Save Errors:  ${quoteErrors.length}`);
    console.log(`- API Latency/Errors: ${apiLatency.length}`);
    console.log(`- UX Friction Events: ${uxFriction.length}\n`);

    console.log('## 6. GOOGLE SEARCH CONSOLE API (jdenis.store — Last 28d)');
    if (!gscReport.connected) {
        console.log(`- Status: ❌ Disconnected (${gscReport.error})\n`);
    } else if (!gscReport.targetSite) {
        console.log(`- Status: ⚠️ Connected, but jdenis.store not found in available properties: ${(gscReport.allSites || []).join(', ')}\n`);
    } else {
        const totalClicks = gscReport.queries.reduce((a, r) => a + (r.clicks || 0), 0);
        const totalImpressions = gscReport.queries.reduce((a, r) => a + (r.impressions || 0), 0);
        console.log(`- Property:           ✅ ${gscReport.targetSite} (${gscReport.startDate} -> ${gscReport.endDate})`);
        console.log(`- Sitemaps Registered: ${gscReport.sitemaps.length} (${gscReport.sitemaps.map(s => `${s.path} [errors:${s.errors || 0}, warnings:${s.warnings || 0}]`).join(', ') || 'none'})`);
        console.log(`- Top Queries Sample: ${gscReport.queries.length} queries (${totalClicks} clicks, ${totalImpressions} impressions)`);
        const byImpressions = [...gscReport.queries].sort((a, b) => (b.impressions || 0) - (a.impressions || 0));
        for (const q of byImpressions.slice(0, 20)) {
            console.log(
                `  • "${q.keys[0]}" -> Impr: ${q.impressions}, Clicks: ${q.clicks}, CTR: ${(q.ctr * 100).toFixed(2)}%, Pos: ${q.position.toFixed(1)}`
            );
        }
        const nonBrandedOrSpecific = byImpressions.filter(q => !/^(j\.?\s*denn?is|jd\s*denis)$/i.test(q.keys[0].trim()));
        if (nonBrandedOrSpecific.length > 0) {
            console.log(`- High-Opportunity Specific & Generic Queries (${nonBrandedOrSpecific.length}):`);
            for (const q of nonBrandedOrSpecific.slice(0, 15)) {
                console.log(
                    `  ★ "${q.keys[0]}" -> Impr: ${q.impressions}, Clicks: ${q.clicks}, CTR: ${(q.ctr * 100).toFixed(2)}%, Pos: ${q.position.toFixed(1)}`
                );
            }
        }
        console.log(`- Top Pages Sample:   ${gscReport.pages.length} pages (sorted by impressions)`);
        const pagesByImpr = [...gscReport.pages].sort((a, b) => (b.impressions || 0) - (a.impressions || 0));
        for (const p of pagesByImpr.slice(0, 15)) {
            console.log(
                `  • ${p.keys[0]} -> Impr: ${p.impressions}, Clicks: ${p.clicks}, CTR: ${(p.ctr * 100).toFixed(2)}%, Pos: ${p.position.toFixed(1)}`
            );
        }
        console.log('');
    }
}

runDigest().catch(err => {
    console.error('Fatal error in jdennis-digest-engine:', err);
    process.exit(1);
});
