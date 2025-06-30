
import React, { memo, Suspense } from 'react';
import { useOptimizedAppState } from '@/hooks/useOptimizedAppState';
import { useLogger } from '@/utils/logger';
import { LoadingPage } from '@/components/ui/loading-states';
import GlobalErrorBoundary from '@/components/error/GlobalErrorBoundary';
import AuthWrapper from '@/components/AuthWrapper';

// Lazy load components for better performance
const LazyAppScreens = React.lazy(() => import('@/components/screens/AppScreens'));
const LazyMainApp = React.lazy(() => import('./OptimizedMainApp'));

const OptimizedIndex = memo(() => {
  const logger = useLogger('OptimizedIndex');
  const {
    showVideoWelcome,
    showWelcome,
    showOnboarding,
    showTutorial,
    showNewFeatures,
    userProfile,
    userStats,
    isLoading,
    isAuthenticated,
    handleVideoWelcomeComplete,
    handleWelcomeComplete,
    handleOnboardingComplete,
    handleTutorialComplete,
    handleTutorialSkip,
    handleNewFeaturesComplete
  } = useOptimizedAppState();

  // Early return for video welcome (before auth check)
  if (showVideoWelcome) {
    return (
      <GlobalErrorBoundary level="page" name="Video Welcome">
        <Suspense fallback={<LoadingPage text="Carregando..." />}>
          <LazyAppScreens
            showVideoWelcome={true}
            handleVideoWelcomeComplete={handleVideoWelcomeComplete}
            showWelcome={false}
            setShowWelcome={() => {}}
            showOnboarding={false}
            showTutorial={false}
            showNewFeatures={false}
            setShowNewFeatures={() => {}}
            isLoading={false}
            subscriptionLoading={false}
            handleOnboardingComplete={handleOnboardingComplete}
            handleTutorialComplete={handleTutorialComplete}
            handleTutorialSkip={handleTutorialSkip}
          />
        </Suspense>
      </GlobalErrorBoundary>
    );
  }

  // Show loading while data is being fetched
  if (isLoading) {
    return <LoadingPage text="Carregando SB2coach.ai..." />;
  }

  return (
    <AuthWrapper>
      <GlobalErrorBoundary level="page" name="Main Application">
        {/* Show app flow screens */}
        {(showWelcome || showOnboarding || showTutorial || showNewFeatures) ? (
          <Suspense fallback={<LoadingPage text="Carregando..." />}>
            <LazyAppScreens
              showVideoWelcome={false}
              handleVideoWelcomeComplete={handleVideoWelcomeComplete}
              showWelcome={showWelcome}
              setShowWelcome={() => {}}
              showOnboarding={showOnboarding}
              showTutorial={showTutorial}
              showNewFeatures={showNewFeatures}
              setShowNewFeatures={() => {}}
              isLoading={false}
              subscriptionLoading={false}
              handleOnboardingComplete={handleOnboardingComplete}
              handleTutorialComplete={handleTutorialComplete}
              handleTutorialSkip={handleTutorialSkip}
            />
          </Suspense>
        ) : (
          /* Main app */
          <Suspense fallback={<LoadingPage text="Carregando aplicativo..." />}>
            <LazyMainApp 
              userProfile={userProfile}
              userStats={userStats}
            />
          </Suspense>
        )}
      </GlobalErrorBoundary>
    </AuthWrapper>
  );
});

OptimizedIndex.displayName = 'OptimizedIndex';

export default OptimizedIndex;
