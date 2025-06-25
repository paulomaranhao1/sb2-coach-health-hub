
import { useEffect, memo } from "react";
import { useAppState } from "@/hooks/useAppState";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { useLogger } from "@/utils/logger";
import AppScreens from "@/components/screens/AppScreens";
import GarminLayout from "@/components/layout/GarminLayout";
import { LoadingPage } from "@/components/ui/loading-states";
import GlobalErrorBoundary from "@/components/error/GlobalErrorBoundary";
import AuthWrapper from "@/components/AuthWrapper";
import GarminHomeScreen from "@/components/garmin/GarminHomeScreen";
import GarminChallenges from "@/components/garmin/GarminChallenges";
import GarminCalendar from "@/components/garmin/GarminCalendar";
import GarminFeed from "@/components/garmin/GarminFeed";
import TabsContentComponent from "@/components/layout/TabsContent";

const Index = memo(() => {
  const logger = useLogger('Index');
  const {
    showVideoWelcome,
    handleVideoWelcomeComplete,
    showWelcome,
    setShowWelcome,
    showOnboarding,
    showTutorial,
    showNewFeatures,
    setShowNewFeatures,
    activeTab,
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
      showVideoWelcome,
      showWelcome, 
      showOnboarding, 
      showTutorial, 
      hasProfile: !!userProfile 
    });
    
    return () => {
      logger.unmounted();
    };
  }, [logger, showVideoWelcome, showWelcome, showOnboarding, showTutorial, userProfile]);

  // Log Service Worker status
  useEffect(() => {
    if (swSupported && swRegistered) {
      logger.info('Service Worker successfully initialized');
    }
  }, [swSupported, swRegistered, logger]);

  // Se o vídeo de boas-vindas deve ser mostrado, mostrá-lo ANTES da autenticação
  if (showVideoWelcome) {
    logger.debug('Showing video welcome screen');
    return (
      <GlobalErrorBoundary 
        level="page" 
        name="Video Welcome Screen"
        showDebugInfo={true}
      >
        <AppScreens
          showVideoWelcome={showVideoWelcome}
          handleVideoWelcomeComplete={handleVideoWelcomeComplete}
          showWelcome={false}
          setShowWelcome={setShowWelcome}
          showOnboarding={false}
          showTutorial={false}
          showNewFeatures={false}
          setShowNewFeatures={setShowNewFeatures}
          isLoading={false}
          subscriptionLoading={false}
          handleOnboardingComplete={handleOnboardingComplete}
          handleTutorialComplete={handleTutorialComplete}
          handleTutorialSkip={handleTutorialSkip}
        />
      </GlobalErrorBoundary>
    );
  }

  // Após o vídeo, verificar autenticação
  return (
    <AuthWrapper>
      <AuthenticatedApp
        showWelcome={showWelcome}
        setShowWelcome={setShowWelcome}
        showOnboarding={showOnboarding}
        showTutorial={showTutorial}
        showNewFeatures={showNewFeatures}
        setShowNewFeatures={setShowNewFeatures}
        activeTab={activeTab}
        userProfile={userProfile}
        userStats={userStats}
        isLoading={isLoading}
        checkUserProfile={checkUserProfile}
        handleOnboardingComplete={handleOnboardingComplete}
        handleTutorialComplete={handleTutorialComplete}
        handleTutorialSkip={handleTutorialSkip}
        handleTabChange={handleTabChange}
        handleNavigateToHome={handleNavigateToHome}
      />
    </AuthWrapper>
  );
});

// Componente separado para a aplicação autenticada - GARMIN DESIGN
const AuthenticatedApp = memo(({
  showWelcome,
  setShowWelcome,
  showOnboarding,
  showTutorial,
  showNewFeatures,
  setShowNewFeatures,
  activeTab,
  userProfile,
  userStats,
  isLoading,
  checkUserProfile,
  handleOnboardingComplete,
  handleTutorialComplete,
  handleTutorialSkip,
  handleTabChange,
  handleNavigateToHome
}: any) => {
  const logger = useLogger('AuthenticatedApp');

  // Verificar perfil apenas uma vez após montagem
  useEffect(() => {
    logger.debug('Checking if user profile needs to be loaded');
    
    // Verificar se já temos dados ou se está em algum fluxo especial
    if (!userProfile && !showWelcome && !showOnboarding && !showTutorial && !showNewFeatures && !isLoading) {
      logger.info('Loading user profile');
      checkUserProfile();
    }
  }, [userProfile, showWelcome, showOnboarding, showTutorial, showNewFeatures, isLoading, checkUserProfile, logger]);

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
          showVideoWelcome={false}
          handleVideoWelcomeComplete={() => {}}
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

  logger.debug('Rendering main app with Garmin-inspired layout');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <GarminHomeScreen />;
      case 'challenges':
        return <GarminChallenges />;
      case 'calendar':
        return <GarminCalendar />;
      case 'feed':
        return <GarminFeed />;
      default:
        // For other tabs, use the existing TabsContent component
        return (
          <TabsContentComponent
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            userProfile={userProfile}
            userStats={userStats}
            onNavigateToHome={handleNavigateToHome}
          />
        );
    }
  };

  // App principal com NOVO LAYOUT GARMIN
  return (
    <GlobalErrorBoundary 
      level="page" 
      name="Main Application"
      showDebugInfo={true}
    >
      <GarminLayout
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        <GlobalErrorBoundary 
          level="section" 
          name="Tab Content"
          showDebugInfo={true}
        >
          {renderTabContent()}
        </GlobalErrorBoundary>
      </GarminLayout>
    </GlobalErrorBoundary>
  );
});

AuthenticatedApp.displayName = 'AuthenticatedApp';
Index.displayName = 'Index';

export default Index;
