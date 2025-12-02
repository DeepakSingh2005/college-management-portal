/**
 * Simple in-memory cache manager with TTL support
 * Improves performance for frequently accessed data
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Set a value in cache with optional TTL (Time To Live)
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (0 = no expiry)
   */
  set(key, value, ttl = 0) {
    if (this.cache.has(key)) {
      clearTimeout(this.cache.get(key).timeout);
    }

    const cacheEntry = { value, timeout: null };

    if (ttl > 0) {
      cacheEntry.timeout = setTimeout(() => {
        this.cache.delete(key);
      }, ttl);
    }

    this.cache.set(key, cacheEntry);
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined
   */
  get(key) {
    const entry = this.cache.get(key);
    return entry ? entry.value : undefined;
  }

  /**
   * Check if key exists in cache
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Delete a key from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    const entry = this.cache.get(key);
    if (entry && entry.timeout) {
      clearTimeout(entry.timeout);
    }
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.forEach((entry) => {
      if (entry.timeout) {
        clearTimeout(entry.timeout);
      }
    });
    this.cache.clear();
  }

  /**
   * Get all keys in cache
   * @returns {string[]}
   */
  keys() {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   * @returns {number}
   */
  size() {
    return this.cache.size;
  }
}

// Export singleton instance
module.exports = new CacheManager();
