import { lazy, Suspense } from 'react';
import AuthScreen from '@/components/AuthScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';
import { LoadingPage } from '@/components/ui/loading-states';

// Lazy load apenas o app principal
const LazyMainApp = lazy(() => import('@/components/optimized/OptimizedMainApp'));

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
      <OnboardingScreen 
        onComplete={() => window.location.reload()} 
      />
    );
  }

  return (
    <Suspense fallback={<LoadingPage text="Carregando aplicativo..." />}>
      <LazyMainApp />
    </Suspense>
  );
};

export default SimpleIndexOptimized;