
import { lazy, Suspense } from 'react';
import AuthScreen from '@/components/AuthScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';
import { LoadingPage } from '@/components/ui/loading-states';

// Lazy load todos os componentes não críticos
const LazyWelcomeScreen = lazy(() => import('@/components/welcome/ModernWelcomeScreen'));
const LazyTutorialScreen = lazy(() => import('@/components/TutorialScreen'));
const LazyMainApp = lazy(() => import('@/components/optimized/OptimizedMainApp'));

const SimpleIndexOptimized = () => {
  const {
    user,
    profile,
    loading,
    showWelcome,
    showTutorial,
    setShowWelcome,
    setShowTutorial
  } = useOptimizedAuth();

  if (loading) {
    return <LoadingPage text="Verificando acesso..." />;
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

  if (showWelcome) {
    return (
      <Suspense fallback={<LoadingPage text="Carregando boas-vindas..." />}>
        <LazyWelcomeScreen
          onContinue={() => {
            localStorage.setItem('sb2_welcome_shown', 'true');
            setShowWelcome(false);
            setShowTutorial(true);
          }}
        />
      </Suspense>
    );
  }

  if (showTutorial) {
    return (
      <Suspense fallback={<LoadingPage text="Carregando tutorial..." />}>
        <LazyTutorialScreen
          onComplete={() => {
            localStorage.setItem('sb2_tutorial_completed', 'true');
            setShowTutorial(false);
          }}
          onSkip={() => {
            localStorage.setItem('sb2_tutorial_completed', 'true');
            setShowTutorial(false);
          }}
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
