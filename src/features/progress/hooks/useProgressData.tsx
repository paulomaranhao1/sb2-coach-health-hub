
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  created_at: string;
}

export interface UserStats {
  level: number;
  points: number;
  shields: any[];
  stickers: any[];
  streak: number;
}

export interface ProgressData {
  weightHistory: WeightEntry[];
  userStats: UserStats;
}

export const useProgressData = () => {
  const [data, setData] = useState<ProgressData>({ weightHistory: [], userStats: { level: 1, points: 0, shields: [], stickers: [], streak: 0 } });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch weight history
      const { data: weightData, error: weightError } = await supabase
        .from('weight_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (weightError) throw weightError;

      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .single();

      if (statsError && statsError.code !== 'PGRST116') throw statsError;

      const weightHistory = weightData || [];
      const userStats = statsData || { level: 1, points: 0, shields: [], stickers: [], streak: 0 };

      setData({ weightHistory, userStats });
    } catch (error: any) {
      console.error('Error fetching progress data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados de progresso.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const shareProgress = async () => {
    try {
      const shareData = {
        title: 'Meu Progresso - SB2coach.ai',
        text: `Confira meu progresso no SB2coach.ai! Já perdi ${weightLoss.toFixed(1)}kg!`,
        url: window.location.origin
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text + ' ' + shareData.url);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Calculate derived values
  const weightHistory = data.weightHistory;
  const userStats = data.userStats;
  const currentWeightValue = weightHistory.length > 0 ? weightHistory[0].weight : 0;
  const initialWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
  const weightLoss = initialWeight - currentWeightValue;
  
  // Calculate average weight loss per week
  const avgWeightLossPerWeek = weightHistory.length > 1 ? 
    (weightLoss / Math.max(1, Math.ceil(weightHistory.length / 7))).toFixed(1) : '0.0';
  
  // Calculate best week loss
  let bestWeekLoss = 0;
  if (weightHistory.length > 1) {
    for (let i = 0; i < weightHistory.length - 1; i++) {
      const weekLoss = weightHistory[i + 1].weight - weightHistory[i].weight;
      if (weekLoss > bestWeekLoss) {
        bestWeekLoss = weekLoss;
      }
    }
  }

  // Calculate consistency score
  const consistencyScore = weightHistory.length > 0 ? 
    Math.min(100, Math.round((weightHistory.length / 30) * 100)) : 0;

  return {
    currentWeightValue,
    initialWeight,
    weightLoss,
    avgWeightLossPerWeek,
    bestWeekLoss,
    consistencyScore,
    data,
    loading,
    refetch: fetchData,
    weightHistory,
    userStats,
    shareProgress
  };
};
