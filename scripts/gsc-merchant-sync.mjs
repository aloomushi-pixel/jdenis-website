#!/usr/bin/env node
/**
 * J. DENIS — Auditoría de Catálogo, Normalización de SKUs y Registro en Google Search Console (Merchant Listings / Sitemaps)
 * Uso: node scripts/gsc-merchant-sync.mjs
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import pg from 'pg';

const DB_URL =
    'postgresql://postgres.zdciwzeokkrwcxvsgusc:E4ae5d6c0c.@aws-0-us-west-2.pooler.supabase.com:6543/postgres';
const SITE_URL = 'sc-domain:jdenis.store';
const BASE_URL = 'https://jdenis.store';

function base64UrlEncode(strOrBuf) {
    const buf = Buffer.isBuffer(strOrBuf) ? strOrBuf : Buffer.from(strOrBuf, 'utf8');
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function getGscWriteToken() {
    const credPath = path.resolve(process.cwd(), '.gsc-credentials.json');
    const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    const now = Math.floor(Date.now() / 1000);
    const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const claimSet = base64UrlEncode(
        JSON.stringify({
            iss: creds.client_email,
            scope: 'https://www.googleapis.com/auth/webmasters',
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
    console.log('🛍️ J. DENIS — AUDITORÍA DE PRODUCTOS Y REGISTRO EN SEARCH CONSOLE');
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
        SELECT id, slug, sku, name, description, price, distributor_price, image_url, category, stock
        FROM public.products
        WHERE is_active = true
        ORDER BY name ASC
    `);
    await pool.end();

    const withSlug = activeProducts.filter((p) => p.slug && p.slug.trim());
    const withSku = activeProducts.filter((p) => p.sku && p.sku.trim());
    const withDesc = activeProducts.filter((p) => p.description && p.description.trim().length >= 15);
    const withImg = activeProducts.filter((p) => p.image_url && p.image_url.startsWith('http'));
    const withPrice = activeProducts.filter((p) => Number(p.price) > 0);

    console.log(`   - Total Productos Activos:        ${activeProducts.length}`);
    console.log(`   - Con URL Semántica (slug):       ${withSlug.length}/${activeProducts.length}`);
    console.log(`   - Con SKU Oficial (JD-...):       ${withSku.length}/${activeProducts.length}`);
    console.log(`   - Con Descripción Completa:       ${withDesc.length}/${activeProducts.length}`);
    console.log(`   - Con Imagen HTTPS Válida:        ${withImg.length}/${activeProducts.length}`);
    console.log(`   - Con Precio > $0.00 MXN:         ${withPrice.length}/${activeProducts.length}\n`);

    // 2. Submit Sitemaps to Google Search Console API
    const token = await getGscWriteToken();
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
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(`   - PUT ${feedUrl} -> HTTP ${putRes.status} (${putRes.status === 204 || putRes.ok ? 'REGISTRADO OK' : 'ERROR'})`);
    }

    // 3. Verify Registered Sitemaps in Search Console
    const listRes = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const listData = await listRes.json();
    console.log('\n3. Sitemaps Registrados en Google Search Console:');
    for (const sm of listData.sitemap || []) {
        console.log(
            `   • ${sm.path} | Enviado: ${sm.lastSubmitted || 'ahora'} | Errores: ${sm.errors || 0} | Advertencias: ${sm.warnings || 0}`
        );
    }

    // 4. Inspect sample key product URLs in Search Console URL Inspection API
    const sampleUrls = [
        `${BASE_URL}/producto/laminado-cejas`,
        `${BASE_URL}/producto/jade-rizado-pestanas`,
        `${BASE_URL}/producto/chocolate-pigmento-cejas`,
        `${BASE_URL}/producto/activador-henna`,
        `${BASE_URL}/producto/botox-pestanas`,
        `${BASE_URL}/producto/dark-red-pigmento-cejas`,
        `${BASE_URL}/producto/godete-cristal`,
    ];

    console.log('\n4. Inspección en Vivo de URLs de Producto en Google Search Console API:');
    for (const url of sampleUrls) {
        const inspRes = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inspectionUrl: url,
                siteUrl: SITE_URL,
                languageCode: 'es-MX',
            }),
        });
        const inspData = await inspRes.json();
        const idx = inspData.inspectionResult?.indexStatusResult;
        const rich = inspData.inspectionResult?.richResultsResult;
        const richTypes = (rich?.detectedItems || []).map((d) => d.richResultType).join(', ') || 'Pendiente de re-rastreo';
        console.log(
            `   • ${url}\n     Estado: ${idx?.coverageState || 'N/A'} (${idx?.verdict || 'N/A'}) | Último rastreo: ${
                idx?.lastCrawlTime || 'Pendiente'
            } | Rich Results: ${richTypes}`
        );
    }
}

main().catch((err) => {
    console.error('Error in gsc-merchant-sync:', err);
    process.exit(1);
});
