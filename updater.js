'use strict';

const { execFile } = require('child_process');
const path = require('path');

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    execFile(command, args, { cwd: options.cwd || process.cwd(), windowsHide: true, env: process.env, ...options }, (error, stdout, stderr) => {
      if (error) {
        resolve({ ok: false, stdout: stdout || '', stderr: stderr || '', error });
        return;
      }
      resolve({ ok: true, stdout: stdout || '', stderr: stderr || '', error: null });
    });
  });
}

async function tryAutoUpdate({ cwd = __dirname, enabled = true } = {}) {
  if (!enabled) return { ok: false, skipped: true, reason: 'disabled' };

  const gitDir = path.join(cwd, '.git');
  if (!require('fs').existsSync(gitDir)) {
    return { ok: false, skipped: true, reason: 'not-a-git-repo' };
  }

  const status = await runCommand('git', ['status', '--porcelain'], { cwd });
  if (!status.ok) {
    return { ok: false, skipped: true, reason: 'git-unavailable' };
  }

  const fetch = await runCommand('git', ['fetch', 'origin', 'master'], { cwd });
  if (!fetch.ok) {
    return { ok: false, skipped: true, reason: 'fetch-failed', detail: fetch.stderr.trim() };
  }

  const revParse = await runCommand('git', ['rev-parse', 'HEAD'], { cwd });
  const remoteRevParse = await runCommand('git', ['rev-parse', 'origin/master'], { cwd });
  if (!revParse.ok || !remoteRevParse.ok) {
    return { ok: false, skipped: true, reason: 'revision-check-failed' };
  }

  if (revParse.stdout.trim() === remoteRevParse.stdout.trim()) {
    return { ok: true, updated: false, reason: 'already-current' };
  }

  const pull = await runCommand('git', ['pull', '--ff-only', 'origin', 'master'], { cwd });
  if (!pull.ok) {
    return { ok: false, updated: false, reason: 'pull-failed', detail: pull.stderr.trim() };
  }

  return { ok: true, updated: true, reason: 'updated', detail: pull.stdout.trim() };
}

module.exports = { tryAutoUpdate, runCommand };
