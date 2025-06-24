
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserStats } from '@/types';
import { logger } from '@/utils/logger';

export const useAppState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  // Update individual state properties efficiently
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

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
  }, [searchParams, setSearchParams, updateState]);

  // Função otimizada para verificar perfil
  const checkUserProfile = useCallback(async () => {
    logger.info('Checking user profile');
    updateState({ isLoading: true });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        logger.warn('No user found');
        updateState({ showWelcome: true, isLoading: false });
        return;
      }

      logger.info('User found', { email: user.email });

      // Buscar perfil
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData) {
        logger.info('Profile found', { name: profileData.name });
        setUserProfile(profileData);
        
        if (!profileData.onboarding_completed) {
          updateState({ showOnboarding: true, isLoading: false });
          return;
        }
        
        // Buscar stats de forma não bloqueante
        try {
          const { data: stats } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (stats) {
            setUserStats(stats);
          }
        } catch (error) {
          logger.error('Error loading user stats', { error });
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
    }
  }, [toast, updateState]);

  // Handlers otimizados com useCallback
  const handleOnboardingComplete = useCallback(() => {
    logger.info('Onboarding completed');
    updateState({ showOnboarding: false, showTutorial: true });
  }, [updateState]);

  const handleTutorialComplete = useCallback(() => {
    logger.info('Tutorial completed');
    updateState({ showTutorial: false });
  }, [updateState]);

  const handleTutorialSkip = useCallback(() => {
    logger.info('Tutorial skipped');
    updateState({ showTutorial: false });
  }, [updateState]);

  const handleTabChange = useCallback((tab: string) => {
    logger.debug('Tab changed', { tab });
    updateState({ activeTab: tab, showMobileMenu: false });
    setSearchParams({ tab }, { replace: true });
  }, [setSearchParams, updateState]);

  const handleNavigateToHome = useCallback(() => {
    logger.info('Navigating to home');
    navigate('/', { replace: true });
    updateState({ activeTab: 'home' });
    setSearchParams({}, { replace: true });
  }, [navigate, setSearchParams, updateState]);

  // Sincronizar tab com URL apenas quando necessário
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== state.activeTab) {
      updateState({ activeTab: tab });
    }
  }, [searchParams, state.activeTab, updateState]);

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
    updateState
  ]);
};
