
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import type { UserStats } from './useUserStats';

export const usePointsSystem = (
  userStats: UserStats,
  setUserStats: (stats: UserStats) => void
) => {
  const [dailyPointsClaimed, setDailyPointsClaimed] = useState(false);

  const addPoints = useCallback(async (points: number, message?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        logger.warn('No user found for points addition');
        return;
      }

      logger.info('Adding points to user', { userId: user.id, points });

      const newPoints = userStats.points + points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      const today = new Date().toISOString().split('T')[0];

      const updatedStats = {
        ...userStats,
        points: newPoints,
        level: Math.max(newLevel, userStats.level),
        last_activity_date: today
      };

      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          ...updatedStats
        });

      if (error) throw error;

      setUserStats(updatedStats);
      
      if (message) {
        toast.success(message);
      }

      logger.info('Points added successfully', { newPoints, newLevel });
    } catch (error) {
      logger.error('Error adding points', { error });
      toast.error('Erro ao adicionar pontos');
    }
  }, [userStats, setUserStats]);

  return {
    dailyPointsClaimed,
    setDailyPointsClaimed,
    addPoints
  };
};
