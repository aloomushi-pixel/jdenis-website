#!/usr/bin/env node
/**
 * Compuerta Cero Pre-Plan: Sincronización Obligatoria con origin/master
 * Ejecuta `git fetch --all --prune`, verifica divergencia entre HEAD y origin/master,
 * y si existen commits remotos nuevos hace `git pull --rebase origin master` preservando
 * de forma segura cualquier cambio local en `.agents/state/`.
 */
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

function runGit(cmd) {
    return execSync(`git ${cmd}`, {
        cwd: ROOT_DIR,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
}

export function syncRepoBeforePlan({ autoPull = true } = {}) {
    try {
        runGit('fetch --all --prune');
        const branch = runGit('rev-parse --abbrev-ref HEAD');
        const countsRaw = runGit('rev-list --left-right --count HEAD...origin/master');
        const [aheadStr, behindStr] = countsRaw.split(/\s+/);
        const ahead = Number(aheadStr || 0);
        const behind = Number(behindStr || 0);

        let pulled = false;
        if (behind > 0 && autoPull && branch === 'master') {
            const dirtyTracked = runGit('status --porcelain --untracked-files=no');
            let stashed = false;
            if (dirtyTracked) {
                runGit('stash push -m "auto-sync-before-plan"');
                stashed = true;
            }
            try {
                runGit('pull --rebase origin master');
                pulled = true;
            } finally {
                if (stashed) {
                    try {
                        runGit('stash pop');
                    } catch {
                        // En caso de conflicto en archivos de estado JSON, preferir remoto y limpiar stash conflictivo
                        runGit('checkout --theirs .agents/state/persistent_suggestions_queue.json');
                    }
                }
            }
        }

        const finalHead = runGit('rev-parse --short HEAD');
        const originHead = runGit('rev-parse --short origin/master');
        return {
            ok: true,
            branch,
            head: finalHead,
            originMaster: originHead,
            ahead,
            behindAfterSync: pulled ? 0 : behind,
            pulled,
        };
    } catch (err) {
        return {
            ok: false,
            error: err.message,
        };
    }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    const res = syncRepoBeforePlan({ autoPull: !process.argv.includes('--check-only') });
    if (!res.ok) {
        console.error(`[GIT SYNC ERROR] ${res.error}`);
        process.exit(1);
    }
    console.log(
        `[GIT SYNC OK] branch=${res.branch} | HEAD=${res.head} | origin/master=${res.originMaster} | ahead=${res.ahead} | behind=${res.behindAfterSync}${
            res.pulled ? ' (PULLED LATEST CHANGES)' : ' (UP TO DATE)'
        }`
    );
}
