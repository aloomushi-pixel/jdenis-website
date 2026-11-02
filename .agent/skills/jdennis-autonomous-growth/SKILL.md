---
name: jdennis-autonomous-growth
description: Protocolo operativo perpetuo para auditar telemetría tridimensional de JDennis (Web/SEO, App PWA Clientes y Cotizador/Pedidos de Empleados), verificar deploys en Dokploy vía /__version.json y ejecutar mejoras autónomas continuas.
---

# Skill: JDennis Autonomous Growth & Operations Engine

Esta skill rige cada despertar del timer (`schedule`) o invocación manual de optimización continua sobre el ecosistema **J. Denis Cosméticos México** (`https://jdenis.store`).

## Protocolo Operativo en 5 Pasos

### Paso 1: Verificación de Autodeploy en Dokploy (`/__version.json`)
1. Obtén el hash local más reciente: `git rev-parse HEAD`.
2. Consulta el endpoint de producción: `https://jdenis.store/__version.json?t=<timestamp>` o ejecuta `node scripts/jdennis-digest-engine.mjs`.
3. Evalúa el estado:
   - **Si `commitSha` coincide con `HEAD` y las rutas clave responden HTTP `200`**: El deploy en Dokploy fue exitoso. Continúa al Paso 2.
   - **Si `commitSha` NO coincide tras >5 minutos o el servidor devuelve `502/503/504`**: ¡El build o contenedor en Dokploy falló! Inspecciona el último commit (`git show --stat`), ejecuta `cd website && npx tsc -b --noEmit && npm run build` localmente para reproducir el fallo, corrige la causa raíz de inmediato y haz `git push origin master`.

### Paso 2: Extracción y Diagnóstico de Telemetría Tridimensional
Ejecuta el motor de diagnóstico por consola:
```bash
node scripts/jdennis-digest-engine.mjs --days=7
```
Analiza las 3 dimensiones en `public.analytics_events`:
- **Dimensión A (Web & E-Commerce)**: Embudo `page_view` -> `product_view` -> `add_to_cart` -> `checkout_start` -> `payment_attempt` -> `purchase_complete`, además de `rage_click`, `dead_click`, `form_abandon` y `cwv_metric`.
- **Dimensión B (PWA Clientes)**: `pwa_prompt_shown`, `pwa_installed`, `pwa_session_start` y retención `pwa_standalone` vs `web`.
- **Dimensión C (Operación Interna Empleados)**: `quote_flow_start` -> `quote_flow_saved`, `quote_save_error`, `order_flow_saved` y `api_latency_or_error`.

### Paso 3: Toma de Decisiones y Ejecución Autónoma (Orden Estricto de Prioridad)
En cada ciclo, selecciona e implementa **1 o 2 mejoras concretas, seguras y de alto impacto**:

1. **Prioridad 1 — Fricción Operativa de Empleados y Errores de Compra**:
   - Si existen eventos `quote_save_error`, `payment_error` o `api_latency_or_error` (>1500ms) en el Cotizador (`website/src/components/crm/Quoter.tsx`) o Gestión de Pedidos (`website/src/pages/admin/SalesOrders.tsx`), optimiza la consulta o validación de inmediato.
2. **Prioridad 2 — Conversión E-Commerce y Retención en App (PWA)**:
   - Si una ficha de producto o categoría tiene muchas vistas (`product_view`) pero baja adición al carrito (`add_to_cart`), o si existen `rage_click` / `dead_click` en móvil, mejora la claridad de variantes/tonos, micro-copy de beneficios o botón sticky de compra.
3. **Prioridad 3 — Expansión de SEO Genérico (Non-Branded) y Sinónimos de Búsqueda**:
   - Si `product_search` registra búsquedas con `0 resultados` (ej. términos coloquiales de cosmetiquería femenina en México), agrégalos a `GENERIC_SYNONYM_MAP` en `website/src/utils/seoData.ts` y enriquece los bloques semánticos y FAQs de categorías/productos y `website/public/llms.txt`.

### Paso 4: Verificación Estricta, Registro en Bitácora y Push a GitHub/Dokploy
1. Ejecuta dentro de `website/`:
   ```bash
   npx tsc -b --noEmit && npm run build
   ```
   *(Ambos comandos deben terminar con **0 errores** y regenerar `website/public/__version.json` y `website/public/sitemap.xml`).*
2. Registra el ciclo en `jdennis_agent_changelog.json` y sincroniza `website/public/jdennis_agent_changelog.json`.
3. Haz commit descriptivo y `git push origin master`.

### Paso 5: Re-programación Dinámica del Timer (`schedule`)
- **Recién hecho un `git push` a producción**: Programa `DurationSeconds` entre `600` y `1200` (10–20 minutos) para verificar que Dokploy construyó y desplegó el nuevo `commitSha` en `https://jdenis.store/__version.json`.
- **Con deploy verificado y operación estable**: Programa el siguiente ciclo de auditoría entre `14400` y `43200` segundos (4–12 horas).
