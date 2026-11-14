/**
 * Script de importación idempotente para Supabase (jdenis.store)
 *
 * Requisitos:
 *   1. Haber ejecutado primero `001_jdenis_catalog_migration.sql` en el SQL Editor de Supabase.
 *   2. Instalar cliente si aún no está en el proyecto:
 *      npm install @supabase/supabase-js
 *   3. Ejecutar con variables de entorno (usar SERVICE_ROLE_KEY para saltar RLS durante la carga):
 *      SUPABASE_URL="https://<tu-proyecto>.supabase.co" \
 *      SUPABASE_SERVICE_ROLE_KEY="<tu-service-role-key>" \
 *      node seed_jdenis_supabase.mjs
 */

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Error: Define SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tus variables de entorno antes de ejecutar.'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const PRODUCTS_JSON_PATH = resolve(__dirname, 'jdenis_products.json');
const VARIANTS_JSON_PATH = resolve(__dirname, 'jdenis_product_variants.json');
const BATCH_SIZE = 100;

async function upsertInBatches(tableName, rows, conflictColumn) {
  let processed = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const chunk = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from(tableName)
      .upsert(chunk, { onConflict: conflictColumn });

    if (error) {
      throw new Error(`Error al importar lote en ${tableName} (filas ${i + 1}-${i + chunk.length}): ${error.message}`);
    }
    processed += chunk.length;
    console.log(`[${tableName}] ${processed}/${rows.length} registros sincronizados...`);
  }
}

async function main() {
  console.log('Leyendo archivos JSON del catálogo J. Denis...');
  const products = JSON.parse(await readFile(PRODUCTS_JSON_PATH, 'utf8'));
  const variants = JSON.parse(await readFile(VARIANTS_JSON_PATH, 'utf8'));

  console.log(`Productos padre cargados: ${products.length}`);
  console.log(`Variantes cargadas:       ${variants.length}`);

  // 1. Upsert de productos padre
  await upsertInBatches('products', products, 'product_id');

  // 2. Upsert de variantes hijas
  await upsertInBatches('product_variants', variants, 'variant_id');

  // 3. Sincronizar secuencias IDENTITY para futuros altas desde el panel admin
  const { error: seqError } = await supabase.rpc('sync_catalog_sequences');
  if (seqError) {
    console.warn('Aviso: No se pudo ejecutar sync_catalog_sequences():', seqError.message);
  } else {
    console.log('Secuencias IDENTITY sincronizadas correctamente.');
  }

  // 4. Verificación rápida de conteos en base de datos
  const { count: prodCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
  const { count: varCount } = await supabase
    .from('product_variants')
    .select('*', { count: 'exact', head: true });

  console.log(`Importación finalizada: ${prodCount} productos y ${varCount} variantes en Supabase.`);
}

main().catch((err) => {
  console.error('Fallo durante la importación:', err.message);
  process.exit(1);
});
