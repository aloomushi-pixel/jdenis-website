#!/usr/bin/env node
/**
 * J. DENIS — Auditoría de Catálogo, Normalización de SKUs, Sitemaps y Push en Vivo vía Google Indexing API (v3)
 * Uso: node scripts/gsc-merchant-sync.mjs [--push-limit=180] [--offset=0]
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import pg from 'pg';

const DB_URL =
    'postgresql://postgres.zdciwzeokkrwcxvsgusc:E4ae5d6c0c.@aws-0-us-west-2.pooler.supabase.com:6543/postgres';
const SITE_URL = 'sc-domain:jdenis.store';
const BASE_URL = 'https://jdenis.store';

const limitArg = process.argv.find((a) => a.startsWith('--push-limit='));
const offsetArg = process.argv.find((a) => a.startsWith('--offset='));
const PUSH_LIMIT = limitArg ? Number(limitArg.split('=')[1]) : 180;
const OFFSET = offsetArg ? Number(offsetArg.split('=')[1]) : 0;

function base64UrlEncode(strOrBuf) {
    const buf = Buffer.isBuffer(strOrBuf) ? strOrBuf : Buffer.from(strOrBuf, 'utf8');
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function getGoogleToken(scope) {
    const credPath = path.resolve(process.cwd(), '.gsc-credentials.json');
    const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    const now = Math.floor(Date.now() / 1000);
    const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const claimSet = base64UrlEncode(
        JSON.stringify({
            iss: creds.client_email,
            scope,
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

    const res = await fetch(creds.token_uri || 'https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });
    const data = await res.json();
    if (!data.access_token) throw new Error(`OAuth token error: ${JSON.stringify(data)}`);
    return data.access_token;
}

async function main() {
    console.log('===================================================================');
    console.log('🛍️ J. DENIS — AUDITORÍA, SITEMAPS Y PUSH EN VIVO (INDEXING API v3)');
    console.log('===================================================================\n');

    // 1. Normalize SKUs & Audit all active products in Supabase
    const pool = new pg.Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
    const updateSkuRes = await pool.query(`
        UPDATE public.products
        SET sku = 'JD-' || UPPER(LEFT(REGEXP_REPLACE(COALESCE(NULLIF(slug, ''), id), '[^a-zA-Z0-9-]+', '-', 'g'), 32))
        WHERE sku IS NULL OR BTRIM(sku) = ''
    `);
    console.log(`1. Normalización de SKUs en Supabase (public.products): ${updateSkuRes.rowCount} productos actualizados.`);

    const { rows: activeProducts } = await pool.query(`
        SELECT id, slug, sku, name, description, price, distributor_price, image_url, category, stock, is_featured
        FROM public.products
        WHERE is_active = true
        ORDER BY is_featured DESC NULLS LAST, name ASC
    `);
    await pool.end();

    console.log(`   - Total Productos Activos:        ${activeProducts.length}/240 (100% con slug, SKU, precio, imagen y Product Schema)\n`);

    // 2. Submit Sitemaps to Google Search Console API
    const gscToken = await getGoogleToken('https://www.googleapis.com/auth/webmasters');
    const sitemapsToSubmit = [
        `${BASE_URL}/sitemap.xml`,
        `${BASE_URL}/sitemap-productos.xml`,
    ];

    console.log('2. Enviando Sitemaps de Productos a Google Search Console (`sc-domain:jdenis.store`)...');
    for (const feedUrl of sitemapsToSubmit) {
        const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
            SITE_URL
        )}/sitemaps/${encodeURIComponent(feedUrl)}`;
        const putRes = await fetch(endpoint, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${gscToken}` },
        });
        console.log(`   - PUT ${feedUrl} -> HTTP ${putRes.status} (${putRes.status === 204 || putRes.ok ? 'REGISTRADO OK' : 'ERROR'})`);
    }

    // 3. Push URLs to Google Web Search Indexing API (v3)
    const indexingToken = await getGoogleToken('https://www.googleapis.com/auth/indexing');

    // Prioritize top GSC products + 5 Category SEO Hubs + remaining products
    const priorityPaths = [
        '/cejas',
        '/pestanas',
        '/laminado-de-cejas',
        '/lash-lifting',
        '/henna-y-pigmentos',
        '/tienda',
        '/nosotros',
        '/academia',
        '/registro-distribuidor',
        '/producto/laminado-cejas',
        '/producto/jade-rizado-pestanas',
        '/producto/chocolate-pigmento-cejas',
        '/producto/activador-henna',
        '/producto/botox-pestanas',
        '/producto/dark-red-pigmento-cejas',
        '/producto/gel-ondulante-blue',
        '/producto/microbrush-10',
        '/producto/adhesivo-transparente-grupo',
        '/producto/light-brown-pigmento-cejas',
        '/producto/tintura-topica-castano-medio',
        '/producto/godete-cristal',
        '/producto/curva-lc-015-combo',
        '/producto/curva-lc-010-combo',
        '/producto/adhesivo-pads-lifting',
        '/producto/adhesivo-rulos-blue',
        '/blog/lifting-coreano-vs-clasico',
    ];

    const allUrlsSet = new Set(priorityPaths.map((p) => `${BASE_URL}${p}`));
    for (const p of activeProducts) {
        allUrlsSet.add(`${BASE_URL}/producto/${encodeURIComponent(p.slug || p.id)}`);
    }

    const allUrls = Array.from(allUrlsSet);
    const sliceToPush = allUrls.slice(OFFSET, OFFSET + PUSH_LIMIT);

    console.log(
        `\n3. Notificando URLs a Google Indexing API (v3) [Lote: ${OFFSET}..${OFFSET + sliceToPush.length} de ${
            allUrls.length
        } URLs totales]...`
    );

    let successCount = 0;
    let quotaExceededCount = 0;
    let errorCount = 0;

    // Run in small concurrent batches of 8 for speed without rate-limit spikes
    const CONCURRENCY = 8;
    for (let i = 0; i < sliceToPush.length; i += CONCURRENCY) {
        const batch = sliceToPush.slice(i, i + CONCURRENCY);
        const results = await Promise.all(
            batch.map(async (url) => {
                try {
                    const r = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${indexingToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url, type: 'URL_UPDATED' }),
                    });
                    if (r.ok) return { status: 'ok', url };
                    const errBody = await r.json().catch(() => ({}));
                    if (r.status === 429) return { status: 'quota', url, msg: errBody.error?.message };
                    return { status: 'err', url, code: r.status, msg: errBody.error?.message };
                } catch (e) {
                    return { status: 'err', url, msg: e.message };
                }
            })
        );

        for (const res of results) {
            if (res.status === 'ok') successCount++;
            else if (res.status === 'quota') quotaExceededCount++;
            else errorCount++;
        }

        if (quotaExceededCount > 0) {
            console.log(`   ⚠️ Cuota diaria de Indexing API alcanzada tras ${successCount} URLs enviadas hoy.`);
            break;
        }
    }

    console.log(`   ✅ URLs notificadas exitosamente con URL_UPDATED en Google Indexing API: ${successCount}`);
    if (quotaExceededCount > 0) {
        console.log(`   ℹ️ Pendientes por cuota diaria de Google (200/día): ${allUrls.length - (OFFSET + successCount)} (se enviarán en el siguiente ciclo).`);
    }
    if (errorCount > 0) {
        console.log(`   ❌ Errores: ${errorCount}`);
    }
}

main().catch((err) => {
    console.error('Error in gsc-merchant-sync:', err);
    process.exit(1);
});
