
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface UserStats {
  level: number;
  points: number;
  shields: any[];
  stickers: any[];
  streak: number;
  last_activity_date?: string;
}

export const useUserStats = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    points: 0,
    shields: [],
    stickers: [],
    streak: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchUserStats = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        logger.warn('No user found for stats fetch');
        setLoading(false);
        return;
      }

      logger.debug('Fetching user stats', { userId: user.id });

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const stats = data || {
        level: 1,
        points: 0,
        shields: [],
        stickers: [],
        streak: 0
      };

      setUserStats(stats);
      logger.info('User stats loaded successfully', { stats });
    } catch (error) {
      logger.error('Error fetching user stats', { error });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  const refetch = useCallback(() => {
    logger.info('Refetching user stats');
    setLoading(true);
    fetchUserStats();
  }, [fetchUserStats]);

  return {
    userStats,
    loading,
    setUserStats,
    refetch
  };
};
