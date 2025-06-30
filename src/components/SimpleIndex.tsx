
import React from 'react';
import { useSimpleAppState } from '@/hooks/useSimpleAppState';
import AppScreens from '@/components/screens/AppScreens';
import OptimizedMainApp from '@/components/optimized/OptimizedMainApp';
import AuthWrapper from '@/components/AuthWrapper';
import { LoadingPage } from '@/components/ui/loading-states';

const SimpleIndex = () => {
  const {
    showOnboarding,
    showTutorial,
    showNewFeatures,
    isLoading,
    userProfile,
    userStats,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleNewFeaturesComplete,
    setShowNewFeatures
  } = useSimpleAppState();

  // Mostrar loading se necessário
  if (isLoading) {
    return <LoadingPage text="Carregando SB2coach.ai..." />;
  }

  // Mostrar telas de fluxo se necessário - removendo video e welcome
  if (showOnboarding || showTutorial || showNewFeatures) {
    return (
      <AppScreens
        showVideoWelcome={false}
        handleVideoWelcomeComplete={() => {}}
        showWelcome={false}
        setShowWelcome={() => {}}
        showOnboarding={showOnboarding}
        showTutorial={showTutorial}
        showNewFeatures={showNewFeatures}
        setShowNewFeatures={setShowNewFeatures}
        isLoading={false}
        subscriptionLoading={false}
        handleOnboardingComplete={handleOnboardingComplete}
        handleTutorialComplete={handleTutorialComplete}
        handleTutorialSkip={handleTutorialSkip}
      />
    );
  }

  // Mostrar app principal
  return (
    <AuthWrapper>
      <OptimizedMainApp 
        userProfile={userProfile}
        userStats={userStats}
      />
    </AuthWrapper>
  );
};

export default SimpleIndex;
