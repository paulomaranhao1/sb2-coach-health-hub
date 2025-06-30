
import { useState, useEffect, useCallback, useRef } from 'react';
import { useUnifiedCache } from './useUnifiedCache';
import { useLogger } from '@/utils/logger';
import { performanceMonitor } from '@/utils/optimizedPerformance';

interface OptimizedQueryOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  enabled?: boolean;
  cacheTime?: number;
  staleTime?: number;
  retry?: number;
  retryDelay?: number;
  refetchOnWindowFocus?: boolean;
  optimisticUpdates?: boolean;
}

export function useOptimizedQuery<T>({
  queryKey,
  queryFn,
  enabled = true,
  cacheTime = 5 * 60 * 1000, // 5 minutes
  staleTime = 2 * 60 * 1000, // 2 minutes
  retry = 1,
  retryDelay = 1000,
  refetchOnWindowFocus = false,
  optimisticUpdates = false
}: OptimizedQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const cache = useUnifiedCache();
  const logger = useLogger(`useOptimizedQuery:${queryKey.join(':')}`);
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const cacheKey = queryKey.join(':');

  const fetchData = useCallback(async (force = false) => {
    if (!enabled) return;

    // Cancel any ongoing request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const queryId = `query-${cacheKey}-${Date.now()}`;
    performanceMonitor.markStart(queryId);

    try {
      // Check cache first
      if (!force) {
        const cached = cache.get<{ data: T; timestamp: number }>(cacheKey);
        if (cached) {
          const age = Date.now() - cached.timestamp;
          if (age < staleTime) {
            setData(cached.data);
            setLoading(false);
            setError(null);
            logger.debug('Serving fresh cached data', { age });
            return;
          }
          
          if (age < cacheTime) {
            // Serve stale data while fetching fresh
            setData(cached.data);
            setLoading(false);
            logger.debug('Serving stale data while fetching fresh', { age });
          }
        }
      }

      setLoading(true);
      setError(null);

      const result = await queryFn();
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setData(result);
      setError(null);
      retryCountRef.current = 0;

      // Cache the result
      cache.set(cacheKey, { data: result, timestamp: Date.now() }, {
        ttl: cacheTime,
        tags: ['query-cache'],
        priority: 'medium'
      });

      performanceMonitor.markEnd(queryId);
      logger.info('Query completed successfully');

    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const error = err instanceof Error ? err : new Error('Unknown error');
      logger.error('Query failed', { error, retryCount: retryCountRef.current });

      if (retryCountRef.current < retry) {
        retryCountRef.current++;
        const delay = retryDelay * Math.pow(2, retryCountRef.current - 1);
        
        setTimeout(() => {
          if (!abortControllerRef.current?.signal.aborted) {
            fetchData(force);
          }
        }, delay);
        
        return;
      }

      setError(error);
      performanceMonitor.markEnd(queryId);
    } finally {
      setLoading(false);
    }
  }, [enabled, queryFn, cacheKey, cache, staleTime, cacheTime, retry, retryDelay, logger]);

  const invalidate = useCallback(() => {
    cache.delete(cacheKey);
    fetchData(true);
  }, [cache, cacheKey, fetchData]);

  const mutate = useCallback((newData: T) => {
    if (optimisticUpdates) {
      setData(newData);
      cache.set(cacheKey, { data: newData, timestamp: Date.now() }, {
        ttl: cacheTime,
        tags: ['query-cache'],
        priority: 'medium'
      });
    }
  }, [optimisticUpdates, cache, cacheKey, cacheTime]);

  useEffect(() => {
    fetchData();

    // Cleanup on unmount
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);

  // Handle window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (!document.hidden) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData, refetchOnWindowFocus]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    invalidate,
    mutate
  };
}
