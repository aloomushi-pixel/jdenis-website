---
name: jdennis-autonomous-growth
description: Protocolo operativo perpetuo (Estándar Maestro v2.0 + Google Search Console API + Modo GOAL) para auditar telemetría tridimensional de JDennis (Web/SEO/GEO, App PWA Clientes y Cotizador/Pedidos de Empleados), enriquecer con Google Search Console (sc-domain:jdenis.store), verificar deploys en Dokploy vía /__version.json, registrar versiones IA en Supabase (autonomous_evolution_logs) y notificar por correo vía Resend en cada Timer.
---

# Skill: JDennis Autonomous Growth, Search Console & Operations Engine (Estándar Maestro v2.0)

Esta skill rige cada despertar del timer (`schedule`) o invocación manual de optimización continua sobre el ecosistema **J. Denis Cosméticos** (`https://jdenis.store`, Supabase `zdciwzeokkrwcxvsgusc`, Google Search Console `sc-domain:jdenis.store`).

## Protocolo Operativo en 5 Pasos (Estándar Maestro v2.0 + GSC)

### Paso 1: Verificación de Autodeploy en Dokploy (`/__version.json`) y Auditoría Integral
1. Ejecuta `node scripts/jdennis-digest-engine.mjs --days=7` para:
   - Verificar `https://jdenis.store/__version.json` en Dokploy.
   - Auditar la telemetría 3D en Supabase (`public.analytics_events`, `public.ux_events`, `public.ux_sessions`, `public.website_orders`, `public.quotations`).
   - Consultar en vivo **Google Search Console API (`sc-domain:jdenis.store`)** usando `.gsc-credentials.json` (Top Queries por impresiones y clics, CTR, posición media, páginas con mayor oportunidad de CTR/ranking y estado de `sitemap.xml`).

### Paso 2: Cruce de Telemetría 3D + Google Search Console (Pivotaje SEO/GEO/CRO)
Cruza los datos de Search Console con la telemetría de usuarios y bots IA:
- **Oportunidades de CTR y Posicionamiento (Search Console)**: Identifica páginas y queries con altas impresiones pero bajo CTR o en posición `4.0 – 15.0` (ej. `"j denis cejas"`, `"j denis pestañas"`, `"j denis laminado de cejas"`, `/producto/laminado-cejas`, `/producto/chocolate-pigmento-cejas`, `/producto/activador-henna`, `/producto/botox-pestanas`, `"j denis lindavista"`).
- **Dimensión A (Web, SEO/GEO & Embudo)**: Atribución IA (`ChatGPT`, `Perplexity`, `Claude`, `Gemini`), ubicación, `active_time_ms` vs `hidden_time_ms`, `rage_click`, `dead_click`, `text_copy`, `scroll_return_prices`, búsquedas internas (`product_search`) y pasos del embudo comercial.
- **Dimensión B (PWA Clientes)** y **Dimensión C (Operación Interna Empleados / Cotizador)**.

### Paso 3: Criterio Consciente y Regla de Escalamiento (`IMPLEMENTED` vs `POSTPONED` vs `ACTION_REQUIRED`)
Evalúa conscientemente el alcance de las mejoras requeridas en el ciclo:
1. **Mejoras Quirúrgicas / Menores (`IMPLEMENTED` — Libertad Espontánea)**:
   - Optimizaciones de títulos SEO, meta descripciones orientadas a CTR, bloques semánticos/FAQs para queries detectadas en Search Console, datos estructurados `JSON-LD`, actualización de `/llms.txt`, sinónimos de búsqueda, mejoras de UX/CRO, performance o generación de imágenes (`image-generator`).
   - Impleméntalas directamente, valida `cd website; npx.cmd tsc -b --noEmit; npm.cmd run build` con **0 errores**, y haz `git commit` + `git push origin master`.
2. **Modificaciones Sustancialmente Grandes / Arquitectónicas (`ACTION_REQUIRED` — Solicitud de Aprobación Humana)**:
   - Si el plan de pivotaje SEO o de producto requiere **adecuaciones mayores en la estructura arquitectónica de la web** (cambios profundos de rutas/URLs, reestructuración de navegación global, cambios de esquema de base de datos críticos o nuevas secciones mayores):
   - Diseña y deja listo el **Plan de Pivotaje / Implementación** en la sesión de Antigravity.
   - Registra el ciclo con `status="ACTION_REQUIRED"` y en el campo `--human` (`human_action_required`) del correo coloca claramente:
     *"Se solicita la aprobación del usuario en la sesión de Antigravity para ejecutar el Plan de Pivotaje / adecuaciones mayores en la estructura arquitectónica de la web: [resumen del plan]."*
3. **Sin Cambios Necesarios (`POSTPONED`)**:
   - Si las métricas no ameritan intervención en este ciclo, pospón conscientemente sin hacer cambios forzados.

### Paso 4: Registro en `public.autonomous_evolution_logs` y Envío de Correo vía Resend
Al finalizar **CADA** timer, ejecuta `scripts/jdennis-evolution-notifier.mjs`:
```bash
node scripts/jdennis-evolution-notifier.mjs --run=1 --version="v2.0.X-..." --cycle=N --status="IMPLEMENTED|POSTPONED|ACTION_REQUIRED" --summary="..." --findings="..." --changes="..." --postponed="..." --human="..." --commit="<git_sha>" --timer=14400
```

### Paso 5: Re-programación Perpetua del Timer (`schedule`)
- Programa inmediatamente el siguiente timer con la herramienta `schedule` (`DurationSeconds: 14400`) sin detener la cadena autónoma.
