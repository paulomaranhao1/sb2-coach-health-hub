
import { useState, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface UseDataCacheOptions {
  defaultTTL?: number; // Time to live em ms
}

export const useDataCache = ({ defaultTTL = 5 * 60 * 1000 }: UseDataCacheOptions = {}) => {
  const cache = useRef<Map<string, CacheEntry<any>>>(new Map());
  const [, forceUpdate] = useState(0);

  const get = useCallback(<T,>(key: string): T | null => {
    const entry = cache.current.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      cache.current.delete(key);
      return null;
    }
    
    return entry.data;
  }, []);

  const set = useCallback(<T,>(key: string, data: T, ttl = defaultTTL) => {
    cache.current.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    forceUpdate(prev => prev + 1);
  }, [defaultTTL]);

  const clear = useCallback((key?: string) => {
    if (key) {
      cache.current.delete(key);
    } else {
      cache.current.clear();
    }
    forceUpdate(prev => prev + 1);
  }, []);

  const has = useCallback((key: string): boolean => {
    const entry = cache.current.get(key);
    if (!entry) return false;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      cache.current.delete(key);
      return false;
    }
    
    return true;
  }, []);

  return { get, set, clear, has };
};
