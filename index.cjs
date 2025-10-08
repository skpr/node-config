const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG_PATH = '/etc/skpr/data/config.json';

let configPath = DEFAULT_CONFIG_PATH;
let configData = {};
let cachedMtimeMs = 0;

let statThrottleMs = 1000;
let lastStatCheck = 0;

function readJSONSafely(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function tryReloadIfChanged(force = false) {
  const now = Date.now();
  if (!force && now - lastStatCheck < statThrottleMs) return;

  lastStatCheck = now;

  const stat = fs.statSync(configPath, { throwIfNoEntry: false });
  if (!stat) {
    if (cachedMtimeMs !== -1) {
      console.warn(`[skpr-config] File not found: ${configPath}`);
      cachedMtimeMs = -1;
      configData = {};
    }
    return;
  }

  const { mtimeMs } = stat;
  if (force || mtimeMs !== cachedMtimeMs) {
    try {
      const next = readJSONSafely(configPath);
      configData = next;
      cachedMtimeMs = mtimeMs;
    } catch (err) {
      console.error(`[skpr-config] Failed to parse ${configPath}: ${err.message}`);
    }
  }
}

function get(key) {
  tryReloadIfChanged(false);
  return configData[key];
}

const skprConfigGet = get;

function getAll() {
  tryReloadIfChanged(false);
  return { ...configData };
}

function reload() {
  tryReloadIfChanged(true);
}

function configure(opts = {}) {
  if (opts.path && opts.path !== configPath) {
    configPath = path.resolve(opts.path);
    cachedMtimeMs = 0;
    lastStatCheck = 0;
  }
  if (typeof opts.statThrottleMs === 'number' && opts.statThrottleMs >= 0) {
    statThrottleMs = opts.statThrottleMs;
  }
  tryReloadIfChanged(true);
}

const skprConfig = { get, skprConfigGet, getAll, reload, configure };
module.exports = Object.assign(skprConfig, { default: skprConfig });

// warm up
tryReloadIfChanged(true);
