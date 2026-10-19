/**
 * Astra 7 — Response Cache Service
 * Low-latency in-memory LRU cache with TTL for safe, reusable answers (general knowledge, math proofs, code snippets).
 */

interface CacheEntry {
  key: string;
  response: string;
  category: string;
  sources?: any[];
  model: string;
  createdAt: number;
  hits: number;
}

export class AstraCacheService {
  private static cache: Map<string, CacheEntry> = new Map();
  private static MAX_ENTRIES = 500;
  private static DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

  private static normalizeKey(query: string, language: string): string {
    return `${language}:${query.trim().toLowerCase().replace(/\s+/g, ' ')}`;
  }

  /**
   * Determine whether a category can safely be cached
   */
  public static isCacheableCategory(category: string): boolean {
    const uncacheable = [
      'CURRENT_NEWS',
      'WEB_SEARCH',
      'WEATHER',
      'SPORTS',
      'DOCUMENT_ANALYSIS'
    ];
    return !uncacheable.includes(category);
  }

  /**
   * Get cached response if valid
   */
  public static get(
    query: string,
    language = 'en',
    category?: string
  ): CacheEntry | null {
    if (category && !this.isCacheableCategory(category)) {
      return null;
    }

    const key = this.normalizeKey(query, language);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check expiration
    if (Date.now() - entry.createdAt > this.DEFAULT_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    return entry;
  }

  /**
   * Store response in cache
   */
  public static set(
    query: string,
    response: string,
    category: string,
    model: string,
    sources?: any[],
    language = 'en'
  ): void {
    if (!this.isCacheableCategory(category)) {
      return;
    }

    // Do not cache very short or error responses
    if (!response || response.length < 20 || response.includes('error')) {
      return;
    }

    // LRU eviction if needed
    if (this.cache.size >= this.MAX_ENTRIES) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    const key = this.normalizeKey(query, language);
    this.cache.set(key, {
      key,
      response,
      category,
      model,
      sources,
      createdAt: Date.now(),
      hits: 0
    });
  }

  /**
   * Clear cache
   */
  public static clear(): void {
    this.cache.clear();
  }

  /**
   * Cache metrics
   */
  public static stats(): { size: number; maxEntries: number } {
    return {
      size: this.cache.size,
      maxEntries: this.MAX_ENTRIES
    };
  }
}
