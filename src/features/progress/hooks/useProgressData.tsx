
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { handleAsyncError, getErrorMessage } from '@/utils/errorHandling';
import { useCache } from '@/utils/cacheManager';
import { logger } from '@/utils/logger';

export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  created_at: string;
  notes?: string;
}

export interface UserStats {
  level: number;
  points: number;
  shields: any[];
  stickers: any[];
  streak: number;
}

interface ProgressData {
  weightEntries: WeightEntry[];
  userStats: UserStats | null;
}

export const useProgressData = () => {
  const [data, setData] = useState<ProgressData>({
    weightEntries: [],
    userStats: null
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const cache = useCache();

  // Logger específico para este hook
  const componentLogger = {
    debug: (message: string, context?: any) => logger.debug(message, context, 'useProgressData'),
    info: (message: string, context?: any) => logger.info(message, context, 'useProgressData'),
    warn: (message: string, context?: any) => logger.warn(message, context, 'useProgressData'),
    error: (message: string, context?: any) => logger.error(message, context, 'useProgressData')
  };

  const loadData = useCallback(async (useCache = true) => {
    const timer = logger.startTimer('loadProgressData');
    
    const result = await handleAsyncError(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const cacheKey = `progress-${user.id}`;
      
      // Verificar cache primeiro
      if (useCache) {
        const cachedData = cache.get<ProgressData>(cacheKey);
        if (cachedData) {
          componentLogger.info('Using cached progress data');
          setData(cachedData);
          timer();
          return;
        }
      }

      componentLogger.info('Loading progress data from server');

      // Buscar dados em paralelo para melhor performance
      const [weightResponse, statsResponse] = await Promise.all([
        supabase
          .from('weight_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      if (weightResponse.error) throw weightResponse.error;
      if (statsResponse.error && statsResponse.error.code !== 'PGRST116') throw statsResponse.error;

      const newData = {
        weightEntries: weightResponse.data || [],
        userStats: statsResponse.data || { level: 1, points: 0, shields: [], stickers: [], streak: 0 }
      };

      setData(newData);
      
      // Salvar no cache por 3 minutos (dados dinâmicos)
      cache.set(cacheKey, newData, { 
        ttl: 3 * 60 * 1000, 
        tags: ['progress', 'user-data'],
        priority: 'high'
      });

      componentLogger.info('Progress data loaded and cached successfully', {
        weightEntries: newData.weightEntries.length,
        hasStats: !!newData.userStats
      });

    }, (error) => {
      componentLogger.error('Failed to load progress data', { error });
      toast({
        title: "Erro ao carregar dados",
        description: getErrorMessage(error),
        variant: "destructive"
      });
    });

    setLoading(false);
    timer();
  }, [toast, cache, componentLogger]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Cálculos memoizados para evitar recálculos desnecessários
  const calculations = useMemo(() => {
    const timer = logger.startTimer('progressCalculations');
    
    const weightHistory = data.weightEntries;
    const currentWeightValue = weightHistory.length > 0 ? weightHistory[0].weight : 0;
    const initialWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
    const weightLoss = initialWeight - currentWeightValue;
    
    let avgWeightLossPerWeek = "0.0";
    let bestWeekLoss = "0.0";
    let consistencyScore = 0;

    if (weightHistory.length >= 2) {
      const firstEntry = new Date(weightHistory[weightHistory.length - 1].date);
      const lastEntry = new Date(weightHistory[0].date);
      const daysDiff = Math.abs(lastEntry.getTime() - firstEntry.getTime()) / (1000 * 60 * 60 * 24);
      const weeksDiff = daysDiff / 7;
      
      if (weeksDiff > 0) {
        const avgLoss = weightLoss / weeksDiff;
        avgWeightLossPerWeek = avgLoss.toFixed(1);
      }

      // Calcular melhor perda semanal
      let maxLoss = 0;
      for (let i = 0; i < weightHistory.length - 1; i++) {
        const currentLoss = weightHistory[i + 1].weight - weightHistory[i].weight;
        if (currentLoss > maxLoss) {
          maxLoss = currentLoss;
        }
      }
      bestWeekLoss = maxLoss.toFixed(1);
    }

    // Calcular consistência
    if (weightHistory.length > 0) {
      const last30Days = 30;
      const recordedDays = Math.min(weightHistory.length, last30Days);
      consistencyScore = Math.round((recordedDays / last30Days) * 100);
    }

    timer();

    return {
      currentWeightValue,
      initialWeight,
      weightLoss,
      avgWeightLossPerWeek,
      bestWeekLoss,
      consistencyScore
    };
  }, [data.weightEntries]);

  const shareProgress = useCallback(async () => {
    const timer = logger.startTimer('shareProgress');
    
    try {
      const shareData = {
        title: 'Meu Progresso - SB2coach.ai',
        text: `Confira meu progresso no SB2coach.ai! ${calculations.weightLoss > 0 ? `Já perdi ${calculations.weightLoss.toFixed(1)}kg` : `Peso atual: ${calculations.currentWeightValue}kg`}!`,
        url: window.location.origin
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        componentLogger.info('Progress shared via native share');
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência."
        });
        componentLogger.info('Progress shared via clipboard');
      }
    } catch (error) {
      componentLogger.error('Error sharing progress', { error });
    } finally {
      timer();
    }
  }, [calculations.weightLoss, calculations.currentWeightValue, toast, componentLogger]);

  // Função para forçar refresh (limpar cache)
  const forceRefresh = useCallback(async () => {
    componentLogger.info('Forcing data refresh');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        cache.delete(`progress-${user.id}`);
      }
    } catch (error) {
      componentLogger.error('Error getting user for cache cleanup', { error });
    }
    loadData(false);
  }, [loadData, cache, componentLogger]);

  return {
    data,
    loading,
    refetch: loadData,
    forceRefresh,
    weightHistory: data.weightEntries,
    userStats: data.userStats,
    shareProgress,
    ...calculations
  };
};
