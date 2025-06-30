
import { useCallback, useMemo } from 'react';
import { useConsolidatedAppData } from './useConsolidatedAppData';
import { useLogger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';

export const useOptimizedAppState = () => {
  const { data, loading, updateAppFlow, updateProfileData, invalidateCache } = useConsolidatedAppData();
  const logger = useLogger('useOptimizedAppState');

  // Memoized state values
  const appState = useMemo(() => ({
    showVideoWelcome: data.showVideoWelcome,
    showWelcome: data.showWelcome,
    showOnboarding: data.showOnboarding,
    showTutorial: data.showTutorial,
    showNewFeatures: data.showNewFeatures,
    userProfile: data.profile,
    userStats: data.stats,
    subscription: data.subscription,
    isLoading: loading,
    isAuthenticated: data.isAuthenticated
  }), [data, loading]);

  // Optimized handlers
  const handleVideoWelcomeComplete = useCallback(() => {
    localStorage.setItem('sb2_video_welcome_shown', 'true');
    updateAppFlow({ showVideoWelcome: false, showWelcome: true });
    logger.info('Video welcome completed');
  }, [updateAppFlow, logger]);

  const handleWelcomeComplete = useCallback(() => {
    updateAppFlow({ showWelcome: false, showOnboarding: true });
    logger.info('Welcome completed');
  }, [updateAppFlow, logger]);

  const handleOnboardingComplete = useCallback(async () => {
    try {
      // Update the user profile to mark onboarding as completed
      const { data: { user } } = await supabase.auth.getUser();
      if (user && data.profile) {
        const { error } = await supabase
          .from('user_profiles')
          .update({ onboarding_completed: true })
          .eq('user_id', user.id);

        if (error) {
          logger.error('Error updating onboarding status', { error });
        } else {
          // Update local state
          updateProfileData({ onboarding_completed: true });
        }
      }

      // Update app flow
      localStorage.setItem('sb2_onboarding_completed', 'true');
      updateAppFlow({ 
        showOnboarding: false, 
        showTutorial: true 
      });

      logger.info('Onboarding completed');
    } catch (error) {
      logger.error('Error completing onboarding', { error });
      // Still update the flow even if database update fails
      localStorage.setItem('sb2_onboarding_completed', 'true');
      updateAppFlow({ 
        showOnboarding: false, 
        showTutorial: true 
      });
    }
  }, [updateAppFlow, updateProfileData, data.profile, logger]);

  const handleTutorialComplete = useCallback(() => {
    localStorage.setItem('sb2_tutorial_completed', 'true');
    updateAppFlow({ 
      showTutorial: false, 
      showNewFeatures: true 
    });
    logger.info('Tutorial completed');
  }, [updateAppFlow, logger]);

  const handleTutorialSkip = useCallback(() => {
    localStorage.setItem('sb2_tutorial_completed', 'true');
    updateAppFlow({ 
      showTutorial: false, 
      showNewFeatures: true 
    });
    logger.info('Tutorial skipped');
  }, [updateAppFlow, logger]);

  const handleNewFeaturesComplete = useCallback(() => {
    localStorage.setItem('sb2_new_features_shown_v2', 'true');
    updateAppFlow({ showNewFeatures: false });
    logger.info('New features completed');
  }, [updateAppFlow, logger]);

  return {
    ...appState,
    handleVideoWelcomeComplete,
    handleWelcomeComplete,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleNewFeaturesComplete,
    invalidateCache
  };
};
