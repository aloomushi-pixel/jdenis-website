#!/usr/bin/env node
/**
 * J. DENIS — Agente Guardián QA Autónomo de Backend (Uso Exclusivo Administrativo)
 *
 * Verifica de extremo a extremo todas las capas de https://jdenis.store y Supabase
 * sin tocar ni ensuciar el frontend público:
 *   1. Candado criptográfico SHA-256 (verify_immutable_guardrails.js)
 *   2. Salud HTTP de rutas críticas, Service Worker (no-store) y feeds XML/SEO
 *   3. Integridad del Catálogo v2 en Supabase REST (215 productos, 524 variantes, stock, precios, descripciones e imágenes HTTP 200)
 *   4. Salud de endpoints transaccionales REST (cupones, promos de carrito, academia, blog, reels, reseñas)
 *
 * Uso administrativo en backend / consola:
 *   node scripts/jdenis-qa-guardian.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyGuardrails } from '../.agents/scripts/verify_immutable_guardrails.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROD_URL = process.env.JDENNIS_PROD_URL || 'https://jdenis.store';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zdciwzeokkrwcxvsgusc.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2l3emVva2tyd2N4dnNndXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTM3NTksImV4cCI6MjA4ODIyOTc1OX0.qbXG0M2Zsjz-rOXY0CgAV2RfLledS67nqBw_dnvzkbg';

const checks = [];
function record(name, ok, detail) {
  checks.push({ name, ok: Boolean(ok), detail });
  const icon = ok ? '✅' : '❌';
  console.log(`${icon} ${name}: ${detail}`);
}

async function queryRest(endpoint) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  return { status: res.status, ok: res.ok, data: res.ok ? await res.json() : await res.text() };
}

async function main() {
  console.log('==================================================================');
  console.log('🛡️  J. DENIS — AGENTE GUARDIÁN QA DE BACKEND (USO ADMINISTRATIVO)');
  console.log(`📅 Fecha: ${new Date().toISOString()} | Target: ${PROD_URL}`);
  console.log('==================================================================\n');

  // 1. Guardrails SHA-256
  const guard = verifyGuardrails();
  record('Candado Criptográfico SHA-256', guard.ok, guard.ok ? `Intacto (${guard.sha256.slice(0, 16)}...)` : guard.error);

  // 2. Rutas web y cabeceras críticas anti-caché
  const routes = [
    '/',
    '/tienda',
    '/checkout',
    '/login',
    '/academia',
    '/blog',
    '/registro-distribuidor',
    '/solicitar-factura',
    '/health',
    '/__version.json',
    '/sitemap.xml',
    '/sitemap-productos.xml',
    '/google-merchant-feed.xml',
  ];
  for (const r of routes) {
    try {
      const resp = await fetch(`${PROD_URL}${r}?_qa=${Date.now()}`, { headers: { 'User-Agent': 'JDenis-Backend-QA-Guardian/1.0' } });
      record(`Ruta HTTP ${r}`, resp.status === 200, `HTTP ${resp.status}`);
    } catch (err) {
      record(`Ruta HTTP ${r}`, false, err.message);
    }
  }

  // Verificar cabecera no-store en /sw.js
  try {
    const sw = await fetch(`${PROD_URL}/sw.js?_qa=${Date.now()}`);
    const cc = sw.headers.get('cache-control') || '';
    const okSw = sw.status === 200 && (/no-store|no-cache/i.test(cc)) && !/immutable/i.test(cc);
    record('Service Worker (/sw.js) Anti-Stale Cache', okSw, `HTTP ${sw.status} | Cache-Control: ${cc}`);
  } catch (err) {
    record('Service Worker (/sw.js) Anti-Stale Cache', false, err.message);
  }

  // 3. Catálogo v2 en Supabase REST
  const prodRes = await queryRest('products?is_active=eq.true&select=product_id,slug,name,base_price_mxn,promo_price_mxn,total_stock,image_url,description');
  if (prodRes.ok && Array.isArray(prodRes.data)) {
    const prods = prodRes.data;
    const zeroStock = prods.filter(p => Number(p.total_stock) <= 0);
    const badPrice = prods.filter(p => Number(p.base_price_mxn) <= 0);
    const shortDesc = prods.filter(p => !p.description || p.description.trim().length < 10);
    record('Catálogo Productos Activos (Supabase)', prods.length >= 215, `${prods.length} activos`);
    record('Disponibilidad Stock Productos', zeroStock.length === 0, `${prods.length - zeroStock.length}/${prods.length} con stock > 0`);
    record('Integridad Precios Productos', badPrice.length === 0, `0 precios inválidos`);
    record('Legibilidad Descripciones', shortDesc.length === 0, `${prods.length - shortDesc.length}/${prods.length} legibles`);

    // Muestreo aleatorio/determinista de 15 imágenes CDN para validar HTTP 200
    const withUrl = prods.filter(p => p.image_url && p.image_url.startsWith('https://')).slice(0, 15);
    let okImgs = 0;
    await Promise.all(
      withUrl.map(async p => {
        try {
          const r = await fetch(p.image_url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
          if (r.ok) okImgs++;
        } catch {}
      })
    );
    record('Salud CDN Imágenes Oficiales (Muestra)', okImgs === withUrl.length, `${okImgs}/${withUrl.length} responden HTTP 200`);
  } else {
    record('Catálogo Productos Activos (Supabase)', false, `HTTP ${prodRes.status}`);
  }

  const varRes = await queryRest('product_variants?is_active=eq.true&select=variant_id,product_id,price_mxn,stock,image_url');
  if (varRes.ok && Array.isArray(varRes.data)) {
    const vars = varRes.data;
    const zeroVarStock = vars.filter(v => Number(v.stock) <= 0);
    record('Catálogo Variantes Activas (Supabase)', vars.length >= 524, `${vars.length} variantes activas`);
    record('Disponibilidad Stock Variantes', zeroVarStock.length === 0, `${vars.length - zeroVarStock.length}/${vars.length} con stock > 0`);
  } else {
    record('Catálogo Variantes Activas (Supabase)', false, `HTTP ${varRes.status}`);
  }

  // 4. Endpoints funcionales complementarios
  for (const [label, ep] of [
    ['Configuración Promos Carrito', 'cart_promo_config?select=id,is_active&limit=5'],
    ['Cupones Activos', 'coupons?is_active=eq.true&select=id,code&limit=5'],
    ['Cursos Academia STPS', 'academy_courses?select=id,title&limit=5'],
    ['Artículos Blog', 'blog_posts?select=id,slug&limit=5'],
    ['Social Reels', 'social_reels?active=eq.true&select=id,platform,video_url&limit=10'],
    ['Reseñas de Productos', 'product_reviews?select=id,status&limit=5'],
  ]) {
    const r = await queryRest(ep);
    record(`Módulo Funcional: ${label}`, r.ok, `HTTP ${r.status} (${Array.isArray(r.data) ? r.data.length : 0} filas muestra)`);
    if (label === 'Social Reels' && r.ok && Array.isArray(r.data)) {
      let okVids = 0;
      for (const reel of r.data) {
        if (reel.video_url) {
          try {
            const vr = await fetch(reel.video_url, { method: 'HEAD' });
            if (vr.ok) okVids++;
          } catch {}
        }
      }
      record('Videos TikTok / Reels Reproducibles (HTTP 200)', okVids === r.data.length && r.data.length > 0, `${okVids}/${r.data.length} videos MP4 activos`);
    }
  }

  const failed = checks.filter(c => !c.ok);
  console.log('\n==================================================================');
  console.log(`📊 RESUMEN FINAL QA: ${checks.length - failed.length}/${checks.length} verificaciones aprobadas`);
  console.log('==================================================================');

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error('Error fatal en Guardián QA:', err);
  process.exit(1);
});
