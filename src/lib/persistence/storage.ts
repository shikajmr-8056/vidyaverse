/**
 * Resilient offline-first LocalStorage persistence wrapper.
 * Provides in-memory fallback for SSR, restricted storage contexts, or storage quota errors.
 */

class MemoryStorageFallback {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

const memoryFallback = new MemoryStorageFallback();

function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    const testKey = "__vv_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export const safeStorage = {
  getItem<T>(key: string, fallback: T): T {
    try {
      const storage = isLocalStorageAvailable() ? window.localStorage : memoryFallback;
      const raw = storage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      if (isLocalStorageAvailable()) {
        window.localStorage.setItem(key, serialized);
      } else {
        memoryFallback.setItem(key, serialized);
      }
      return true;
    } catch {
      return false;
    }
  },

  removeItem(key: string): void {
    try {
      if (isLocalStorageAvailable()) {
        window.localStorage.removeItem(key);
      } else {
        memoryFallback.removeItem(key);
      }
    } catch {
      // Ignore
    }
  },
};
