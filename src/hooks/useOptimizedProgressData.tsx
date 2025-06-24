
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserStats } from '@/types';
import { handleAsyncError, getErrorMessage } from '@/utils/errorHandling';

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

interface ProgressData {
  weightEntries: WeightEntry[];
  userStats: UserStats | null;
}

// Cache para evitar re-fetches desnecessários
const dataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useOptimizedProgressData = () => {
  const [data, setData] = useState<ProgressData>({
    weightEntries: [],
    userStats: null
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Função para verificar cache
  const getCachedData = useCallback((key: string) => {
    const cached = dataCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }, []);

  // Função para definir cache
  const setCachedData = useCallback((key: string, data: any) => {
    dataCache.set(key, { data, timestamp: Date.now() });
  }, []);

  const loadData = useCallback(async (useCache = true) => {
    const result = await handleAsyncError(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const cacheKey = `progress-${user.id}`;
      
      // Verificar cache primeiro
      if (useCache) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          console.log('📦 Usando dados do cache');
          setData(cachedData);
          return;
        }
      }

      console.log('🔄 Carregando dados do servidor...');

      // Buscar dados em paralelo para melhor performance
      const [weightResponse, statsResponse] = await Promise.all([
        supabase
          .from('weight_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      if (weightResponse.error) throw weightResponse.error;
      if (statsResponse.error) throw statsResponse.error;

      const newData = {
        weightEntries: weightResponse.data || [],
        userStats: statsResponse.data
      };

      setData(newData);
      setCachedData(cacheKey, newData);
    }, (error) => {
      console.error('Erro ao carregar dados de progresso:', error);
      toast({
        title: "Erro",
        description: getErrorMessage(error),
        variant: "destructive"
      });
    });

    setLoading(false);
  }, [toast, getCachedData, setCachedData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Cálculos memoizados para evitar recálculos desnecessários
  const calculations = useMemo(() => {
    const weightHistory = data.weightEntries;
    const currentWeightValue = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
    const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;
    const weightLoss = initialWeight - currentWeightValue;
    
    let avgWeightLossPerWeek = "0.0";
    let bestWeekLoss = "0.0";
    let consistencyScore = 0;

    if (weightHistory.length >= 2) {
      const firstEntry = new Date(weightHistory[0].date);
      const lastEntry = new Date(weightHistory[weightHistory.length - 1].date);
      const daysDiff = Math.abs(lastEntry.getTime() - firstEntry.getTime()) / (1000 * 60 * 60 * 24);
      const weeksDiff = daysDiff / 7;
      
      if (weeksDiff > 0) {
        const avgLoss = weightLoss / weeksDiff;
        avgWeightLossPerWeek = avgLoss.toFixed(1);
      }

      // Calcular melhor perda semanal
      let maxLoss = 0;
      for (let i = 1; i < weightHistory.length; i++) {
        const currentLoss = weightHistory[i - 1].weight - weightHistory[i].weight;
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
    try {
      const shareData = {
        title: 'SB2coach.ai - Meu Progresso',
        text: `Estou usando o SB2coach.ai! ${calculations.weightLoss > 0 ? `Já perdi ${calculations.weightLoss.toFixed(1)}kg` : `Peso atual: ${calculations.currentWeightValue}kg`} 💪`,
        url: window.location.origin
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({
          title: "Link copiado!",
          description: "Cole onde quiser compartilhar seu progresso"
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [calculations.weightLoss, calculations.currentWeightValue, toast]);

  // Função para forçar refresh (limpar cache)
  const forceRefresh = useCallback(() => {
    console.log('🔄 Forçando atualização dos dados...');
    loadData(false);
  }, [loadData]);

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
