import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserStats } from '@/types';
import { useLogger } from '@/utils/logger';
import { useUserCache } from '@/hooks/useUnifiedCache';

export const useAppState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const cache = useUserCache();
  const logger = useLogger('useAppState');
  
  // Verificar se o vídeo de boas-vindas já foi assistido
  const videoWelcomeCompleted = localStorage.getItem('videoWelcomeCompleted') === 'true';
  
  // Estados básicos otimizados
  const [state, setState] = useState({
    showVideoWelcome: !videoWelcomeCompleted, // Mostrar vídeo apenas se não foi assistido
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

  // Update individual state properties efficiently
  const updateState = useCallback((updates: Partial<typeof state>) => {
    logger.debug('Updating state', { updates });
    setState(prev => ({ ...prev, ...updates }));
  }, [logger]);

  // Handler para quando o vídeo de boas-vindas terminar
  const handleVideoWelcomeComplete = useCallback(() => {
    logger.info('Video welcome completed');
    localStorage.setItem('videoWelcomeCompleted', 'true');
    updateState({ showVideoWelcome: false, showWelcome: true });
  }, [updateState, logger]);

  // Verificar tutorial via URL apenas uma vez
  useEffect(() => {
    const shouldShowTutorial = searchParams.get('showTutorial');
    if (shouldShowTutorial === 'true') {
      logger.info('Tutorial requested via URL');
      updateState({ showTutorial: true });
      // Limpar URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('showTutorial');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, updateState, logger]);

  // Função otimizada para verificar perfil com cache
  const checkUserProfile = useCallback(async () => {
    const startTime = Date.now();
    logger.info('Checking user profile');
    updateState({ isLoading: true });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        logger.warn('No user found');
        updateState({ showWelcome: true, isLoading: false });
        const elapsedTime = Date.now() - startTime;
        logger.debug('Check completed - no user', { elapsedTime });
        return;
      }

      logger.info('User found', { email: user.email });

      // Verificar cache primeiro
      let profileData = cache.get<UserProfile>(`profile:${user.id}`);
      let statsData = cache.get<UserStats>(`stats:${user.id}`);

      // Buscar perfil se não estiver em cache
      if (!profileData) {
        logger.info('Profile not in cache, fetching from database');
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
          cache.set(`profile:${user.id}`, profileData, 10 * 60 * 1000);
        }
      } else {
        logger.info('Using cached profile data');
      }

      if (profileData) {
        logger.info('Profile found', { name: profileData.name });
        setUserProfile(profileData);
        
        if (!profileData.onboarding_completed) {
          updateState({ showOnboarding: true, isLoading: false });
          const elapsedTime = Date.now() - startTime;
          logger.debug('Check completed - needs onboarding', { elapsedTime });
          return;
        }
        
        // Buscar stats se não estiver em cache
        if (!statsData) {
          logger.info('Stats not in cache, fetching from database');
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
              cache.set(`stats:${user.id}`, statsData, 5 * 60 * 1000);
            }
          } catch (error) {
            logger.error('Error loading user stats', { error });
          }
        } else {
          logger.info('Using cached stats data');
        }

        if (statsData) {
          setUserStats(statsData);
        }
      } else {
        logger.info('Profile not found');
        updateState({ showWelcome: true });
      }
    } catch (error) {
      logger.error('Error checking user profile', { error });
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do usuário",
        variant: "destructive"
      });
    } finally {
      updateState({ isLoading: false });
      const elapsedTime = Date.now() - startTime;
      logger.debug('Check completed', { elapsedTime });
    }
  }, [toast, updateState, cache, logger]);

  // Handlers otimizados com useCallback
  const handleOnboardingComplete = useCallback(() => {
    logger.info('Onboarding completed');
    // Invalidar cache do perfil
    cache.invalidateAll();
    updateState({ showOnboarding: false, showTutorial: true });
  }, [updateState, cache, logger]);

  const handleTutorialComplete = useCallback(() => {
    logger.info('Tutorial completed');
    updateState({ showTutorial: false });
  }, [updateState, logger]);

  const handleTutorialSkip = useCallback(() => {
    logger.info('Tutorial skipped');
    updateState({ showTutorial: false });
  }, [updateState, logger]);

  const handleTabChange = useCallback((tab: string) => {
    logger.debug('Tab changed', { tab });
    updateState({ activeTab: tab, showMobileMenu: false });
    setSearchParams({ tab }, { replace: true });
  }, [setSearchParams, updateState, logger]);

  const handleNavigateToHome = useCallback(() => {
    logger.info('Navigating to home');
    navigate('/', { replace: true });
    updateState({ activeTab: 'home' });
    setSearchParams({}, { replace: true });
  }, [navigate, setSearchParams, updateState, logger]);

  // Sincronizar tab com URL apenas quando necessário
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== state.activeTab) {
      updateState({ activeTab: tab });
    }
  }, [searchParams, state.activeTab, updateState]);

  // Função para invalidar caches relacionados ao usuário
  const invalidateUserCaches = useCallback(() => {
    logger.info('Invalidating user caches');
    cache.invalidateAll();
  }, [cache, logger]);

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(() => ({
    ...state,
    userProfile,
    setUserProfile,
    userStats,
    setUserStats,
    checkUserProfile,
    handleVideoWelcomeComplete,
    handleOnboardingComplete: useCallback(() => {
      logger.info('Onboarding completed');
      cache.invalidateAll();
      updateState({ showOnboarding: false, showTutorial: true });
    }, [updateState, cache, logger]),
    handleTutorialComplete: useCallback(() => {
      logger.info('Tutorial completed');
      updateState({ showTutorial: false });
    }, [updateState, logger]),
    handleTutorialSkip: useCallback(() => {
      logger.info('Tutorial skipped');
      updateState({ showTutorial: false });
    }, [updateState, logger]),
    handleTabChange: useCallback((tab: string) => {
      logger.debug('Tab changed', { tab });
      updateState({ activeTab: tab, showMobileMenu: false });
      setSearchParams({ tab }, { replace: true });
    }, [setSearchParams, updateState, logger]),
    handleNavigateToHome: useCallback(() => {
      logger.info('Navigating to home');
      navigate('/', { replace: true });
      updateState({ activeTab: 'home' });
      setSearchParams({}, { replace: true });
    }, [navigate, setSearchParams, updateState, logger]),
    invalidateUserCaches: useCallback(() => {
      logger.info('Invalidating user caches');
      cache.invalidateAll();
    }, [cache, logger]),
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
    handleVideoWelcomeComplete,
    updateState,
    cache,
    logger,
    toast,
    navigate,
    setSearchParams,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleTabChange,
    handleNavigateToHome,
    invalidateUserCaches
  ]);
};
