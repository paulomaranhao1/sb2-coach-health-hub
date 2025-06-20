
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

export const useProgressData = () => {
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Carregar histórico de peso
      const { data: weightData, error: weightError } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (weightError) throw weightError;
      setWeightHistory(weightData || []);

      // Carregar estatísticas do usuário
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') throw statsError;
      setUserStats(statsData);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const shareProgress = async () => {
    const currentWeightValue = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
    const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;
    const weightLoss = initialWeight - currentWeightValue;

    try {
      const shareData = {
        title: 'SB2FIT - Meu Progresso',
        text: `Estou usando o SB2FIT! ${weightLoss > 0 ? `Já perdi ${weightLoss.toFixed(1)}kg` : `Peso atual: ${currentWeightValue}kg`} 💪`,
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
  };

  // Cálculos derivados
  const currentWeightValue = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 0;
  const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;
  const weightLoss = initialWeight - currentWeightValue;
  const avgWeightLossPerWeek = weightHistory.length > 7 ? (weightLoss / (weightHistory.length / 7)).toFixed(2) : '0';

  const calculateBestWeekLoss = () => {
    if (weightHistory.length < 7) return 0;
    let maxLoss = 0;
    for (let i = 6; i < weightHistory.length; i++) {
      const weekLoss = weightHistory[i - 6].weight - weightHistory[i].weight;
      if (weekLoss > maxLoss) maxLoss = weekLoss;
    }
    return maxLoss.toFixed(1);
  };

  const calculateConsistencyScore = () => {
    if (weightHistory.length === 0) return 0;
    const totalDays = Math.floor((new Date().getTime() - new Date(weightHistory[0].date).getTime()) / (1000 * 60 * 60 * 24));
    return Math.round((weightHistory.length / Math.max(totalDays, 1)) * 100);
  };

  const bestWeekLoss = calculateBestWeekLoss();
  const consistencyScore = calculateConsistencyScore();

  return {
    weightHistory,
    userStats,
    loading,
    shareProgress,
    currentWeightValue,
    initialWeight,
    weightLoss,
    avgWeightLossPerWeek,
    bestWeekLoss,
    consistencyScore
  };
};
