const cacheStore = new Map<string, { value: any; expiresAt: number }>();
const DEFAULT_TTL_MS = 60_000; // 60 seconds

export const cache = {
  get<T>(key: string): T | null {
    const entry = cacheStore.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      cacheStore.delete(key);
      return null;
    }

    return entry.value as T;
  },

  set(key: string, value: any, ttlMs: number = DEFAULT_TTL_MS): void {
    const expiresAt = Date.now() + ttlMs;
    cacheStore.set(key, { value, expiresAt });
  },

  delete(key: string): void {
    cacheStore.delete(key);
  },

  clear(): void {
    cacheStore.clear();
  }
};
