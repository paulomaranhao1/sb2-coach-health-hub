
import React from 'react';
import { useSimpleAppState } from '@/hooks/useSimpleAppState';
import AppScreens from '@/components/screens/AppScreens';
import OptimizedMainApp from '@/components/optimized/OptimizedMainApp';
import AuthWrapper from '@/components/AuthWrapper';
import { LoadingPage } from '@/components/ui/loading-states';

const SimpleIndex = () => {
  const {
    showVideoWelcome,
    showWelcome,
    showOnboarding,
    showTutorial,
    showNewFeatures,
    isLoading,
    userProfile,
    userStats,
    handleVideoWelcomeComplete,
    handleWelcomeComplete,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleNewFeaturesComplete,
    setShowWelcome,
    setShowNewFeatures
  } = useSimpleAppState();

  // Mostrar loading se necessário
  if (isLoading) {
    return <LoadingPage text="Carregando SB2coach.ai..." />;
  }

  // Mostrar telas de fluxo se necessário
  if (showVideoWelcome || showWelcome || showOnboarding || showTutorial || showNewFeatures) {
    return (
      <AppScreens
        showVideoWelcome={showVideoWelcome}
        handleVideoWelcomeComplete={handleVideoWelcomeComplete}
        showWelcome={showWelcome}
        setShowWelcome={setShowWelcome}
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
