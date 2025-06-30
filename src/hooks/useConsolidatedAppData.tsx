
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedCache } from '@/hooks/useUnifiedCache';
import { useLogger } from '@/utils/logger';

export interface ConsolidatedAppData {
  user: any;
  profile: any;
  stats: any;
  subscription: any;
  weightEntries: any[];
  fastingData: any[];
  isAuthenticated: boolean;
  showVideoWelcome: boolean;
  showWelcome: boolean;
  showOnboarding: boolean;
  showTutorial: boolean;
  showNewFeatures: boolean;
}

export const useConsolidatedAppData = () => {
  const [data, setData] = useState<ConsolidatedAppData>({
    user: null,
    profile: null,
    stats: null,
    subscription: null,
    weightEntries: [],
    fastingData: [],
    isAuthenticated: false,
    showVideoWelcome: false,
    showWelcome: false,
    showOnboarding: false,
    showTutorial: false,
    showNewFeatures: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const cache = useUnifiedCache();
  const logger = useLogger('useConsolidatedAppData');

  const loadAllData = useCallback(async (useCache = true) => {
    const startTime = Date.now();
    
    try {
      // Check authentication first
      const { data: { user } } = await supabase.auth.getUser();
      
      const baseData = {
        user,
        isAuthenticated: !!user,
        showVideoWelcome: false,
        showWelcome: false,
        showOnboarding: false,
        showTutorial: false,
        showNewFeatures: false
      };

      if (!user) {
        // Check if video welcome should be shown
        const videoShown = localStorage.getItem('sb2_video_welcome_shown');
        if (!videoShown) {
          setData({ ...baseData, showVideoWelcome: true } as ConsolidatedAppData);
          setLoading(false);
          return;
        }

        setData(baseData as ConsolidatedAppData);
        setLoading(false);
        return;
      }

      const cacheKey = `consolidated-app-data-${user.id}`;
      
      // Check cache first
      if (useCache) {
        const cachedData = cache.get<ConsolidatedAppData>(cacheKey);
        if (cachedData) {
          logger.info('Using cached consolidated data');
          setData({ ...cachedData, user, isAuthenticated: true });
          setLoading(false);
          return;
        }
      }

      logger.info('Loading consolidated data from server');

      // Single optimized query to get all user data
      const [profileResponse, statsResponse, subscriptionResponse, weightResponse] = await Promise.all([
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
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('weight_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10) // Limit for performance
      ]);

      if (profileResponse.error && profileResponse.error.code !== 'PGRST116') throw profileResponse.error;
      if (statsResponse.error && statsResponse.error.code !== 'PGRST116') throw statsResponse.error;
      if (subscriptionResponse.error && subscriptionResponse.error.code !== 'PGRST116') throw subscriptionResponse.error;
      if (weightResponse.error) throw weightResponse.error;

      const profile = profileResponse.data;
      const stats = statsResponse.data;
      const subscription = subscriptionResponse.data;
      const weightEntries = weightResponse.data || [];

      // Determine app flow state
      let appFlowState = {
        showVideoWelcome: false,
        showWelcome: false,
        showOnboarding: false,
        showTutorial: false,
        showNewFeatures: false
      };

      if (!profile) {
        appFlowState.showWelcome = true;
      } else if (!profile.onboarding_completed) {
        appFlowState.showOnboarding = true;
      } else {
        // Check tutorial and new features logic
        const tutorialCompleted = localStorage.getItem('sb2_tutorial_completed');
        const newFeaturesShown = localStorage.getItem('sb2_new_features_shown_v2');
        
        if (!tutorialCompleted) {
          appFlowState.showTutorial = true;
        } else if (!newFeaturesShown) {
          appFlowState.showNewFeatures = true;
        }
      }

      const consolidatedData: ConsolidatedAppData = {
        user,
        profile,
        stats,
        subscription,
        weightEntries,
        fastingData: [], // Load separately if needed
        isAuthenticated: true,
        ...appFlowState
      };

      setData(consolidatedData);
      setError(null);
      
      // Cache for 2 minutes
      cache.set(cacheKey, consolidatedData, { 
        ttl: 2 * 60 * 1000, 
        tags: ['consolidated-data'],
        priority: 'high'
      });

      const elapsedTime = Date.now() - startTime;
      logger.info('Consolidated data loaded successfully', { elapsedTime });

    } catch (error: any) {
      logger.error('Failed to load consolidated data', { error });
      setError(error.message || 'Erro ao carregar dados');
      toast({
        title: "Erro ao carregar dados",
        description: error.message || 'Erro inesperado',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast, cache, logger]);

  const invalidateCache = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      cache.delete(`consolidated-app-data-${user.id}`);
    }
    loadAllData(false);
  }, [cache, loadAllData]);

  const updateProfileData = useCallback((newProfile: any) => {
    setData(prev => ({ ...prev, profile: { ...prev.profile, ...newProfile } }));
  }, []);

  const updateStatsData = useCallback((newStats: any) => {
    setData(prev => ({ ...prev, stats: prev.stats ? { ...prev.stats, ...newStats } : newStats }));
  }, []);

  const updateAppFlow = useCallback((flowUpdates: Partial<ConsolidatedAppData>) => {
    setData(prev => ({ ...prev, ...flowUpdates }));
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return {
    data,
    loading,
    error,
    refetch: loadAllData,
    invalidateCache,
    updateProfileData,
    updateStatsData,
    updateAppFlow
  };
};
