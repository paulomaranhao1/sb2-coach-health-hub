
import { useState, useEffect, useCallback, useRef } from 'react';
import { useCache } from '@/utils/cacheManager';
import { logger } from '@/utils/logger';

interface UseOptimizedQueryOptions<T> {
  cacheKey: string;
  queryFn: () => Promise<T>;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  tags?: string[];
}

interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
  isError: boolean;
  isFetching: boolean;
  lastUpdated: number | null;
}

export const useOptimizedQuery = <T,>({
  cacheKey,
  queryFn,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutos
  cacheTime = 10 * 60 * 1000, // 10 minutos
  retryCount = 3,
  retryDelay = 1000,
  onSuccess,
  onError,
  tags = []
}: UseOptimizedQueryOptions<T>) => {
  const cache = useCache();
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    isLoading: false,
    error: null,
    isSuccess: false,
    isError: false,
    isFetching: false,
    lastUpdated: null
  });

  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Função para atualizar estado
  const updateState = useCallback((updates: Partial<QueryState<T>>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Função para buscar dados
  const fetchData = useCallback(async (retries = 0): Promise<void> => {
    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController();

    try {
      updateState({ isFetching: true, error: null });

      const startTime = performance.now();
      logger.info(`Starting query: ${cacheKey}`, { retries });

      const data = await queryFn();
      
      const duration = performance.now() - startTime;
      logger.info(`Query completed: ${cacheKey}`, { duration: `${duration.toFixed(2)}ms` });

      // Salvar no cache
      cache.set(cacheKey, data, { 
        ttl: cacheTime, 
        tags: ['query', ...tags],
        priority: 'medium'
      });

      // Atualizar estado
      updateState({
        data,
        isLoading: false,
        isFetching: false,
        isSuccess: true,
        isError: false,
        error: null,
        lastUpdated: Date.now()
      });

      // Callback de sucesso
      if (onSuccess) {
        onSuccess(data);
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.info(`Query aborted: ${cacheKey}`);
        return;
      }

      logger.error(`Query error: ${cacheKey}`, { error, retries });

      // Tentar novamente se houver tentativas restantes
      if (retries < retryCount) {
        const delay = retryDelay * Math.pow(2, retries); // Exponential backoff
        
        retryTimeoutRef.current = setTimeout(() => {
          fetchData(retries + 1);
        }, delay);

        return;
      }

      // Atualizar estado com erro
      updateState({
        error: error as Error,
        isLoading: false,
        isFetching: false,
        isSuccess: false,
        isError: true
      });

      // Callback de erro
      if (onError) {
        onError(error as Error);
      }
    }
  }, [cacheKey, queryFn, cacheTime, tags, retryCount, retryDelay, onSuccess, onError, cache, updateState]);

  // Função para revalidar dados
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Função para invalidar cache e refetch
  const invalidateAndRefetch = useCallback(() => {
    cache.delete(cacheKey);
    fetchData();
  }, [cache, cacheKey, fetchData]);

  // Efeito principal
  useEffect(() => {
    if (!enabled) return;

    // Verificar cache primeiro
    const cachedData = cache.get<T>(cacheKey);
    
    if (cachedData) {
      logger.info(`Using cached data: ${cacheKey}`);
      updateState({
        data: cachedData,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        lastUpdated: Date.now()
      });

      // Se os dados estão obsoletos (stale), buscar em background
      const cacheAge = Date.now() - (cache.get(`${cacheKey}_timestamp`) || 0);
      if (cacheAge > staleTime) {
        logger.info(`Cache stale, refetching: ${cacheKey}`);
        fetchData();
      }
    } else {
      // Dados não estão em cache, buscar
      updateState({ isLoading: true });
      fetchData();
    }

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [enabled, cacheKey, staleTime, cache, fetchData, updateState]);

  return {
    ...state,
    refetch,
    invalidateAndRefetch
  };
};

// Hook especializado para queries de API
export const useApiQuery = <T,>(
  endpoint: string,
  queryFn: () => Promise<T>,
  options: Omit<UseOptimizedQueryOptions<T>, 'cacheKey' | 'tags'> & { 
    tags?: string[] 
  } = {}
) => {
  return useOptimizedQuery({
    ...options,
    cacheKey: `api:${endpoint}`,
    queryFn,
    tags: ['api', ...(options.tags || [])]
  });
};
