# Loop 2 (Secundario): Meta-Agente Auditor Continuo de Prompts (`meta-prompt-auditor`)

Ejecutado en cadencia de periodo largo (`CRON_TZ=America/Mexico_City 30 20 1,6,11,16,21,26 * *` — cada 5 días a las `20:30` hrs CDMX) con **`Gemini 4 Carbon (High)`**.

## Protocolo Recursivo de Doble Nivel (Pilar 7)

### Paso 1: Verificación Criptográfica Pre-Intervención
1. Ejecuta `node .agents/scripts/verify_immutable_guardrails.js`. Si falla (`exit != 0`), aborta de inmediato y emite alerta crítica.

### Paso 2: Auditoría Cuantitativa Empírica
1. Lee `.agents/state/prompt_performance_ledger.jsonl` (últimos ciclos de Loop 1: duración, modelo/esfuerzo, reintentos, errores TS/build evitados o detectados, impacto en CTR/impresiones GSC, sesiones humanas, conversiones y fricciones UX).
2. Lee `.agents/state/persistent_suggestions_queue.json` para analizar el **patrón real de aprobación vs. descarte del propietario** (`RESUELTO_POR_ORDEN` vs `DESCARTADO`).

### Paso 3: Autoperfeccionamiento Local (Prompts, Reglas Mutables y Skills de J. Denis)
1. Refina `.agents/rules/reglas_autonomas_proyecto.md` (**únicamente debajo de `<!-- IMMUTABLE_GUARDRAILS_END -->`**) y `.agent/skills/jdennis-autonomous-growth/`:
   - Elimina instrucciones verbosas o redundantes que consumen tokens sin impacto medible.
   - Agrega heurísticas preventivas ante errores recurrentes de SEO, hidratación, búsqueda o UX móvil.
   - Recalibra la asignación de `Hydrogen (Low/Med/High)` vs `Argon/Carbon` según resultados reales.

### Paso 4: Autoperfeccionamiento Global (Evolución del Prompt Maestro Universal)
1. Si y solo si se validó empíricamente una mejora **universal y transversal** aplicable a cualquier proyecto futuro:
   - Guarda primero una copia íntegra fechada en `.agents/state/master_prompt_history/YYYY-MM-DD_pre_update.md`.
   - Actualiza la sección táctica correspondiente en `C:\Users\info\OneDrive\Desktop\prompt_maestro_ecosistema_autonomo_universal.md` y agrega una línea fechada en su sección `Historial Evolutivo`, sin alterar jamás sus candados de seguridad.

### Paso 5: Verificación Criptográfica Post-Intervención y Reporte con `diff`
1. Ejecuta nuevamente `node .agents/scripts/verify_immutable_guardrails.js`. Si el hash `SHA-256` del Bloque Intocable cambió en un solo byte, revierte inmediatamente con `git checkout -- .agents/rules/reglas_autonomas_proyecto.md` y aborta.
2. Envía el corte ejecutivo de Loop 2 incluyendo `--prompt-diff="..."` vía `scripts/jdennis-evolution-notifier.mjs --run=1 --loop="meta-prompt-auditor" --model="Gemini 4 Carbon (High)" --status="PROMPT_EVOLVED|POSTPONED" ...`.
