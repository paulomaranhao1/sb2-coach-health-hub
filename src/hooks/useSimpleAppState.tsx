
import { useState, useEffect, useCallback } from 'react';
import { mockUserProfile, mockUserStats, mockSubscription } from '@/mocks/userData';

export const useSimpleAppState = () => {
  // Estados simples com localStorage
  const [showVideoWelcome, setShowVideoWelcome] = useState(() => 
    !localStorage.getItem('sb2_video_welcome_shown')
  );
  
  const [showWelcome, setShowWelcome] = useState(() => 
    !localStorage.getItem('sb2_welcome_completed')
  );
  
  const [showOnboarding, setShowOnboarding] = useState(() => 
    !localStorage.getItem('sb2_onboarding_completed')
  );
  
  const [showTutorial, setShowTutorial] = useState(() => 
    !localStorage.getItem('sb2_tutorial_completed')
  );
  
  const [showNewFeatures, setShowNewFeatures] = useState(() => 
    !localStorage.getItem('sb2_new_features_shown_v2')
  );

  const [isLoading, setIsLoading] = useState(false);

  // Dados mockados - sempre disponíveis instantaneamente
  const userProfile = mockUserProfile;
  const userStats = mockUserStats;
  const subscription = mockSubscription;
  const isAuthenticated = true; // Para simplificar, sempre autenticado

  // Handlers simples
  const handleVideoWelcomeComplete = useCallback(() => {
    localStorage.setItem('sb2_video_welcome_shown', 'true');
    setShowVideoWelcome(false);
    setShowWelcome(true);
  }, []);

  const handleWelcomeComplete = useCallback(() => {
    localStorage.setItem('sb2_welcome_completed', 'true');
    setShowWelcome(false);
    setShowOnboarding(true);
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('sb2_onboarding_completed', 'true');
    setShowOnboarding(false);
    setShowTutorial(true);
  }, []);

  const handleTutorialComplete = useCallback(() => {
    localStorage.setItem('sb2_tutorial_completed', 'true');
    setShowTutorial(false);
    setShowNewFeatures(true);
  }, []);

  const handleTutorialSkip = useCallback(() => {
    localStorage.setItem('sb2_tutorial_completed', 'true');
    setShowTutorial(false);
    setShowNewFeatures(true);
  }, []);

  const handleNewFeaturesComplete = useCallback(() => {
    localStorage.setItem('sb2_new_features_shown_v2', 'true');
    setShowNewFeatures(false);
  }, []);

  return {
    // Estados
    showVideoWelcome,
    showWelcome,
    showOnboarding,
    showTutorial,
    showNewFeatures,
    isLoading,
    isAuthenticated,
    
    // Dados
    userProfile,
    userStats,
    subscription,
    
    // Handlers
    handleVideoWelcomeComplete,
    handleWelcomeComplete,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleNewFeaturesComplete,
    
    // Funções de controle simples
    setShowWelcome,
    setShowNewFeatures
  };
};
