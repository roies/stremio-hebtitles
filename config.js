'use strict';

const fs = require('fs');
const path = require('path');

function parseEnv(content) {
  const values = {};
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  });
  return values;
}

function loadEnvFile(filePath = path.join(__dirname, '.env'), env = process.env) {
  if (!fs.existsSync(filePath)) return env;
  const parsed = parseEnv(fs.readFileSync(filePath, 'utf8'));
  Object.entries(parsed).forEach(([key, value]) => {
    if (env[key] === undefined || env[key] === '') {
      env[key] = value;
    }
  });
  return env;
}

module.exports = { parseEnv, loadEnvFile };
