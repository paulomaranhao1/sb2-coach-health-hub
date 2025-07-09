import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DashboardData {
  userProfile: any;
  userStats: any;
  weightHistory: any[];
  loading: boolean;
  error: string | null;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    userProfile: null,
    userStats: null,
    weightHistory: [],
    loading: true,
    error: null
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setData(prev => ({ ...prev, loading: false, error: 'User not authenticated' }));
          return;
        }

        const [profileResult, statsResult, weightResult] = await Promise.all([
          supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase
            .from('weight_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: true })
        ]);

        if (profileResult.error) throw profileResult.error;
        if (statsResult.error) throw statsResult.error;
        if (weightResult.error) throw weightResult.error;

        setData({
          userProfile: profileResult.data,
          userStats: statsResult.data || { points: 0, level: 1, shields: [], stickers: [], streak: 0 },
          weightHistory: weightResult.data || [],
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        setData(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Failed to load data' 
        }));
        
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do dashboard",
          variant: "destructive"
        });
      }
    };

    fetchDashboardData();
  }, [toast]);

  const shareProgress = async () => {
    try {
      if (navigator.share && data.weightHistory.length > 0) {
        await navigator.share({
          title: 'Meu Progresso - SB2coach.ai',
          text: `Confira meu progresso no SB2coach.ai! ${data.weightHistory.length} registros de peso.`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência"
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível compartilhar o progresso",
        variant: "destructive"
      });
    }
  };

  return {
    ...data,
    shareProgress
  };
};