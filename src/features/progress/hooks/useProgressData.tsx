
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserStats } from '@/types';

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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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

      setData({
        weightEntries: weightResponse.data || [],
        userStats: statsResponse.data
      });
    } catch (error: any) {
      console.error('Erro ao carregar dados de progresso:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de progresso",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const calculations = useMemo(() => {
    const weightHistory = data.weightEntries;
    const currentWeightValue = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
    const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;
    const weightLoss = initialWeight - currentWeightValue;
    
    return {
      currentWeightValue,
      initialWeight,
      weightLoss
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

  return {
    data,
    loading,
    refetch: loadData,
    weightHistory: data.weightEntries,
    userStats: data.userStats,
    shareProgress,
    ...calculations
  };
};
