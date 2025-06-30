
import React, { memo, useState, useCallback, Suspense } from 'react';
import { useLogger } from '@/utils/logger';
import AppLayout from '@/components/layout/AppLayout';
import GlobalErrorBoundary from '@/components/error/GlobalErrorBoundary';
import { LoadingSection } from '@/components/ui/loading-states';

// Lazy load tab content
const LazyTabsContent = React.lazy(() => import('@/components/layout/TabsContent'));

interface OptimizedMainAppProps {
  userProfile: any;
  userStats: any;
}

const OptimizedMainApp = memo(({ userProfile, userStats }: OptimizedMainAppProps) => {
  const logger = useLogger('OptimizedMainApp');
  const [activeTab, setActiveTab] = useState('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setShowMobileMenu(false); // Close mobile menu on tab change
    logger.debug('Tab changed', { tab });
  }, [logger]);

  const handleNavigateToHome = useCallback(() => {
    setActiveTab('home');
    logger.debug('Navigated to home');
  }, [logger]);

  return (
    <AppLayout
      showMobileMenu={showMobileMenu}
      setShowMobileMenu={setShowMobileMenu}
      activeTab={activeTab}
      handleTabChange={handleTabChange}
    >
      <GlobalErrorBoundary level="section" name="Tab Content">
        <Suspense fallback={<LoadingSection text="Carregando conteúdo..." />}>
          <LazyTabsContent
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            userProfile={userProfile}
            userStats={userStats}
            onNavigateToHome={handleNavigateToHome}
          />
        </Suspense>
      </GlobalErrorBoundary>
    </AppLayout>
  );
});

OptimizedMainApp.displayName = 'OptimizedMainApp';

export default OptimizedMainApp;
