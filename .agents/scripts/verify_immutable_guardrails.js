#!/usr/bin/env node
/**
 * Verificador Criptográfico SHA-256 del Bloque Intocable (Estándar Maestro v4.0)
 * Uso:
 *   node .agents/scripts/verify_immutable_guardrails.js          -> Verifica integridad (exit 0 OK, exit 1 TAMPERED)
 *   node .agents/scripts/verify_immutable_guardrails.js --seal   -> Sella el hash inicial (solo si no existe aún)
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');
const RULES_PATH = path.join(ROOT_DIR, '.agents', 'rules', 'reglas_autonomas_proyecto.md');
const SEAL_PATH = path.join(ROOT_DIR, '.agents', 'state', 'guardrails_sha256.json');

const START_MARKER = '<!-- IMMUTABLE_GUARDRAILS_START -->';
const END_MARKER = '<!-- IMMUTABLE_GUARDRAILS_END -->';

export function extractImmutableBlock(markdown) {
    const startIdx = markdown.indexOf(START_MARKER);
    const endIdx = markdown.indexOf(END_MARKER);
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
        throw new Error('Marcadores IMMUTABLE_GUARDRAILS_START / END ausentes o corruptos.');
    }
    // Normalize CRLF -> LF only for deterministic cross-OS hashing while preserving every character
    const rawBlock = markdown.slice(startIdx, endIdx + END_MARKER.length).replace(/\r\n/g, '\n');
    const sha256 = crypto.createHash('sha256').update(rawBlock, 'utf8').digest('hex');
    return { rawBlock, sha256 };
}

export function verifyGuardrails({ allowInitialSeal = false } = {}) {
    if (!fs.existsSync(RULES_PATH)) {
        return { ok: false, error: `No existe archivo de reglas: ${RULES_PATH}` };
    }
    const content = fs.readFileSync(RULES_PATH, 'utf8');
    const { sha256 } = extractImmutableBlock(content);

    if (!fs.existsSync(SEAL_PATH)) {
        if (!allowInitialSeal) {
            return { ok: false, error: `No existe sello SHA-256 en ${SEAL_PATH}. Ejecuta con --seal una sola vez.` };
        }
        fs.mkdirSync(path.dirname(SEAL_PATH), { recursive: true });
        const sealData = {
            project: 'J. Denis Cosméticos (https://jdenis.store)',
            algorithm: 'SHA-256',
            sha256,
            sealed_at: new Date().toISOString(),
            rules_file: '.agents/rules/reglas_autonomas_proyecto.md',
        };
        fs.writeFileSync(SEAL_PATH, JSON.stringify(sealData, null, 2), 'utf8');
        return { ok: true, sealed: true, sha256 };
    }

    const stored = JSON.parse(fs.readFileSync(SEAL_PATH, 'utf8'));
    if (stored.sha256 !== sha256) {
        return {
            ok: false,
            error: `ALERTA CRÍTICA: El hash SHA-256 del Bloque Intocable cambió. Esperado=${stored.sha256} | Actual=${sha256}`,
            expected: stored.sha256,
            actual: sha256,
        };
    }

    return { ok: true, sealed: false, sha256 };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    const isSeal = process.argv.includes('--seal');
    try {
        const res = verifyGuardrails({ allowInitialSeal: isSeal });
        if (!res.ok) {
            console.error(`[GUARDRAILS FAIL] ${res.error}`);
            process.exit(1);
        }
        console.log(`[GUARDRAILS OK] SHA-256=${res.sha256}${res.sealed ? ' (SELLADO INICIAL)' : ''}`);
        process.exit(0);
    } catch (err) {
        console.error(`[GUARDRAILS ERROR] ${err.message}`);
        process.exit(1);
    }
}
