
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserStats } from '@/types';
import { logger } from '@/utils/logger';
import { useCache } from '@/utils/cacheManager';

export const useAppState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const cache = useCache();
  
  // Estados básicos otimizados
  const [state, setState] = useState({
    showWelcome: false,
    showOnboarding: false,
    showTutorial: false,
    showNewFeatures: false,
    activeTab: 'home',
    showMobileMenu: false,
    isLoading: false
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  // Logger específico para este hook
  const componentLogger = {
    debug: (message: string, context?: any) => logger.debug(message, context, 'useAppState'),
    info: (message: string, context?: any) => logger.info(message, context, 'useAppState'),
    warn: (message: string, context?: any) => logger.warn(message, context, 'useAppState'),
    error: (message: string, context?: any) => logger.error(message, context, 'useAppState')
  };

  // Update individual state properties efficiently
  const updateState = useCallback((updates: Partial<typeof state>) => {
    componentLogger.debug('Updating state', { updates });
    setState(prev => ({ ...prev, ...updates }));
  }, [componentLogger]);

  // Verificar tutorial via URL apenas uma vez
  useEffect(() => {
    const shouldShowTutorial = searchParams.get('showTutorial');
    if (shouldShowTutorial === 'true') {
      componentLogger.info('Tutorial requested via URL');
      updateState({ showTutorial: true });
      // Limpar URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('showTutorial');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, updateState, componentLogger]);

  // Função otimizada para verificar perfil com cache
  const checkUserProfile = useCallback(async () => {
    const timer = logger.startTimer('checkUserProfile');
    componentLogger.info('Checking user profile');
    updateState({ isLoading: true });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        componentLogger.warn('No user found');
        updateState({ showWelcome: true, isLoading: false });
        timer();
        return;
      }

      componentLogger.info('User found', { email: user.email });

      // Verificar cache primeiro
      const profileCacheKey = `profile:${user.id}`;
      const statsCacheKey = `stats:${user.id}`;
      
      let profileData = cache.get<UserProfile>(profileCacheKey);
      let statsData = cache.get<UserStats>(statsCacheKey);

      // Buscar perfil se não estiver em cache
      if (!profileData) {
        componentLogger.info('Profile not in cache, fetching from database');
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        profileData = data;
        if (profileData) {
          // Salvar no cache por 10 minutos
          cache.set(profileCacheKey, profileData, { 
            ttl: 10 * 60 * 1000, 
            tags: ['profile', 'persist']
          });
        }
      } else {
        componentLogger.info('Using cached profile data');
      }

      if (profileData) {
        componentLogger.info('Profile found', { name: profileData.name });
        setUserProfile(profileData);
        
        if (!profileData.onboarding_completed) {
          updateState({ showOnboarding: true, isLoading: false });
          timer();
          return;
        }
        
        // Buscar stats se não estiver em cache
        if (!statsData) {
          componentLogger.info('Stats not in cache, fetching from database');
          try {
            const { data: stats, error } = await supabase
              .from('user_stats')
              .select('*')
              .eq('user_id', user.id)
              .maybeSingle();

            if (error && error.code !== 'PGRST116') {
              throw error;
            }
            
            statsData = stats;
            if (statsData) {
              // Salvar no cache por 5 minutos (dados mais dinâmicos)
              cache.set(statsCacheKey, statsData, { 
                ttl: 5 * 60 * 1000, 
                tags: ['stats', 'persist']
              });
            }
          } catch (error) {
            componentLogger.error('Error loading user stats', { error });
          }
        } else {
          componentLogger.info('Using cached stats data');
        }

        if (statsData) {
          setUserStats(statsData);
        }
      } else {
        componentLogger.info('Profile not found');
        updateState({ showWelcome: true });
      }
    } catch (error) {
      componentLogger.error('Error checking user profile', { error });
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do usuário",
        variant: "destructive"
      });
    } finally {
      updateState({ isLoading: false });
      timer();
    }
  }, [toast, updateState, cache, componentLogger]);

  // Handlers otimizados com useCallback
  const handleOnboardingComplete = useCallback(() => {
    componentLogger.info('Onboarding completed');
    // Invalidar cache do perfil
    cache.invalidateByTag('profile');
    updateState({ showOnboarding: false, showTutorial: true });
  }, [updateState, cache, componentLogger]);

  const handleTutorialComplete = useCallback(() => {
    componentLogger.info('Tutorial completed');
    updateState({ showTutorial: false });
  }, [updateState, componentLogger]);

  const handleTutorialSkip = useCallback(() => {
    componentLogger.info('Tutorial skipped');
    updateState({ showTutorial: false });
  }, [updateState, componentLogger]);

  const handleTabChange = useCallback((tab: string) => {
    componentLogger.debug('Tab changed', { tab });
    updateState({ activeTab: tab, showMobileMenu: false });
    setSearchParams({ tab }, { replace: true });
  }, [setSearchParams, updateState, componentLogger]);

  const handleNavigateToHome = useCallback(() => {
    componentLogger.info('Navigating to home');
    navigate('/', { replace: true });
    updateState({ activeTab: 'home' });
    setSearchParams({}, { replace: true });
  }, [navigate, setSearchParams, updateState, componentLogger]);

  // Sincronizar tab com URL apenas quando necessário
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== state.activeTab) {
      updateState({ activeTab: tab });
    }
  }, [searchParams, state.activeTab, updateState]);

  // Função para invalidar caches relacionados ao usuário
  const invalidateUserCaches = useCallback(() => {
    componentLogger.info('Invalidating user caches');
    cache.invalidateByTag('profile');
    cache.invalidateByTag('stats');
  }, [cache, componentLogger]);

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(() => ({
    ...state,
    userProfile,
    setUserProfile,
    userStats,
    setUserStats,
    checkUserProfile,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleTabChange,
    handleNavigateToHome,
    invalidateUserCaches,
    // Helper functions
    setShowWelcome: (show: boolean) => updateState({ showWelcome: show }),
    setShowNewFeatures: (show: boolean) => updateState({ showNewFeatures: show }),
    setShowMobileMenu: (show: boolean) => updateState({ showMobileMenu: show }),
    setIsLoading: (loading: boolean) => updateState({ isLoading: loading })
  }), [
    state,
    userProfile,
    userStats,
    checkUserProfile,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleTabChange,
    handleNavigateToHome,
    invalidateUserCaches,
    updateState
  ]);
};
