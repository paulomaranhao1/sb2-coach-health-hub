
import { useEffect, memo } from "react";
import { useAppState } from "@/hooks/useAppState";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { useLogger } from "@/utils/logger";
import AppScreens from "@/components/screens/AppScreens";
import AppLayout from "@/components/layout/AppLayout";
import TabsContentComponent from "@/components/layout/TabsContent";
import { LoadingPage } from "@/components/ui/loading-states";
import GlobalErrorBoundary from "@/components/error/GlobalErrorBoundary";

const Index = memo(() => {
  const logger = useLogger('Index');
  const {
    showWelcome,
    setShowWelcome,
    showOnboarding,
    showTutorial,
    showNewFeatures,
    setShowNewFeatures,
    activeTab,
    setShowMobileMenu,
    showMobileMenu,
    userProfile,
    userStats,
    isLoading,
    checkUserProfile,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleTabChange,
    handleNavigateToHome
  } = useAppState();

  // Initialize Service Worker
  const { isSupported: swSupported, isRegistered: swRegistered } = useServiceWorker();

  // Log component mount/unmount
  useEffect(() => {
    logger.mounted({ 
      showWelcome, 
      showOnboarding, 
      showTutorial, 
      hasProfile: !!userProfile 
    });
    
    return () => {
      logger.unmounted();
    };
  }, [logger, showWelcome, showOnboarding, showTutorial, userProfile]);

  // Verificar perfil apenas uma vez após montagem
  useEffect(() => {
    logger.debug('Checking if user profile needs to be loaded');
    
    // Verificar se já temos dados ou se está em algum fluxo especial
    if (!userProfile && !showWelcome && !showOnboarding && !showTutorial && !showNewFeatures && !isLoading) {
      logger.info('Loading user profile');
      checkUserProfile();
    }
  }, [userProfile, showWelcome, showOnboarding, showTutorial, showNewFeatures, isLoading, checkUserProfile, logger]);

  // Log Service Worker status
  useEffect(() => {
    if (swSupported && swRegistered) {
      logger.info('Service Worker successfully initialized');
    }
  }, [swSupported, swRegistered, logger]);

  // Renderizar telas especiais
  const shouldShowSpecialScreen = showWelcome || showOnboarding || showTutorial || showNewFeatures || isLoading;

  logger.debug('Current state', {
    shouldShowSpecialScreen,
    showWelcome,
    showOnboarding,
    showTutorial,
    showNewFeatures,
    isLoading,
    hasProfile: !!userProfile
  });

  if (shouldShowSpecialScreen) {
    // Use the new loading page for better UX
    if (isLoading) {
      return <LoadingPage text="Carregando SB2coach.ai..." />;
    }

    return (
      <GlobalErrorBoundary 
        level="page" 
        name="Welcome Screens"
        showDebugInfo={true}
      >
        <AppScreens
          showWelcome={showWelcome}
          setShowWelcome={setShowWelcome}
          showOnboarding={showOnboarding}
          showTutorial={showTutorial}
          showNewFeatures={showNewFeatures}
          setShowNewFeatures={setShowNewFeatures}
          isLoading={isLoading}
          subscriptionLoading={false}
          handleOnboardingComplete={handleOnboardingComplete}
          handleTutorialComplete={handleTutorialComplete}
          handleTutorialSkip={handleTutorialSkip}
        />
      </GlobalErrorBoundary>
    );
  }

  logger.debug('Rendering main app');

  // App principal
  return (
    <GlobalErrorBoundary 
      level="page" 
      name="Main Application"
      showDebugInfo={true}
    >
      <AppLayout
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      >
        <GlobalErrorBoundary 
          level="section" 
          name="Tab Content"
          showDebugInfo={true}
        >
          <TabsContentComponent
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            userProfile={userProfile}
            userStats={userStats}
            onNavigateToHome={handleNavigateToHome}
          />
        </GlobalErrorBoundary>
      </AppLayout>
    </GlobalErrorBoundary>
  );
});

Index.displayName = 'Index';

export default Index;
