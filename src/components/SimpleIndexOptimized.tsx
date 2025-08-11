import { lazy, Suspense } from 'react';
import AuthScreen from '@/components/AuthScreen';

import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';
import { LoadingPage } from '@/components/ui/loading-states';

// Lazy load app principal e onboarding
const LazyMainApp = lazy(() => import('@/components/optimized/OptimizedMainApp'));
const LazyOnboarding = lazy(() => import('@/components/OnboardingScreen'));

const SimpleIndexOptimized = () => {
  const { user, profile, loading } = useOptimizedAuth();

  if (loading) {
    return <LoadingPage text="Carregando..." />;
  }

  if (!user) {
    return <AuthScreen />;
  }

if (!profile?.onboarding_completed) {
    return (
      <Suspense fallback={<LoadingPage text="Carregando onboarding..." />}>
        <LazyOnboarding 
          onComplete={() => window.location.reload()} 
        />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingPage text="Carregando aplicativo..." />}>
      <LazyMainApp />
    </Suspense>
  );
};

export default SimpleIndexOptimized;