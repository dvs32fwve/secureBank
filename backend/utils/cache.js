class MemoryCache {
  constructor(options = {}) {
    this.ttlMs = options.ttlMs || 30000;
    this.store = new Map();
  }

  set(key, value) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

const createCache = (options = {}) => new MemoryCache(options);

module.exports = { createCache, MemoryCache };
