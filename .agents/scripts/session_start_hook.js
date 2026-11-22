#!/usr/bin/env node
/**
 * Hook SessionStart (Estándar Maestro v4.0 — Resiliencia post-reinicio SO / actualización IDE)
 * Lee contexto por stdin, verifica el sello SHA-256 del Bloque Intocable y notifica al agente
 * el estado de la Cola Persistente y de los 2 Loops Diurnos para auto-continuación inmediata.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyGuardrails } from './verify_immutable_guardrails.js';
import { syncRepoBeforePlan } from './sync_repo_before_plan.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');
const QUEUE_PATH = path.join(ROOT_DIR, '.agents', 'state', 'persistent_suggestions_queue.json');

let stdinRaw = '';
try {
    stdinRaw = fs.readFileSync(0, 'utf8');
} catch {
    // ignore empty stdin
}
void stdinRaw;

let guardrailMsg = 'SHA-256 OK';
try {
    const check = verifyGuardrails();
    guardrailMsg = check.ok ? `SHA-256 OK (${check.sha256.slice(0, 12)}...)` : `ALERTA SHA-256: ${check.error}`;
} catch (e) {
    guardrailMsg = `Error verificando SHA-256: ${e.message}`;
}

let pendingCount = 0;
try {
    if (fs.existsSync(QUEUE_PATH)) {
        const q = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
        pendingCount = Array.isArray(q.items)
            ? q.items.filter((i) => ['PENDIENTE', 'EN_COLA_AUTORIZACION', 'EN_ANALISIS_MAYOR'].includes(i.status)).length
            : 0;
    }
} catch {
    // ignore
}

const gitSync = syncRepoBeforePlan({ autoPull: true });
const gitMsg = gitSync.ok
    ? `Git Sync OK (HEAD=${gitSync.head} == origin/master=${gitSync.originMaster}${gitSync.pulled ? ', auto-pulled' : ''})`
    : `Git Sync Warn (${gitSync.error})`;

const msg = `[Ecosistema Autónomo J. Denis v4.0 Activo] ${gitMsg} | Candado: ${guardrailMsg} | Cola Persistente: ${pendingCount} pendiente(s). REGLA OBLIGATORIA PRE-PLAN: Antes de diagnosticar, proponer un plan o editar archivos, ejecuta siempre \`node .agents/scripts/sync_repo_before_plan.js\` (\`git fetch --all --prune\` + \`git pull --rebase origin master\`) para garantizar que estás 100% al día con el repositorio remoto.`;

process.stdout.write(
    JSON.stringify({
        injectSteps: [
            {
                systemMessage: {
                    systemMessage: msg,
                },
            },
        ],
    })
);
