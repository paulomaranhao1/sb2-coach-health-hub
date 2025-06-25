
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/utils/logger';

interface OptimizedDataHook<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export const useOptimizedData = <T,>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options: {
    cacheTTL?: number; // Cache time-to-live in milliseconds
    staleTime?: number; // Time before data is considered stale
    retry?: number;
    enabled?: boolean;
  } = {}
): OptimizedDataHook<T> => {
  const {
    cacheTTL = 5 * 60 * 1000, // 5 minutes default
    staleTime = 2 * 60 * 1000, // 2 minutes default
    retry = 1,
    enabled = true
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const logger = useLogger(`useOptimizedData:${queryKey}`);

  // Cache management
  const cacheKey = `optimized_cache_${queryKey}`;
  
  const getCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        const now = Date.now();
        
        if (now - parsedCache.timestamp < cacheTTL) {
          logger.debug('Using cached data', { 
            age: now - parsedCache.timestamp,
            cacheTTL 
          });
          return {
            data: parsedCache.data,
            timestamp: new Date(parsedCache.timestamp)
          };
        }
      }
    } catch (error) {
      logger.error('Error reading cache', { error });
    }
    return null;
  }, [cacheKey, cacheTTL, logger]);

  const setCachedData = useCallback((newData: T) => {
    try {
      const cacheEntry = {
        data: newData,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
      logger.debug('Data cached successfully');
    } catch (error) {
      logger.error('Error caching data', { error });
    }
  }, [cacheKey, logger]);

  const fetchData = useCallback(async (force = false) => {
    if (!enabled) return;

    const startTime = Date.now();
    
    try {
      // Check cache first unless forcing refresh
      if (!force) {
        const cached = getCachedData();
        if (cached) {
          setData(cached.data);
          setLastUpdated(cached.timestamp);
          setLoading(false);
          setError(null);
          
          // Check if data is stale but still serve cached version
          const isStale = Date.now() - cached.timestamp.getTime() > staleTime;
          if (!isStale) {
            logger.debug('Serving fresh cached data');
            return;
          }
          
          logger.debug('Data is stale, fetching fresh data in background');
        }
      }

      setLoading(true);
      setError(null);
      
      logger.info('Fetching data', { force, retryCount });
      
      const result = await queryFn();
      
      setData(result);
      setLastUpdated(new Date());
      setCachedData(result);
      setRetryCount(0);
      
      const elapsedTime = Date.now() - startTime;
      logger.info('Data fetched successfully', { 
        elapsedTime,
        dataSize: JSON.stringify(result).length 
      });
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      logger.error('Error fetching data', { error, retryCount });
      
      if (retryCount < retry) {
        logger.info('Retrying fetch', { retryCount: retryCount + 1, maxRetries: retry });
        setRetryCount(prev => prev + 1);
        
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        setTimeout(() => fetchData(force), delay);
        return;
      }
      
      setError(error);
      
      // Try to serve stale cache data on error
      const cached = getCachedData();
      if (cached && !data) {
        logger.info('Serving stale cached data due to error');
        setData(cached.data);
        setLastUpdated(cached.timestamp);
      }
    } finally {
      setLoading(false);
    }
  }, [enabled, getCachedData, queryFn, setCachedData, staleTime, retry, retryCount, data, logger]);

  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize return value to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    data,
    loading,
    error,
    refetch,
    lastUpdated
  }), [data, loading, error, refetch, lastUpdated]);

  return returnValue;
};
