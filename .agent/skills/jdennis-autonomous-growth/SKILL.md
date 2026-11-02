---
name: jdennis-autonomous-growth
description: Protocolo operativo perpetuo (Estándar Maestro v2.1 + Google Search Console API + Gobernanza de Planes por Magnitud + Modo GOAL) para auditar telemetría tridimensional de JDennis (Web/SEO/GEO, App PWA Clientes y Cotizador/Pedidos de Empleados), enriquecer con Google Search Console (sc-domain:jdenis.store), verificar deploys en Dokploy vía /__version.json, registrar versiones IA en Supabase (autonomous_evolution_logs) y notificar por correo vía Resend en cada Timer.
---

# Skill: JDennis Autonomous Growth, Search Console & Operations Engine (Estándar Maestro v2.1)

Esta skill rige cada despertar del timer (`schedule`) o invocación manual de optimización continua sobre el ecosistema **J. Denis Cosméticos** (`https://jdenis.store`, Supabase `zdciwzeokkrwcxvsgusc`, Google Search Console `sc-domain:jdenis.store`).

## Protocolo Operativo en 5 Pasos (Estándar Maestro v2.1 + GSC + Gobernanza 3 Niveles)

### Paso 1: Verificación de Autodeploy en Dokploy (`/__version.json`) y Auditoría Integral
1. Ejecuta `node scripts/jdennis-digest-engine.mjs --days=7` para:
   - Verificar `https://jdenis.store/__version.json` en Dokploy.
   - Auditar la telemetría 3D en Supabase (`public.analytics_events`, `public.ux_events`, `public.ux_sessions`, `public.website_orders`, `public.quotations`).
   - Consultar en vivo **Google Search Console API (`sc-domain:jdenis.store`)** usando `.gsc-credentials.json` (Top Queries por impresiones y clics, CTR, posición media, páginas con mayor oportunidad de CTR/ranking y estado de `sitemap.xml`).

### Paso 2: Cruce de Telemetría 3D + Google Search Console (Pivotaje SEO/GEO/CRO)
Cruza los datos de Search Console con la telemetría de usuarios y bots IA:
- **Oportunidades de CTR y Posicionamiento (Search Console)**: Identifica páginas y queries con altas impresiones pero bajo CTR o en posición `4.0 – 15.0` (ej. `"j denis cejas"`, `"j denis pestañas"`, `"j denis laminado de cejas"`, `/cejas`, `/pestanas`, `/laminado-de-cejas`, `/lash-lifting`, `/henna-y-pigmentos`, `/producto/laminado-cejas`, `/producto/chocolate-pigmento-cejas`, `/producto/activador-henna`, `/producto/botox-pestanas`, `"j denis lindavista"`).
- **Dimensión A (Web, SEO/GEO & Embudo)**: Atribución IA (`ChatGPT`, `Perplexity`, `Claude`, `Gemini`), ubicación, `active_time_ms` vs `hidden_time_ms`, `rage_click`, `dead_click`, `text_copy`, `scroll_return_prices`, búsquedas internas (`product_search`) y pasos del embudo comercial.
- **Dimensión B (PWA Clientes)** y **Dimensión C (Operación Interna Empleados / Cotizador)**.

### Paso 3: Gobernanza de Planes e Implementación por Magnitud (Menor / Mediana / Mayor)
1. **🟢 Corrección o Mejora MENOR (`IMPLEMENTED` — Libertad Espontánea Inmediata, Sin Espera)**:
   - Títulos `<title>`, `<meta name="description">`, encabezados, FAQs, `JSON-LD`, `/llms.txt`, `sitemap.xml`, sinónimos de búsqueda, micro-mejoras de UX/CRO, bugs aislados o performance.
   - Impleméntala de inmediato, valida `cd website; npx.cmd tsc -b --noEmit; npm.cmd run build` con **0 errores**, y haz `git commit` + `git push origin master`.
2. **🟡 Corrección o Mejora MEDIANA (`IMPLEMENTED` con Plan Persistido — Sin Espera)**:
   - Secciones nuevas dentro de vistas existentes, mejoras de componentes UI/CRO o ajustes aditivos con cero riesgo de ruptura.
   - Documenta brevemente el plan, impleméntala en el mismo ciclo tras validar `0` errores de compilación y despliega. (Si altera navegación principal o lógica crítica, escálala a Mayor).
3. **🔴 Adecuación o Pivotaje MAYOR / ARQUITECTÓNICO (`ACTION_REQUIRED` — Requiere Autorización Explícita del Usuario)**:
   - Nuevas rutas/URLs, cambios en el enrutador principal, reestructuración de navegación global, cambios profundos de base de datos o cambios en el pipeline de build/SSR/pre-rendering.
   - **NO ejecutes cambios mayores sin permiso.** Persiste un artifact markdown (`gsc_architectural_pivot_plan.md`), ejecuta en el mismo ciclo únicamente las mejoras menores seguras, y reporta `status="ACTION_REQUIRED"` solicitando en `human_action_required` la autorización del usuario en esta sesión de Antigravity.
4. **⚪ Sin Cambios Necesarios (`POSTPONED`)**:
   - Si las métricas no ameritan intervención en este ciclo, pospón conscientemente sin hacer cambios forzados.

### Paso 4: Registro en `public.autonomous_evolution_logs` y Envío de Correo vía Resend
Al finalizar **CADA** timer, ejecuta `scripts/jdennis-evolution-notifier.mjs`:
```bash
node scripts/jdennis-evolution-notifier.mjs --run=1 --version="v2.1.X-..." --cycle=N --status="IMPLEMENTED|POSTPONED|ACTION_REQUIRED" --summary="..." --findings="..." --changes="..." --postponed="..." --human="..." --commit="<git_sha>" --timer=14400
```

### Paso 5: Re-programación Perpetua del Timer (`schedule`)
- Programa inmediatamente el siguiente timer con la herramienta `schedule` (`DurationSeconds: 14400`) sin detener la cadena autónoma.
