
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/utils/logger';

interface HomeData {
  weightEntries: any[];
  lastFastingSession?: any;
  recentFoodAnalysis?: any;
}

export const useHomeData = (userId?: string) => {
  const logger = useLogger('useHomeData');

  const { data, isLoading, error } = useQuery({
    queryKey: ['homeData', userId],
    queryFn: async (): Promise<HomeData> => {
      if (!userId) {
        return {
          weightEntries: [],
          lastFastingSession: undefined,
          recentFoodAnalysis: undefined
        };
      }

      try {
        // Fetch weight entries
        const { data: weightEntries, error: weightError } = await supabase
          .from('weight_entries')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(10);

        if (weightError) throw weightError;

        // Fetch last fasting session
        const { data: fastingSessions, error: fastingError } = await supabase
          .from('fasting_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('start_time', { ascending: false })
          .limit(1);

        if (fastingError) throw fastingError;

        // Fetch recent food analysis
        const { data: foodAnalyses, error: foodError } = await supabase
          .from('food_analyses')
          .select('*')
          .eq('user_id', userId)
          .order('analyzed_at', { ascending: false })
          .limit(1);

        if (foodError) throw foodError;

        const result = {
          weightEntries: weightEntries || [],
          lastFastingSession: fastingSessions?.[0],
          recentFoodAnalysis: foodAnalyses?.[0]
        };

        logger.info('Home data fetched successfully', {
          weightEntries: weightEntries?.length || 0,
          hasFastingSession: !!fastingSessions?.[0],
          hasFoodAnalysis: !!foodAnalyses?.[0]
        });

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        logger.error('Error fetching home data', { error });
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });

  return {
    weightEntries: data?.weightEntries || [],
    lastFastingSession: data?.lastFastingSession,
    recentFoodAnalysis: data?.recentFoodAnalysis,
    isLoading,
    error
  };
};
