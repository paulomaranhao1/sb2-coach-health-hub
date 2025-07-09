
import React, { memo, useState, useCallback, Suspense } from 'react';
import { useLogger } from '@/utils/logger';
import AppLayout from '@/components/layout/AppLayout';
import GlobalErrorBoundary from '@/components/error/GlobalErrorBoundary';
import { LoadingSection } from '@/components/ui/loading-states';

// Lazy load tab content
const LazyAppTabsContent = React.lazy(() => import('@/features/navigation/components/AppTabsContent'));

interface OptimizedMainAppProps {
  // Props removed - data fetching moved to hook inside components
}

const OptimizedMainApp = memo(() => {
  const logger = useLogger('OptimizedMainApp');
  const [activeTab, setActiveTab] = useState('home');

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    logger.debug('Tab changed', { tab });
  }, [logger]);

  const handleNavigateToHome = useCallback(() => {
    setActiveTab('home');
    logger.debug('Navigated to home');
  }, [logger]);

  return (
    <AppLayout>
      <GlobalErrorBoundary level="section" name="Tab Content">
        <Suspense fallback={<LoadingSection text="Carregando conteúdo..." />}>
          <LazyAppTabsContent
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onNavigateToHome={handleNavigateToHome}
          />
        </Suspense>
      </GlobalErrorBoundary>
    </AppLayout>
  );
});

OptimizedMainApp.displayName = 'OptimizedMainApp';

export default OptimizedMainApp;
