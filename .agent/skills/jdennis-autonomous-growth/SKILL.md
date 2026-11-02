---
name: jdennis-autonomous-growth
description: Protocolo operativo perpetuo (Estándar Maestro v2.0 + Modo GOAL) para auditar telemetría tridimensional de JDennis (Web/SEO/GEO, App PWA Clientes y Cotizador/Pedidos de Empleados), verificar deploys en Dokploy vía /__version.json, registrar versiones IA en Supabase (autonomous_evolution_logs) y notificar por correo vía Resend en cada Timer.
---

# Skill: JDennis Autonomous Growth & Operations Engine (Estándar Maestro v2.0)

Esta skill rige cada despertar del timer (`schedule`) o invocación manual de optimización continua sobre el ecosistema **J. Denis Cosméticos** (`https://jdenis.store`, Supabase `zdciwzeokkrwcxvsgusc`).

## Protocolo Operativo en 5 Pasos (Estándar Maestro v2.0)

### Paso 1: Verificación de Autodeploy en Dokploy (`/__version.json`)
1. Obtén el hash local más reciente: `git rev-parse HEAD`.
2. Ejecuta `node scripts/jdennis-digest-engine.mjs --days=7` para verificar `https://jdenis.store/__version.json` y auditar la telemetría acumulada.
3. Si el último deploy falló (502/503/504 o SHA desincronizado tras >5 min), corrige la causa raíz de inmediato.

### Paso 2: Extracción y Diagnóstico de Telemetría Tridimensional + UX/SEO/GEO
Analiza las vistas y tablas en Supabase (`public.analytics_events`, `public.ux_events`, `public.ux_sessions`, `public.website_orders`, `public.quotations`):
- **Dimensión A (Web, SEO/GEO & Embudo)**: Atribución de motores IA (`ChatGPT`, `Perplexity`, `Claude`, `Gemini`), ubicación (`country`, `region`, `city`), tiempo activo vs oculto (`active_time_ms` vs `hidden_time_ms`), `rage_click`, `dead_click`, `text_copy`, `scroll_return_prices`, búsquedas sin resultados (`product_search`) y pasos del embudo comercial.
- **Dimensión B (PWA Clientes)**: `pwa_prompt_shown`, `pwa_installed`, `pwa_session_start`.
- **Dimensión C (Operación Interna Empleados)**: `quote_flow_start` -> `quote_flow_saved`, `quote_save_error`, `order_flow_saved`, `api_latency_or_error`.

### Paso 3: Criterio Consciente (`IMPLEMENTED` vs `POSTPONED` vs `ACTION_REQUIRED`)
Evalúa conscientemente los datos del ciclo:
- **`IMPLEMENTED`**: Si la telemetría o auditoría espontánea justifica una mejora en UX, CRO, SEO técnico (`JSON-LD`, metas, encabezados), GEO (`llms.txt`), performance, Cotizador ERP o generación de recursos visuales con `image-generator` $\rightarrow$ Impleméntala, valida `cd website && npx.cmd tsc -b --noEmit && npm.cmd run build` con **0 errores**, y haz `git commit` + `git push origin master`.
- **`POSTPONED`**: Si tras terminar el timer no hubo tráfico nuevo suficiente o las métricas actuales no ameritan cambios $\rightarrow$ No hagas cambios forzados en el código; pospón conscientemente y regístralo.
- **`ACTION_REQUIRED`**: Si necesitas una foto real específica, confirmación de precios, credenciales o decisión comercial del humano $\rightarrow$ Regístralo en `human_action_required` y continúa operando en automático en lo demás.

### Paso 4: Registro en `public.autonomous_evolution_logs` y Envío de Correo vía Resend
Al finalizar **CADA** timer (sea `IMPLEMENTED`, `POSTPONED` o `ACTION_REQUIRED`), ejecuta `scripts/jdennis-evolution-notifier.mjs` para guardar la versión en Supabase y enviar el correo ejecutivo a `aloomushi@gmail.com` y `caballeroangela49@gmail.com`:
```bash
node scripts/jdennis-evolution-notifier.mjs --run=1 --version="v2.0.X-auto" --cycle=N --status="IMPLEMENTED|POSTPONED|ACTION_REQUIRED" --summary="..." --findings="..." --changes="archivo1,archivo2" --postponed="..." --human="" --commit="<git_sha>" --timer=14400
```

### Paso 5: Re-programación Perpetua del Timer (`schedule`)
- Programa inmediatamente el siguiente timer con la herramienta `schedule` (`DurationSeconds: 14400` para ciclos regulares o `600` tras un `git push` para verificar el autodeploy) sin detener la cadena autónoma.
