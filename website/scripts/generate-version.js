import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function safeGit(cmd, fallback = 'unknown') {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    return fallback;
  }
}

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
const versionFilePath = path.join(publicDir, '__version.json');

let existingVersion = null;
try {
  if (fs.existsSync(versionFilePath)) {
    existingVersion = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
  }
} catch {
  // Ignore parse errors
}

const rawFullSha = process.env.SOURCE_COMMIT || process.env.COMMIT_SHA || process.env.GIT_COMMIT || safeGit('git rev-parse HEAD', '');
const fullSha = rawFullSha || (existingVersion && existingVersion.fullSha) || 'unknown';
const shortSha = fullSha !== 'unknown' ? fullSha.substring(0, 7) : safeGit('git rev-parse --short HEAD', (existingVersion && existingVersion.shortSha) || 'unknown');
const rawCommitMsg = process.env.COMMIT_MESSAGE || safeGit('git log -1 --pretty=%B', '');
const commitMessage = rawCommitMsg || (existingVersion && existingVersion.commitMessage) || 'Production Build';
const builtAt = new Date().toISOString();

const versionData = {
  commitSha: fullSha !== 'unknown' ? `${shortSha} (${fullSha})` : 'unknown',
  shortSha,
  fullSha,
  commitMessage: commitMessage.split('\n')[0],
  builtAt,
  environment: 'production'
};

fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2), 'utf8');
console.log(`[Version] Generated public/__version.json -> ${versionData.commitSha} @ ${builtAt}`);
