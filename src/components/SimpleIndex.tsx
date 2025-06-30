
import React from 'react';
import { useSimpleAppState } from '@/hooks/useSimpleAppState';
import AppScreens from '@/components/screens/AppScreens';
import OptimizedMainApp from '@/components/optimized/OptimizedMainApp';
import AuthScreen from '@/components/AuthScreen';
import { LoadingPage } from '@/components/ui/loading-states';

const SimpleIndex = () => {
  const {
    showOnboarding,
    showTutorial,
    showNewFeatures,
    isLoading,
    isAuthenticated,
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

  // Se não está autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Mostrar telas de fluxo se necessário
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
    <OptimizedMainApp 
      userProfile={userProfile}
      userStats={userStats}
    />
  );
};

export default SimpleIndex;
