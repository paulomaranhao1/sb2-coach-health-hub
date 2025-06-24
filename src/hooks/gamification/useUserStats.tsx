
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserStats {
  points: number;
  level: number;
  shields: string[];
  stickers: string[];
  streak: number;
  last_activity_date?: string;
}

export const useUserStats = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    level: 1,
    shields: [],
    stickers: [],
    streak: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user stats:', error);
        return;
      }

      if (data) {
        setUserStats({
          points: data.points || 0,
          level: data.level || 1,
          shields: data.shields || [],
          stickers: data.stickers || [],
          streak: data.streak || 0,
          last_activity_date: data.last_activity_date
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserStats();
  }, []);

  return {
    userStats,
    loading,
    setUserStats,
    refetch: loadUserStats
  };
};
