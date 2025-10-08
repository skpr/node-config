import fs from 'fs';
import path from 'path';

const DEFAULT_CONFIG_PATH = '/etc/skpr/data/config.json';

let configPath = DEFAULT_CONFIG_PATH;
let configData = {};
let cachedMtimeMs = 0;

// throttle file stat calls to avoid excessive I/O
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

  // Node >=16 supports { throwIfNoEntry }
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
      // Keep previous good config on parse error
      console.error(`[skpr-config] Failed to parse ${configPath}: ${err.message}`);
    }
  }
}

/**
 * Get a configuration value by key (e.g. "mongo.default.hostname").
 * Refreshes from disk if the file changed since the last successful load.
 */
export function get(key) {
  tryReloadIfChanged(false);
  return configData[key];
}

/** Descriptive alias */
export const skprConfigGet = get;

/** Return a shallow copy of the entire config */
export function getAll() {
  tryReloadIfChanged(false);
  return { ...configData };
}

/** Force an immediate reload, skipping throttle */
export function reload() {
  tryReloadIfChanged(true);
}

/**
 * Configure the loader.
 * @param {{ path?: string, statThrottleMs?: number }} opts
 */
export function configure(opts = {}) {
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

/** Namespaced default export for ergonomic usage: skprConfig.get(...) */
const skprConfig = { get, skprConfigGet, getAll, reload, configure };
export default skprConfig;

// Warm up at import time; safe if file doesn’t exist yet
tryReloadIfChanged(true);
