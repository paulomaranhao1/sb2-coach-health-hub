
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
    checkUserProfile();
    
    // Listener para mostrar tutorial quando solicitado
    const handleShowTutorial = () => {
      // This would be handled by the tutorial state in useAppState
    };
    
    // Listener para navegar para suplementos
    const handleNavigateToSupplements = () => {
      setActiveTab('supplement');
    };
    
    window.addEventListener('showTutorial', handleShowTutorial);
    window.addEventListener('navigateToSupplements', handleNavigateToSupplements);
    
    return () => {
      window.removeEventListener('showTutorial', handleShowTutorial);
      window.removeEventListener('navigateToSupplements', handleNavigateToSupplements);
    };
  }, []);

  // Handle special screens (welcome, onboarding, tutorial, etc.)
  const screenComponent = (
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

  if (screenComponent) {
    return screenComponent;
  }

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
