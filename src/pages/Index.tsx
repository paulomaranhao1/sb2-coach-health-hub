
import { useEffect, memo } from "react";
import { useAppState } from "@/hooks/useAppState";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import AppScreens from "@/components/screens/AppScreens";
import AppLayout from "@/components/layout/AppLayout";
import TabsContentComponent from "@/components/layout/TabsContent";
import { LoadingPage } from "@/components/ui/loading-states";
import SectionErrorBoundary from "@/components/error/SectionErrorBoundary";
import { logger } from "@/utils/logger";

const Index = memo(() => {
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

  // Verificar perfil apenas uma vez após montagem
  useEffect(() => {
    logger.debug('Index: Checking if user profile needs to be loaded');
    
    // Verificar se já temos dados ou se está em algum fluxo especial
    if (!userProfile && !showWelcome && !showOnboarding && !showTutorial && !showNewFeatures && !isLoading) {
      logger.info('Index: Loading user profile');
      checkUserProfile();
    }
  }, [userProfile, showWelcome, showOnboarding, showTutorial, showNewFeatures, isLoading, checkUserProfile]);

  // Log Service Worker status
  useEffect(() => {
    if (swSupported && swRegistered) {
      logger.info('Service Worker successfully initialized');
    }
  }, [swSupported, swRegistered]);

  // Renderizar telas especiais
  const shouldShowSpecialScreen = showWelcome || showOnboarding || showTutorial || showNewFeatures || isLoading;

  logger.debug('Index: Current state', {
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
      <SectionErrorBoundary sectionName="Telas de Boas-vindas">
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
      </SectionErrorBoundary>
    );
  }

  logger.debug('Index: Rendering main app');

  // App principal
  return (
    <SectionErrorBoundary sectionName="Aplicação Principal">
      <AppLayout
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      >
        <SectionErrorBoundary sectionName="Conteúdo das Abas">
          <TabsContentComponent
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            userProfile={userProfile}
            userStats={userStats}
            onNavigateToHome={handleNavigateToHome}
          />
        </SectionErrorBoundary>
      </AppLayout>
    </SectionErrorBoundary>
  );
});

Index.displayName = 'Index';

export default Index;
