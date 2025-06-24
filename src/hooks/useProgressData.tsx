
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

export const useProgressData = () => {
  const [data, setData] = useState<ProgressData>({
    weightEntries: [],
    userStats: null
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    const result = await handleAsyncError(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar dados de peso
      const { data: weightData, error: weightError } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (weightError) throw weightError;

      // Buscar estatísticas do usuário
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (statsError) throw statsError;

      setData({
        weightEntries: weightData || [],
        userStats: statsData
      });
    }, (error) => {
      console.error('Erro ao carregar dados de progresso:', error);
      toast({
        title: "Erro",
        description: getErrorMessage(error),
        variant: "destructive"
      });
    });

    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Cálculos derivados
  const weightHistory = useMemo(() => data.weightEntries, [data.weightEntries]);
  const userStats = useMemo(() => data.userStats, [data.userStats]);
  
  const currentWeightValue = useMemo(() => {
    return weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
  }, [weightHistory]);
  
  const initialWeight = useMemo(() => {
    return weightHistory.length > 0 ? weightHistory[0].weight : 0;
  }, [weightHistory]);
  
  const weightLoss = useMemo(() => {
    return initialWeight - currentWeightValue;
  }, [initialWeight, currentWeightValue]);
  
  const avgWeightLossPerWeek = useMemo(() => {
    if (weightHistory.length < 2) return "0.0";
    
    const firstEntry = new Date(weightHistory[0].date);
    const lastEntry = new Date(weightHistory[weightHistory.length - 1].date);
    const daysDiff = Math.abs(lastEntry.getTime() - firstEntry.getTime()) / (1000 * 60 * 60 * 24);
    const weeksDiff = daysDiff / 7;
    
    if (weeksDiff === 0) return "0.0";
    
    const avgLoss = weightLoss / weeksDiff;
    return avgLoss.toFixed(1);
  }, [weightHistory, weightLoss]);
  
  const bestWeekLoss = useMemo(() => {
    if (weightHistory.length < 2) return "0.0";
    
    let maxLoss = 0;
    for (let i = 1; i < weightHistory.length; i++) {
      const currentLoss = weightHistory[i - 1].weight - weightHistory[i].weight;
      if (currentLoss > maxLoss) {
        maxLoss = currentLoss;
      }
    }
    
    return maxLoss.toFixed(1);
  }, [weightHistory]);
  
  const consistencyScore = useMemo(() => {
    if (weightHistory.length === 0) return 0;
    
    const last30Days = 30;
    const recordedDays = Math.min(weightHistory.length, last30Days);
    
    return Math.round((recordedDays / last30Days) * 100);
  }, [weightHistory]);

  const shareProgress = useCallback(async () => {
    try {
      const shareData = {
        title: 'SB2coach.ai - Meu Progresso',
        text: `Estou usando o SB2coach.ai! ${weightLoss > 0 ? `Já perdi ${weightLoss.toFixed(1)}kg` : `Peso atual: ${currentWeightValue}kg`} 💪`,
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
  }, [weightLoss, currentWeightValue, toast]);

  return {
    data,
    loading,
    refetch: loadData,
    weightHistory,
    userStats,
    shareProgress,
    currentWeightValue,
    initialWeight,
    weightLoss,
    avgWeightLossPerWeek,
    bestWeekLoss,
    consistencyScore
  };
};
