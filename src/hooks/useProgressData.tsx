
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProgressData {
  weightEntries: Array<{
    weight: number;
    date: string;
  }>;
  userStats: {
    level: number;
    points: number;
    streak: number;
    shields: string[];
    stickers: string[];
  } | null;
}

export const useProgressData = () => {
  const [data, setData] = useState<ProgressData>({
    weightEntries: [],
    userStats: null
  });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar dados de peso
      const { data: weightData } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      // Buscar estatísticas do usuário
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setData({
        weightEntries: weightData || [],
        userStats: statsData
      });
    } catch (error) {
      console.error('Erro ao carregar dados de progresso:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, refetch: loadData };
};
