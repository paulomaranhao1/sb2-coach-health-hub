
import { useCallback } from 'react';
import { useCache as useCacheManager } from '@/utils/cacheManager';
import { useLogger } from '@/utils/logger';

interface CacheOptions {
  ttl?: number;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
}

interface UnifiedCacheHook {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, data: T, options?: CacheOptions) => void;
  delete: (key: string) => boolean;
  clear: () => void;
  has: (key: string) => boolean;
  invalidateByTag: (tag: string) => number;
  invalidateByPattern: (pattern: RegExp) => number;
  prefetch: <T>(key: string, loader: () => Promise<T>, options?: CacheOptions) => Promise<T>;
  getStats: () => any;
}

export const useUnifiedCache = (): UnifiedCacheHook => {
  const cache = useCacheManager();
  const logger = useLogger('UnifiedCache');

  const get = useCallback(<T = any>(key: string): T | null => {
    const result = cache.get<T>(key);
    if (result !== null) {
      logger.debug('Cache hit', { key });
    } else {
      logger.debug('Cache miss', { key });
    }
    return result;
  }, [cache, logger]);

  const set = useCallback(<T = any>(key: string, data: T, options: CacheOptions = {}) => {
    logger.debug('Cache set', { key, options });
    cache.set(key, data, options);
  }, [cache, logger]);

  const deleteKey = useCallback((key: string): boolean => {
    logger.debug('Cache delete', { key });
    return cache.delete(key);
  }, [cache, logger]);

  const clear = useCallback(() => {
    logger.info('Cache cleared');
    cache.clear();
  }, [cache, logger]);

  const has = useCallback((key: string): boolean => {
    return cache.has(key);
  }, [cache]);

  const invalidateByTag = useCallback((tag: string): number => {
    const count = cache.invalidateByTag(tag);
    logger.info('Cache invalidated by tag', { tag, count });
    return count;
  }, [cache, logger]);

  const invalidateByPattern = useCallback((pattern: RegExp): number => {
    const count = cache.invalidateByPattern(pattern);
    logger.info('Cache invalidated by pattern', { pattern: pattern.toString(), count });
    return count;
  }, [cache, logger]);

  const prefetch = useCallback(<T = any>(
    key: string, 
    loader: () => Promise<T>, 
    options: CacheOptions = {}
  ): Promise<T> => {
    logger.debug('Cache prefetch initiated', { key });
    return cache.prefetch(key, loader, options);
  }, [cache, logger]);

  const getStats = useCallback(() => {
    return cache.getStats();
  }, [cache]);

  return {
    get,
    set,
    delete: deleteKey,
    clear,
    has,
    invalidateByTag,
    invalidateByPattern,
    prefetch,
    getStats
  };
};

// Specialized hooks for common use cases
export const useApiCache = () => {
  const cache = useUnifiedCache();
  const logger = useLogger('ApiCache');

  return {
    get: <T = any>(endpoint: string): T | null => cache.get(`api:${endpoint}`),
    set: <T = any>(endpoint: string, data: T, ttl = 5 * 60 * 1000) => {
      logger.debug('API cache set', { endpoint, ttl });
      cache.set(`api:${endpoint}`, data, { ttl, tags: ['api', 'persist'] });
    },
    invalidate: (endpoint: string) => cache.delete(`api:${endpoint}`),
    invalidateAll: () => cache.invalidateByTag('api')
  };
};

export const useUserCache = () => {
  const cache = useUnifiedCache();
  const logger = useLogger('UserCache');

  return {
    get: <T = any>(key: string): T | null => cache.get(`user:${key}`),
    set: <T = any>(key: string, data: T, ttl = 10 * 60 * 1000) => {
      logger.debug('User cache set', { key, ttl });
      cache.set(`user:${key}`, data, { ttl, tags: ['user', 'persist'], priority: 'high' });
    },
    invalidate: (key: string) => cache.delete(`user:${key}`),
    invalidateAll: () => cache.invalidateByTag('user')
  };
};
