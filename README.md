# @skpr/config

Lightweight config loader for SKPR that reads `/etc/skpr/data/config.json`,
caches the data, and **reloads only when the file modification time changes**.
Stat checks are throttled (default 1s) to reduce I/O.

- Zero dependencies
- ESM + CJS
- Safe on malformed JSON (keeps last good config)
- Customizable path and throttle
- TypeScript types included

## Install

```bash
npm i @skpr/config
```

```bash
pnpm add @skpr/config
```

```bash
yarn add @skpr/config
```

## Usage

### ESM

```js
import skprConfig, { get, skprConfigGet, configure } from '@skpr/config';

configure({
  // path: '/etc/skpr/data/config.json', // default
  statThrottleMs: 500, // optional
});

// Load a config with a fallback
const apiSecret = skprConfig.get('api.secret') || 'fallback';
```

### CommonJS

```js
const skprConfig = require('@skpr/config');

skprConfig.configure({ statThrottleMs: 500 });

const apiSecret = skprConfig.get('api.secret') || 'fallback';
```
