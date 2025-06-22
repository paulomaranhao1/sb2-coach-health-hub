
import { useEffect, memo } from "react";
import { useAppState } from "@/hooks/useAppState";
import AppScreens from "@/components/screens/AppScreens";
import AppLayout from "@/components/layout/AppLayout";
import TabsContentComponent from "@/components/layout/TabsContent";

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
    theme,
    toggleTheme,
    checkUserProfile,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleTabChange,
    handleNavigateToHome
  } = useAppState();

  // Inicialização única - SIMPLIFICADA
  useEffect(() => {
    console.log('Index: Verificando perfil do usuário...');
    checkUserProfile();
  }, []);

  // Renderizar telas especiais
  const shouldShowSpecialScreen = showWelcome || showOnboarding || showTutorial || showNewFeatures || isLoading;

  if (shouldShowSpecialScreen) {
    return (
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
    );
  }

  // App principal
  return (
    <AppLayout
      theme={theme}
      toggleTheme={toggleTheme}
      showMobileMenu={showMobileMenu}
      setShowMobileMenu={setShowMobileMenu}
      activeTab={activeTab}
      handleTabChange={handleTabChange}
    >
      <TabsContentComponent
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        userProfile={userProfile}
        userStats={userStats}
        onNavigateToHome={handleNavigateToHome}
      />
    </AppLayout>
  );
});

Index.displayName = 'Index';

export default Index;
