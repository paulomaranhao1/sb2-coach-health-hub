
import React, { memo, useState, useCallback, Suspense } from 'react';
import { useLogger } from '@/utils/logger';
import AppLayout from '@/components/layout/AppLayout';
import GlobalErrorBoundary from '@/components/error/GlobalErrorBoundary';
import { LoadingSection } from '@/components/ui/loading-states';

// Usar a versão otimizada
const LazyOptimizedAppTabsContent = React.lazy(() => import('@/features/navigation/components/OptimizedAppTabsContent'));

const OptimizedMainApp = memo(() => {
  const logger = useLogger('OptimizedMainApp');
  const [activeTab, setActiveTab] = useState('home');

  const handleTabChange = useCallback((tab: string) => {
    // Transition suave
    requestAnimationFrame(() => {
      setActiveTab(tab);
      logger.debug('Tab changed', { tab });
    });
  }, [logger]);

  const handleNavigateToHome = useCallback(() => {
    setActiveTab('home');
    logger.debug('Navigated to home');
  }, [logger]);

  return (
    <AppLayout>
      <GlobalErrorBoundary level="section" name="Tab Content">
        <Suspense fallback={<LoadingSection text="Carregando aplicativo..." />}>
          <LazyOptimizedAppTabsContent
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
