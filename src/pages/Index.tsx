
import { useEffect } from "react";
import { useAppState } from "@/hooks/useAppState";
import AppScreens from "@/components/screens/AppScreens";
import AppLayout from "@/components/layout/AppLayout";
import TabsContentComponent from "@/components/layout/TabsContent";

const Index = () => {
  const {
    showWelcome,
    setShowWelcome,
    showOnboarding,
    showTutorial,
    showNewFeatures,
    setShowNewFeatures,
    activeTab,
    setActiveTab,
    showMobileMenu,
    setShowMobileMenu,
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

  useEffect(() => {
    console.log('Index: Componente montado, verificando perfil...');
    checkUserProfile();
    
    // Event listeners para comunicação entre componentes
    const handleShowTutorial = () => {
      console.log('Index: Evento showTutorial recebido');
      // A lógica de tutorial é controlada pelo estado no useAppState
    };
    
    const handleNavigateToSupplements = () => {
      console.log('Index: Navegando para suplementos');
      handleTabChange('supplement');
    };
    
    window.addEventListener('showTutorial', handleShowTutorial);
    window.addEventListener('navigateToSupplements', handleNavigateToSupplements);
    
    return () => {
      window.removeEventListener('showTutorial', handleShowTutorial);
      window.removeEventListener('navigateToSupplements', handleNavigateToSupplements);
    };
  }, [checkUserProfile, handleTabChange]);

  // Renderizar telas especiais (welcome, onboarding, tutorial, etc.)
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

  // Renderizar app principal
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
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        userStats={userStats}
        onNavigateToHome={handleNavigateToHome}
      />
    </AppLayout>
  );
};

export default Index;
