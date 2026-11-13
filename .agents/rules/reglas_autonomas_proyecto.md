<!-- IMMUTABLE_GUARDRAILS_START -->
# 🔒 Candados Intocables de Producción — J. Denis Cosméticos (`SHA-256 Sealed`)

1. **Cero Gasto Publicitario o Cargos Financieros No Autorizados:** Queda estrictamente prohibido activar campañas CPC pagadas (Google Ads, Meta Ads, TikTok Ads), contratar suscripciones externas o ejecutar cargos/reembolsos financieros reales en Mercado Pago/bancos sin orden explícita del propietario en el chat.
2. **Cero Destrucción de Datos o Esquemas (`Supabase zdciwzeokkrwcxvsgusc`):** Prohibido ejecutar `DROP`, `TRUNCATE`, `DELETE` masivo o alteraciones destructivas sobre tablas productivas (`products`, `website_orders`, `order_items`, `users`, `quotations`, `distributor_applications`, `analytics_events`, `autonomous_evolution_logs`).
3. **Cero Alteración Unilateral de Precios, Márgenes o Reglas Fiscales:** Prohibido modificar precios base minoristas (`price`), precios mayoristas (`distributor_price`), umbral de envío gratis (`$2,000 MXN`), reglas de descuentos/cupones o lógica fiscal CFDI 4.0 sin autorización explícita.
4. **Cero Interrupción Operativa y Cero Exposición de Secretos:** Prohibido interrumpir flujos activos de Tienda (`https://jdenis.store`), Checkout, PWA Clientes o Cotizador/ERP Interno (`/admin`), y estrictamente prohibido subir archivos `.env`, `.gsc-credentials.json`, llaves API o credenciales al repositorio Git.
5. **Compuerta Determinista de Calidad Pre-Deploy:** Ningún commit o despliegue a Dokploy puede ejecutarse si `npx.cmd tsc -b --noEmit` o `npm.cmd run build` arrojan un solo error (`exit code != 0`), o si la verificación criptográfica `verify_immutable_guardrails.js` falla.
<!-- IMMUTABLE_GUARDRAILS_END -->

---

## ⚙️ Política Operativa Mutable del Ecosistema v4.0 (Ajustable por `meta-prompt-auditor`)

### 1. Arquitectura Estricta de Dos Loops Diurnos (`America/Mexico_City`, Cero Madrugada)
- **Loop 1 (Principal) — `jdenis-loop-consciente` (`0 10,15,20 * * *` CDMX):**
  - Dueño exclusivo de telemetría 3D (`jdennis-digest-engine.mjs`), Google Search Console (`sc-domain:jdenis.store`), SEO técnico (`<title> <= 60c`, `<meta description> <= 160c`, paridad `1:1` con Schema `JSON-LD`), GEO (`/llms.txt` y atribución IA `ChatGPT`/`Perplexity`/`Claude`/`Gemini`), búsqueda interna/CRO y Monitores UX Conscientes (`ux_feedback`, `js_exception`, `unhandled_rejection`, `touch_target_violation >= 44x44px`, `rage_click`, `dead_click`, Core Web Vitals).
- **Loop 2 (Secundario de Periodo Largo) — `jdenis-meta-prompt-auditor` (`30 20 1,6,11,16,21,26 * *` CDMX):**
  - Dueño exclusivo de la auditoría empírica de `.agents/state/prompt_performance_ledger.jsonl` y de las decisiones del usuario en `.agents/state/persistent_suggestions_queue.json`, refinando las reglas mutables y `SKILL.md` locales (y evolucionando con respaldo fechado el Prompt Maestro Universal cuando descubre mejoras transversales validadas).

### 2. Matriz Inteligente de Modelos y Esfuerzo (`Gemini 4`)
- **Pulso silencioso sin anomalías (`0` fricciones nuevas, `0` desviaciones SEO/UX):** `Gemini 4 Hydrogen (Low / Medium)` -> registra en bitácora y cierra sin enviar correo spam.
- **Ejecución Nivel 1–2 (mejoras SEO/GEO/CRO, corrección UX `>= 44x44px`, sinónimos, compilación `tsc` y deploy Dokploy):** `Gemini 4 Hydrogen (High)`.
- **Cruce profundo interno vs. competencia externa o depuración multipaso:** `Gemini 4 Argon (High)` o `Gemini 4 Hydrogen (Extra)`.
- **Diseño de planes Nivel 3 y ejecución del Loop 2 (`meta-prompt-auditor`):** `Gemini 4 Carbon (High)`.

### 3. Gobernanza por Jerarquía de Rol y Magnitud Técnica
- **👑 Grupo A (`ADMIN`, `SUPERVISOR`, `ADVISOR` + Monitores Técnicos Objetivos):** Preconsentimiento directo para implementar, validar (`0` errores TS/Build), desplegar en Dokploy y cerrar como `RESUELTO_EN_LOOP` mejoras **Nivel 1 (Menor)** y **Nivel 2 (Mediano 100% retrocompatible)**.
- **📋 Grupo B (`CLIENT`, `DISTRIBUIDOR`, `EJECUTIVO`, `FABRICA`, `ALMACEN_*`, `TRANSPORTISTA`, `VISITOR`):** **No ejecutar en automático.** Diagnosticar archivo/capa exacta, redactar propuesta técnica y registrar en `.agents/state/persistent_suggestions_queue.json` con estado `EN_COLA_AUTORIZACION`.
- **🔴 Nivel 3 (Mayor / Arquitectónico / Financiero / Esquema BD / Nuevas Rutas Globales):** Sin importar el rol solicitante, **no ejecutar en automático**; documentar plan técnico, registrar como `EN_ANALISIS_MAYOR` en la Cola Persistente y solicitar autorización explícita.

### 4. Protocolo Anti-Spam Resend (`aloomushi@gmail.com`, `caballeroangela49@gmail.com`)
- Cero correos en pulsos `POSTPONED` con `0` cambios y `0` pendientes nuevos.
- Máximo **2 cortes ejecutivos diarios** consolidados (o cuando haya `IMPLEMENTED`, `ACTION_REQUIRED`, `PROMPT_EVOLVED` o nuevos ítems en cola).
- Todo correo incluye obligatoriamente al final la tabla completa acumulada de ítems `PENDIENTE`, `EN_COLA_AUTORIZACION` y `EN_ANALISIS_MAYOR`.
