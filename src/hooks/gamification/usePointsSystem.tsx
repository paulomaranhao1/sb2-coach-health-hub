
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserStats } from './useUserStats';

export const usePointsSystem = (userStats: UserStats, setUserStats: (stats: UserStats | ((prev: UserStats) => UserStats)) => void) => {
  const [dailyPointsClaimed, setDailyPointsClaimed] = useState(false);
  const { toast } = useToast();

  const addPoints = async (points: number, reason: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (dailyPointsClaimed) {
        toast({
          title: "Você já coletou seus pontos hoje! 🎯",
          description: "Volte amanhã para coletar mais pontos e continuar sua jornada!",
          variant: "default"
        });
        return;
      }

      const newPoints = userStats.points + points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          points: newPoints,
          level: newLevel,
          shields: userStats.shields,
          stickers: userStats.stickers,
          streak: userStats.streak,
          last_activity_date: today
        });

      if (error) {
        console.error('Error adding points:', error);
        toast({
          title: "Você já coletou seus pontos hoje! 🎯",
          description: "Volte amanhã para coletar mais pontos e continuar sua jornada!",
          variant: "default"
        });
        return;
      }

      setUserStats(prev => ({ ...prev, points: newPoints, level: newLevel, last_activity_date: today }));
      setDailyPointsClaimed(true);
      
      toast({
        title: `+${points} pontos! 🎉`,
        description: reason
      });
    } catch (error) {
      console.error('Error adding points:', error);
      toast({
        title: "Erro ao adicionar pontos",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  };

  return {
    dailyPointsClaimed,
    setDailyPointsClaimed,
    addPoints
  };
};
