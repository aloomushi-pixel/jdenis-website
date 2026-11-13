# Loop 1 (Principal): Autoperfeccionamiento Consciente SEO + GEO + Catálogo/CRO + Monitores UX

## 1. Compuerta Criptográfica y Diagnóstico Determinista
1. Ejecuta `node .agents/scripts/verify_immutable_guardrails.js` (aborta si `exit != 0`).
2. Ejecuta `node scripts/jdennis-digest-engine.mjs --days=7` para inspeccionar:
   - Producción en Dokploy (`https://jdenis.store/__version.json` HTTP 200).
   - Telemetría 3D en Supabase (`analytics_events`, `ux_events`, `ux_sessions`, `website_orders`, `quotations`, `distributor_applications`).
   - **Monitores UX Conscientes v4.0:** `ux_feedback` (Buzón en vivo), `js_exception`, `unhandled_rejection`, `touch_target_violation` (`< 44×44 px` en móvil), `seo_hydration_audit`, `rage_click`, `dead_click`, `form_abandon` y Core Web Vitals (`TTFB`, `LCP`, `CLS`, `INP`).
   - **Google Search Console (`sc-domain:jdenis.store`):** Queries e impresiones en posición `4.0–15.0`, oportunidades de CTR y cobertura de `sitemap.xml`.
   - **GEO (Motores IA):** Tráfico referido de `ChatGPT`, `Perplexity`, `Claude`, `Gemini` y rastreo de `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot` sobre `/llms.txt` y rutas prerenderizadas.

## 2. Reglas Técnicas SEO, GEO y UX v4.0
- **SEO Estricto:** `100%` de rutas con `<title> <= 60` caracteres, `<meta name="description"> <= 160` caracteres y paridad `1:1` entre HTML prerenderizado, hidratación React (`usePageMeta`) y Schema `JSON-LD` (`Product`, `CollectionPage`, `FAQPage`, `Article`).
- **Ergonomía Táctil Móvil:** Todo botón o control interactivo móvil debe cumplir área táctil `>= 44×44 px` (`min-w-[44px] min-h-[44px]` o `w-11 h-11`) y contraste legible.
- **Búsqueda Interna:** Cero búsquedas reales con `results=0` cuando exista producto equivalente en catálogo, y filtrado de stopwords para evitar resultados sobre-amplios.

## 3. Gobernanza por Rol y Magnitud (Pilar 4)
- **👑 Grupo A (`ADMIN`, `SUPERVISOR`, `ADVISOR` + Monitores Técnicos Objetivos):**
  - **Nivel 1 (Menor)** y **Nivel 2 (Mediano 100% retrocompatible):** Implementar en el acto, validar `cd website; npx.cmd tsc -b --noEmit; npm.cmd run build` (`0` errores), hacer `git commit && git push origin master`, desplegar en Dokploy (`http://187.124.86.20:3000`, App `K5ptRlcqXHsqe0u1U5y6w`) y verificar `/__version.json`.
- **📋 Grupo B (`CLIENT`, `DISTRIBUIDOR`, `EJECUTIVO`, `FABRICA`, `VISITOR`):**
  - **No ejecutar en automático.** Diagnosticar archivo/capa exacta, redactar propuesta técnica y registrar en `.agents/state/persistent_suggestions_queue.json` como `EN_COLA_AUTORIZACION`.
- **🔴 Nivel 3 (Mayor / Arquitectónico / Precios / Fiscal / BD):**
  - **No ejecutar en automático.** Documentar plan técnico y registrar como `EN_ANALISIS_MAYOR` en `.agents/state/persistent_suggestions_queue.json`.

## 4. Cierre Anti-Spam y Registro en Ledger (Pilar 5 y 7)
Ejecuta siempre al cerrar:
```bash
node scripts/jdennis-evolution-notifier.mjs --run=1 --loop="loop1-consciente" --model="Gemini 4 Hydrogen (High)" --version="v4.0.X-..." --cycle=N --status="IMPLEMENTED|POSTPONED|ACTION_REQUIRED" --summary="..." --findings="..." --changes="..." --postponed="..." --commit="<sha>"
```
- En pulsos `POSTPONED` con `0` cambios y `0` ítems nuevos en cola, el script registra en `autonomous_evolution_logs` y `.agents/state/prompt_performance_ledger.jsonl` **sin enviar correo spam** (máximo 2 cortes ejecutivos diarios).
