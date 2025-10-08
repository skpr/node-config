export type SkprConfigOptions = {
  /** Absolute or relative path to the JSON file (default: /etc/skpr/data/config.json) */
  path?: string;
  /** Milliseconds to throttle mtime checks (default: 1000). Set 0 to check every call. */
  statThrottleMs?: number;
};

export function configure(opts?: SkprConfigOptions): void;
export function reload(): void;
export function get<T = unknown>(key: string): T | undefined;
/** Descriptive alias for `get` */
export const skprConfigGet: typeof get;
export function getAll(): Record<string, unknown>;

declare const skprConfig: {
  configure: typeof configure;
  reload: typeof reload;
  get: typeof get;
  skprConfigGet: typeof skprConfigGet;
  getAll: typeof getAll;
};

export default skprConfig;
