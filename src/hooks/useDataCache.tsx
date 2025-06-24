
// Este arquivo foi substituído pelo sistema de cache unificado
// Use useUnifiedCache, useApiCache ou useUserCache em vez deste hook

import { useUnifiedCache } from './useUnifiedCache';

/**
 * @deprecated Use useUnifiedCache instead
 */
export const useDataCache = (options: { defaultTTL?: number } = {}) => {
  const cache = useUnifiedCache();
  
  console.warn('useDataCache is deprecated. Use useUnifiedCache, useApiCache, or useUserCache instead.');
  
  return {
    get: cache.get,
    set: (key: string, data: any, ttl = options.defaultTTL || 5 * 60 * 1000) => 
      cache.set(key, data, { ttl }),
    clear: cache.clear,
    has: cache.has
  };
};
