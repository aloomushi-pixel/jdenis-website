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

const msg = `[Ecosistema Autónomo J. Denis v4.0 Activo] Candado: ${guardrailMsg} | Cola Persistente: ${pendingCount} pendiente(s). Si la sesión se acaba de reanudar tras actualización de SO/IDE y el usuario solicita operaciones autónomas, verifica con manage_task que estén activos únicamente los 2 CRONS diurnos (Loop 1 Consciente: '0 10,15,20 * * *' y Loop 2 Meta-Prompt Auditor: '30 20 1,6,11,16,21,26 * *' en America/Mexico_City).`;

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
